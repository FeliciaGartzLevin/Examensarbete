export type Category = Preference & 'Fish' | 'Chicken' | 'Potatoes' | 'Pasta' | 'Weekend' | 'Holidays'

export type Preference = 'Vegetarian' | 'Vegan' | 'Glutenfree' | 'Lactose-free'

export type Meal = {
	_id: string
	owner: string // userId of the creator
	name: string
	recipe?: string
	description?: string
}
