import { doc, setDoc } from "firebase/firestore"
import { mealsCol, usersCol } from "../services/firebase"
import { useAuthContext } from "./useAuthContext"
import { UserPreferences } from "../types/User.types"
import { useErrorHandler } from "./useErrorHandler"
import { CreateMealSchema } from "../schemas/MealSchemas"
import { v4 } from 'uuid'

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()

	const createNewMeal = async (data: CreateMealSchema, starRating: number | null, imageUrl: string | null | undefined) => {
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

		// error and loading states
		errorMsg,
		resetError,
		handleError,
		loading,
		setLoadingStatus,

	}
}


