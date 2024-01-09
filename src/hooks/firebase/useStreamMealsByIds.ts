import { where } from 'firebase/firestore'
import { mealsCol } from '../../services/firebase'
import { Meal } from '../../types/Meal.types'
import { useStreamCollection } from './useStreamCollection'

export const useStreamMealsByIds = (mealIds: Array<string | null>) => {
	return useStreamCollection<Meal>(
		mealsCol,
		where('_id', 'in', mealIds)
	)
}

