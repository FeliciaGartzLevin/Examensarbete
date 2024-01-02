import { z } from 'zod'

export const signUpSchema = z
	.object({
		email: z
			.string()
			.trim()
			.email({ message: "A valid email adress must be specified" }),

		name: z
			.string()
			.trim()
			.min(2, { message: "Name must be at least 2 characters" })
			.max(80, { message: "Name can be no longer than 80 characters. Please use a shorter version of your name." }),

		password: z
			.string({ description: '-at least 8 characters' })
			.trim()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(80, { message: "Password can be no longer than 80 characters. Please use a shorter password." }),

		confirmPassword: z
			.string()

	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"], // path of error
	});

// extract type from the schema
export type SignUpSchema = z.infer<typeof signUpSchema>


export const signInSchema = z
	.object({
		email: z
			.string()
			.trim()
			.email({ message: "Email adress must be specified" }),

		password: z
			.string()
			.trim()
			.min(1, { message: "Password must be specified" })
	})

// extract type from the schema
export type SignInSchema = z.infer<typeof signInSchema>


export const resetPasswordSchema = z
	.object({
		email: z
			.string()
			.trim()
			.email({ message: "Email adress must be specified" }),
	})

// extract type from the schema
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>


export const editAccountSchema = z
	.object({
		email: z
			.string()
			.trim()
			.email({ message: "A valid email adress must be specified" }),

		name: z
			.string()
			.trim()
			.min(2, { message: "Name must be at least 2 characters" })
			.max(80, { message: "Name can be no longer than 80 characters. Please use a shorter version of your name." }),

		password: z
			.string()
			.trim()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(80, { message: "Password can be no longer than 80 characters. Please use a shorter password." }),

		confirmPassword: z
			.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"], // path of error
	});

export type EditAccountSchema = z.infer<typeof editAccountSchema>
