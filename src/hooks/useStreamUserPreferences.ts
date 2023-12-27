import useStreamCollection from './useStreamCollection'
import { usersCol } from '../services/firebase'
import { UserDoc } from '../types/User.types'
import { where } from 'firebase/firestore'
import { useAuthContext } from './useAuthContext'

export const useStreamUserPreferences = () => {
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error("No active user") }

	return useStreamCollection<UserDoc>(
		usersCol,
		where('uid', '==', activeUser.uid)
	)
}

