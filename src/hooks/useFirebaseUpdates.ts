import { doc, setDoc } from "firebase/firestore"
import { usersCol } from "../services/firebase"
import { useAuthContext } from "./useAuthContext"
import { UserPreferences } from "../types/User.types"

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()

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

	return {
		updateUserPreferences,
	}
}


