import { doc, setDoc } from "firebase/firestore"
import { usersCol } from "../services/firebase"
import { useAuthContext } from "./useAuthContext"
import { UserPreferences } from "../types/User.types"
import { useErrorHandler } from "./useErrorHandler"

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()


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

			console.log('user preferences ws updated in the db');


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
		setLoadingStatus
	}
}


