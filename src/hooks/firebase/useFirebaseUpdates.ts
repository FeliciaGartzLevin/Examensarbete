import { doc, setDoc, updateDoc, where } from "firebase/firestore"
import { fetchFirebaseDocs, mealsCol, previewsCol, usersCol, weeksCol } from "../../services/firebase"
import { useAuthContext } from "../useAuthContext"
import { UserPreferences } from "../../types/User.types"
import { useErrorHandler } from "../useErrorHandler"
import { CreateMealSchema } from "../../schemas/MealSchemas"
import { getEmptyPreview, getMealPlanObject } from "../../helpers/restructure-object"
import { findLastWeekOfTheYear } from "../../helpers/dates"
import { WeekPlan } from "../../types/WeekPlan.types"
import { compact } from "lodash"
import { v4 } from 'uuid'

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()

	const getWeekPlan = (displayedWeek: number, displayedYear: number) => {
		if (!activeUser) { throw new Error("No active user") }

		return fetchFirebaseDocs<WeekPlan>(
			weeksCol,
			[
				where('owner', '==', activeUser.uid),
				where('weekNumber', '==', displayedWeek),
				where('year', '==', displayedYear),
			]
		)
	}

	const getPreview = (displayedWeek: number, displayedYear: number, previewId?: string) => {
		if (!activeUser) { throw new Error("No active user") }

		return fetchFirebaseDocs<WeekPlan>(
			previewsCol,
			compact([
				where('owner', '==', activeUser.uid),
				where('weekNumber', '==', displayedWeek),
				where('year', '==', displayedYear),
				previewId
					? where("_id", "==", previewId)
					: null
			])
		)
	}

	const updatePreview = (preview: WeekPlan) => {
		const docRef = doc(previewsCol, preview._id)

		return updateDoc(docRef, preview)
	}

	const addPreviewToWeek = (generatedPreview: WeekPlan) => {
		// creating a new document reference with a uuid in 'weeks' collection in firebase db
		const docRef = doc(weeksCol, generatedPreview._id)

		// setting the document with data from the generated preview
		return setDoc(docRef, generatedPreview)
	}

	const createNewWeek = (mealIds: string[], userPreferences: UserPreferences, weekNumber: number, year: number) => {
		if (!activeUser) { throw new Error("No active user") }
		const lastweekOfTheYear = findLastWeekOfTheYear(year)
		if (weekNumber > lastweekOfTheYear) { throw new Error("That week doesn't exist") }

		// create uuid
		const _id = v4()

		const mealsObject = getMealPlanObject(mealIds, userPreferences.mealsPerDay)

		// creating a new document reference with a uuid in 'meals' collection in firebase db
		const docRef = doc(weeksCol, _id)

		// setting the document with data from the user
		return setDoc(docRef, {
			_id,
			owner: activeUser.uid, // userId of the creator
			weekNumber,
			year,
			userPreferences,
			meals: mealsObject,
		})
	}

	const createNewWeekPreview = async (userPreferences: UserPreferences, weekNumber: number, year: number) => {
		if (!activeUser) { throw new Error("No active user") }
		const lastweekOfTheYear = findLastWeekOfTheYear(year)
		if (weekNumber > lastweekOfTheYear) { throw new Error("That week doesn't exist") }

		// create uuid
		const _id = v4()

		const mealsObject = getEmptyPreview(userPreferences.mealsPerDay)

		// creating a new document reference with a uuid in 'previews' collection in firebase db
		const docRef = doc(previewsCol, _id)

		try {
			setLoadingStatus(true)

			// setting a new document with empty data
			await setDoc(docRef, {
				_id,
				owner: activeUser.uid, // userId of the creator
				weekNumber,
				year,
				userPreferences,
				meals: mealsObject,
			})

			setLoadingStatus(false)
			return _id

		} catch (error) {
			handleError(error)
		}

	}

	const createNewMeal = (data: CreateMealSchema, starRating: number | null, imageUrl: string | null | undefined) => {
		if (!activeUser) { throw new Error("No active user") }

		// create uuid
		const _id = v4()

		// creating a new document reference with a uuid in 'weeks' collection in firebase db
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
		addPreviewToWeek,
		createNewMeal,
		createNewWeek,
		createNewWeekPreview,
		getPreview,
		getWeekPlan,
		updateFirebaseDb,
		updatePreview,
		updateUserPreferences,

		// error and loading states
		errorMsg,
		resetError,
		handleError,
		loading,
		setLoadingStatus,

	}
}


