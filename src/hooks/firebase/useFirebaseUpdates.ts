import { doc, setDoc } from "firebase/firestore"
import { mealsCol, usersCol, weeksCol } from "../../services/firebase"
import { useAuthContext } from "../useAuthContext"
import { UserPreferences } from "../../types/User.types"
import { useErrorHandler } from "../useErrorHandler"
import { CreateMealSchema } from "../../schemas/MealSchemas"
import { v4 } from 'uuid'
import { getMealPlanObject } from "../../helpers/restructure-object"
import { findLastWeekOfTheYear } from "../../helpers/dates"

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()

	const createNewWeek = (mealIds: string[], mealsPerDay: UserPreferences['mealsPerDay'], weekNumber: number, year: number) => {
		if (!activeUser) { throw new Error("No active user") }
		const lastweekOfTheYear = findLastWeekOfTheYear(year)
		if (weekNumber > lastweekOfTheYear) { throw new Error("That week doesn't exist") }

		// create uuid
		const _id = v4()

		const mealsObject = getMealPlanObject(mealIds, mealsPerDay)

		// creating a new document reference with a uuid in 'meals' collection in firebase db
		const docRef = doc(weeksCol, _id)

		// setting the document with data from the user
		return setDoc(docRef, {
			_id,
			owner: activeUser.uid, // userId of the creator
			weekNumber,
			year,
			mealsPerDay,
			meals: mealsObject,
		})
	}

	const createNewMeal = (data: CreateMealSchema, starRating: number | null, imageUrl: string | null | undefined) => {
		if (!activeUser) { throw new Error("No active user") }

		// create uuid
		const _id = v4()

		// creating a new document reference with a uuid in 'meals' collection in firebase db
		const docRef = doc(mealsCol, _id)

		// setting the document with data from the user
		return setDoc(docRef, {
			...data,
			_id,
			owner: activeUser.uid, // userId of the creator
			rating: starRating,
			imageUrl,
		})
	}

	const updateUserPreferences = (choice: UserPreferences[keyof UserPreferences], preference: keyof UserPreferences) => {
		if (!activeUser) { throw new Error("No active user") }

		const docRef = doc(usersCol, activeUser.uid)

		// updating the Firebase db
		return setDoc(docRef, {
			preferences: {
				[preference]: choice,
			}
		}, { merge: true })
	}

	const updateFirebaseDb = async (options: UserPreferences[keyof UserPreferences], preference: keyof UserPreferences) => {
		resetError()

		try {
			setLoadingStatus(true)

			// logic for updating preferences in the db
			await updateUserPreferences(options, preference)

		} catch (error) {
			handleError(error)

		} finally {
			setLoadingStatus(false)
		}
	}

	return {
		// functions
		updateUserPreferences,
		updateFirebaseDb,
		createNewMeal,
		createNewWeek,

		// error and loading states
		errorMsg,
		resetError,
		handleError,
		loading,
		setLoadingStatus,

	}
}

