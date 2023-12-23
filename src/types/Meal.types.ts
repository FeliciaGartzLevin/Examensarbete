export type Category = Preferences & 'Fish' | 'Chicken' | 'Potatoes' | 'Weekend' | 'Holidays'

export type Preferences = 'Omnivore' | 'Vegetarian' | 'Vegan' | 'Glutenfree'

export type Meal = {
	_id: string
	owner: string // userId of the creator
	name: string
	recipe?: string
	description?: string
}
