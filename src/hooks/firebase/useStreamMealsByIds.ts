import { useStreamCollection } from './useStreamCollection'
import { mealsCol } from '../../services/firebase'
import { where } from 'firebase/firestore'
import { Meal } from '../../types/Meal.types'

export const useStreamMealsByIds = (mealIds: Array<string | null>) => {
	return useStreamCollection<Meal>(
		mealsCol,
		where('_id', 'in', mealIds)
	)
}

