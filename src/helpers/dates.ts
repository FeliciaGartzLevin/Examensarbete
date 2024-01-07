import { getWeek } from "date-fns/getWeek"

export const getCurrentWeekNumber = () => {
	// get the current date
	const currentDate = new Date()

	// get current week
	const weekNumber = getWeek(currentDate, {
		weekStartsOn: 1, // monday
		firstWeekContainsDate: 4 //applies to all EU countries
	})

	const year = currentDate.getUTCFullYear()

	return { weekNumber, year }
}

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
