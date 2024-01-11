import shuffle from 'lodash/shuffle'
import { Meal } from '../types/Meal.types'
import { UserPreferences } from '../types/User.types'
import { where } from 'firebase/firestore'
import { compact } from 'lodash'

export const shuffleFn = (mealsDocs: Meal[], requiredMealAmount: 7 | 14) => {
	if (!mealsDocs) { return }

	// shuffle all meals
	const shuffledMeals = shuffle([...mealsDocs])

	// get the first requiredMealAmount from the shuffled array
	return shuffledMeals.slice(0, requiredMealAmount).map(meal => meal._id)
}

export const generateMealsQueries = (userPrefs: UserPreferences, activeUserId: string) => {
	// if generateFrom === "ownDishes", query only meals that active user are owner to, otherwise no query (will fetch all dishes)
	const generateFromFilter = userPrefs.generateFrom === "ownDishes"
		? where("owner", "==", activeUserId)
		: null

	let prefFilter = null
	if (userPrefs.foodPreferences.length > 0) {
		// if foodPreferences exists: query on them, otherwise no query, just get all meals
		prefFilter = where("category", "array-contains-any", userPrefs.foodPreferences)
	}

	// compact = lodash function that removes all falsy values since QueryConstraint[] don't accept such
	return compact([
		prefFilter,
		generateFromFilter
	])
}
