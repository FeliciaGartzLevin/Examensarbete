import { CreateMealSchema } from "../schemas/MealSchemas"

export type Preference = 'Vegetarian' | 'Vegan' | 'Glutenfree' | 'Lactose-free'

export const categories = [
	'Vegetarian',
	'Vegan',
	'Glutenfree',
	'Lactose-free',
	'Chicken',
	'Lamb',
	'Fish',
	'Beef',
	'Pork',
	'Soy',
	'Tofu',
	'Potatoes',
	'Pasta',
	'Rice',
	'Weekday',
	'Weekend',
	'Holidays',
	'Vegetables',
	'Christmas',
	'Easter',
	'Carrots',
	'Salad',
	'Taco',
	'Indian',
	'Mexican',
	'East Asian',
	'Lentils',
	'Beans'
] as const

export type Category = typeof categories[number]

export type Meal = CreateMealSchema & {
	_id: string
	owner: string // userId of the creator
	rating: number | null
	imageUrl: string | null
}
