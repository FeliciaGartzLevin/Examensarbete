import { Timestamp } from "firebase/firestore";
import { Preferences } from "./Meal.types";

export type UserDoc = {
	uid: string
	email: string,
	displayName: string
	createdMealIds: string[] | null
	preferences: UserPreferences
	createdAt: Timestamp
	updatedAt: Timestamp
}

export type UserPreferences = {
	mealsPerDay: 1 | 2,
	foodPreferences: Preferences[] | null,
	generateFrom: 'ownDishes' | 'allDishes',
}
