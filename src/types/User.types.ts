import { Timestamp } from "firebase/firestore";
import { Preferences } from "./Meal.types";

export type UserDoc = {
	uid: string
	email: string,
	displayName: string
	createdMealIds: string[] | null
	createdAt: Timestamp
	updatedAt: Timestamp
}

export type UserPreferences = {
	mealsPerDay: 1 | 2,
	foodPreferences: Preferences[],
	generateFrom: 'ownDishes' | 'allDishes',
}
