import { Meal } from "../types/Meal.types"
import { UserPreferences } from "../types/User.types"
import { LunchAndDinner, OneMealADay, TwoMealsADay, WeekPlan } from "../types/WeekPlan.types"

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

export const generateRandomForNullValues = (preview: WeekPlan, shuffledNotUsedMeals: Meal[]) => {
	const mealsPerDay = preview.userPreferences.mealsPerDay

	// clone the weekPlan object
	const updatedPreview = { ...preview }

	// replace null values in the weekPreview object based on mealsPerDay
	if (mealsPerDay === 1) {
		const meals = updatedPreview.meals as OneMealADay

		Object.keys(updatedPreview.meals).map(day => {
			if (meals[day as keyof WeekPlan['meals']] === null) {
				const randomMeal = shuffledNotUsedMeals.pop()
				if (!randomMeal) { throw new Error('Not enough meals to create a new weekplan') }

				// update the changed property on the weekPlan object
				meals[day as keyof WeekPlan['meals']] = randomMeal._id
			}
		})
	} else {
		const meals = updatedPreview.meals as TwoMealsADay

		Object.keys(updatedPreview.meals).map(day => {
			const mealDay = meals[day as keyof WeekPlan['meals']] as LunchAndDinner

			Object.keys(mealDay).map(mealType => {
				if (mealDay[mealType as keyof LunchAndDinner] === null) {
					const randomMeal = shuffledNotUsedMeals.pop()
					if (!randomMeal) { throw new Error('Not enough meals to create a new weekplan') }

					// update the changed property on the weekPlan object
					mealDay[mealType as keyof LunchAndDinner] = randomMeal._id
				}
			})
		})
	}

	return updatedPreview as WeekPlan
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
	const filteredMealIds = mealIdsArr.filter((mealId) => mealId !== null)

	return filteredMealIds
}
