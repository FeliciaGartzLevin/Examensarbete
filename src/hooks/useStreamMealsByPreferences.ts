import { useStreamCollection } from './useStreamCollection'
import { mealsCol } from '../services/firebase'
import { Meal } from '../types/Meal.types'
import { UserPreferences } from '../types/User.types'
import { QueryConstraint, where } from 'firebase/firestore'
import { useAuthContext } from './useAuthContext'
import { compact } from 'lodash'

export const useStreamMealsByPreferences = (
	generateFrom: UserPreferences['generateFrom'] | null,
	foodPreferences?: UserPreferences['foodPreferences'] | null
) => {
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error("No active user") }

	// if generateFrom === "ownDishes", query only meals that active user are owner to, otherwise no query (will fetch all dishes)
	const generateFromFilter = generateFrom === "ownDishes"
		? where("owner", "==", activeUser.uid)
		: null

	// if foodPreferences are being sent as a param: query on them, otherwise no query, just get all meals
	const prefFilter = foodPreferences
		? where("category", "array-contains-any", [foodPreferences])
		: null

	// compact = lodash function that removes all falsy values since QueryConstraint[] don't accept such
	const queryConstraints: QueryConstraint[] = compact([
		prefFilter,
		generateFromFilter
	])

	return useStreamCollection<Meal>(
		mealsCol,
		...queryConstraints
	)
}

