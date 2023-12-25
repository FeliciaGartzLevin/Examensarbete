import { doc, setDoc } from "firebase/firestore"
import { usersCol } from "../services/firebase"
import { useAuthContext } from "./useAuthContext"
import { UserPreferences } from "../types/User.types"


export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()

	const updateUserPreferences = async (choice: UserPreferences[keyof UserPreferences], preference: keyof UserPreferences) => {
		if (!activeUser) { throw new Error("No active user") }

		const docRef = doc(usersCol, activeUser.uid)

		// updating
		setDoc(docRef, {
			preferences: {
				[preference]: choice,
			}
		}, { merge: true }) // måste ev checka av om `UserPreferences['foodPreferences']` eller if typeof Array och då mergeFields ist eftersom det kanske är annorlunda för array:er
	}

	return {
		updateUserPreferences,
	}
}


