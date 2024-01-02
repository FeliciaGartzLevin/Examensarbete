import { z } from 'zod'
import { Category, categories } from '../types/Meal.types'

export const createMealSchema = z
	.object({
		name: z
			.string()
			.min(5, "Name must be at least 5 characters")
			.max(100, "Name can be no longer than 100 characters. Please use a shorter version of the name."),
		link: z
			.string()
			.nullable()
			.refine((data) => {
				if (data && data !== '') {
					// Validate if string exists and if so checking with regex that it's a valid URL
					return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(data)
				}
				return true
			}, "Must be a valid URL or nothing at all"),
		category: z
			.array(z.string())
			.refine((value) => value.every((item) => categories.includes(item as Category)),
				"Each chosen category must be of a valid category",
			)
			.refine(value => value.length > 0,
				"Please select at least one category"
			),
		description: z
			.string()
			.max(1000, "The description can be max 1000 words")
			.nullable()
	})


// extract type from the schema
export type CreateMealSchema = z.infer<typeof createMealSchema>
