import { UserPreferences } from "./User.types"

export type WeekPlan = {
	_id: string
	owner: string // userId of the creator
	weekNumber: number
	year: number
	meals: OneMealADay | TwoMealsADay
	mealsPerDay: UserPreferences['mealsPerDay']
}

export type OneMealADay = {
	monday: string | null // id of the meal
	tuesday: string | null
	wednesday: string | null
	thursday: string | null
	friday: string | null
	saturday: string | null
	sunday: string | null
}

export type TwoMealsADay = {
	monday: LunchAndDinner
	tuesday: LunchAndDinner
	wednesday: LunchAndDinner
	thursday: LunchAndDinner
	friday: LunchAndDinner
	saturday: LunchAndDinner
	sunday: LunchAndDinner
}

type LunchAndDinner = {
	lunch: string | null // id of the meal
	dinner: string | null
}