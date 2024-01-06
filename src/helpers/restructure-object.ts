import { UserPreferences } from "../types/User.types"
import { OneMealADay, TwoMealsADay } from "../types/WeekPlan.types"

export const getMealPlanObject = (ids: string[], mealsPerDay: UserPreferences['mealsPerDay']) => {
	const daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

	// set the selected meal ids for each day
	const mealsObject: OneMealADay | TwoMealsADay = daysOfWeek.reduce((acc, day, index) => {
		if (mealsPerDay === 1) {
			acc[day] = ids[index] || null
		} else {
			acc[day] = {
				lunch: ids[index] || null,
				dinner: ids[index + 1] || null,
			}
		}
		return acc
	}, {} as OneMealADay | TwoMealsADay)

	return mealsObject
}
