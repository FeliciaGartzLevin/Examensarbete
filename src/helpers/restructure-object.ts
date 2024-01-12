import { UserPreferences } from "../types/User.types"
import { OneMealADay, TwoMealsADay, WeekPlan } from "../types/WeekPlan.types"

const daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const getMealPlanObject = (ids: string[], mealsPerDay: UserPreferences['mealsPerDay']) => {

	// set the selected meal ids for each day
	const mealsObject: OneMealADay | TwoMealsADay = daysOfWeek.reduce((acc, day, index) => {
		if (mealsPerDay === 1) {
			acc[day] = ids[index] || null
		} else {
			acc[day] = {
				lunch: ids[index * 2] || null,
				dinner: ids[index * 2 + 1] || null,
			}
		}
		return acc
	}, {} as OneMealADay | TwoMealsADay)

	return mealsObject
}

export const getEmptyPreview = (mealsPerDay: UserPreferences['mealsPerDay']) => {

	// set the selected meal ids for each day
	const mealsObject: OneMealADay | TwoMealsADay = daysOfWeek.reduce((acc, day) => {
		if (mealsPerDay === 1) {
			acc[day] = null
		} else {
			acc[day] = {
				lunch: null,
				dinner: null,
			}
		}
		return acc
	}, {} as OneMealADay | TwoMealsADay)

	return mealsObject
}

export const getMealIds = (weekPreviewOrPlan: WeekPlan, oneMeal: boolean) => {
	const mealIdsArr: Array<string | null> = []
	if (!weekPreviewOrPlan) { throw new Error('No week preview available') }

	daysOfWeek.map(weekday => {
		if (oneMeal) {
			mealIdsArr.push((weekPreviewOrPlan.meals as OneMealADay)[weekday as keyof WeekPlan['meals']])
		} else {
			mealIdsArr.push((weekPreviewOrPlan.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch)
			mealIdsArr.push((weekPreviewOrPlan.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner)
		}
	})

	// Remove null values if any
	const filteredMealIds = mealIdsArr.filter((mealId) => mealId !== null);

	return filteredMealIds
}
