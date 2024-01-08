import { isMonday, previousMonday, previousSunday } from "date-fns"
import { getWeek } from "date-fns/getWeek"
import { isSunday } from "date-fns/isSunday"
import { lastDayOfYear } from "date-fns/lastDayOfYear"

export const getCurrentWeekNumber = (date?: Date) => {
	// get the current date
	const currentDate = date || new Date()

	const latestMonday = isMonday(currentDate) ? currentDate : previousMonday(currentDate)

	// get current week
	const weekNumber = getWeek(currentDate, {
		weekStartsOn: 1, // monday
		firstWeekContainsDate: 4 //applies to all EU countries
	})

	const year = currentDate.getUTCFullYear()

	return { latestMonday, currentDate, weekNumber, year }
}

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const findLastWeekOfTheYear = (year: number) => {

	let lastDayOfTheYear = lastDayOfYear(new Date(year, 11, 31))

	const { weekNumber: lastWeekOfYearForChecking } = getCurrentWeekNumber(lastDayOfTheYear)

	if (lastWeekOfYearForChecking === 1 && !isSunday(lastDayOfTheYear)) {
		lastDayOfTheYear = previousSunday(lastDayOfTheYear)
		// so that not week 1 will be considered the last week of the year
	}

	const { weekNumber: lastweekOfTheYear } = getCurrentWeekNumber(lastDayOfTheYear)

	return lastweekOfTheYear
}

