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

	const createNewMeal = async (data: CreateMealSchema, starRating: number | null) => {
		if (!activeUser) { throw new Error("No active user") }
		const _id = v4()
		const docRef = doc(mealsCol, _id)

		return setDoc(docRef, {
			...data,
			_id,
			owner: activeUser.uid, // userId of the creator
			rating: starRating,
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

		// eslint-disable-next-line
	}

	return {
		updateUserPreferences,
		updateFirebaseDb,
		errorMsg,
		resetError,
		handleError,
		loading,
		setLoadingStatus,
		createNewMeal
	}
}


