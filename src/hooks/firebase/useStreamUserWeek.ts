import { useStreamCollection } from './useStreamCollection'
import { weeksCol } from '../../services/firebase'
import { where } from 'firebase/firestore'
import { useAuthContext } from '../useAuthContext'
import { WeekPlan } from '../../types/WeekPlan.types'

export const useStreamUserWeek = (displayedWeek: number, displayedYear: number) => {
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error("No active user") }

	return useStreamCollection<WeekPlan>(
		weeksCol,
		where('owner', '==', activeUser.uid),
		where('weekNumber', '==', displayedWeek),
		where('year', '==', displayedYear),
	)
}

