import { UserPreferences } from "../types/User.types";
import { LunchAndDinner } from "../types/WeekPlan.types";

export const getMealPlanObject = (ids: string[], mealsPerDay: UserPreferences['mealsPerDay']) => {

	const daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
	const mealsObject: Record<string, string | null | LunchAndDinner> = {}

	// set the selected meal ids for each day
	daysOfWeek.forEach((day, index) => {
		if (mealsPerDay === 1) {
			mealsObject[day] = ids[index] || null
		} else {
			mealsObject[day] = {
				lunch: ids[index] || null,
				dinner: ids[index + 1] || null,
			}
		}
	})

	return mealsObject
}
