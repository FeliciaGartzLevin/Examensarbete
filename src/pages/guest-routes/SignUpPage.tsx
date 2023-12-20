import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/generic utilities/Button'
import { SignUpSchema, signUpSchema } from '../../schemas/AuthSchemas'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'
import { Alert } from '../../components/generic utilities/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'

export const SignUpPage = () => {
	const { signup } = useAuthContext()
	const { errorMsg, resetError, handleError } = useErrorHandler()
	const navigate = useNavigate()
	const [loading, setLoading] = useState<boolean>(false)
	const { handleSubmit, register, formState: { errors } } = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema)
	})

	const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
		resetError()

		try {
			setLoading(true)

			//create firebase user via AuthContext fn
			await signup(data.email, data.name, data.password)

			navigate('/')

		} catch (error) {
			handleError(error)
			setLoading(false)
		}
	}

	return (
		<div className="h-screen bg-dark-background flex justify-center items-center">
			<div className="w-full max-w-xs">
				<form onSubmit={handleSubmit(onSubmit)} className="bg-light-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<h2 className='text-lg text-center font-bold mb-1'>
						Sign up
					</h2>
					<p className="text-center text-gray-500 text-xs mb-4">
						Create a new user profile.
					</p>

					{errorMsg &&
						<Alert message={errorMsg} color='red' />
					}

					<div className="mb-4">
						<label className="labelStyling" aria-label="email">
							Email
						</label>
						<input
							className={errors.email ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="email"
							type="email"
							placeholder="Your email"
							{...register('email')}
						/>
						{errors.email && <p className="errorMsgStyling">{errors.email.message ?? "Invalid value"}</p>}
					</div>

					<div className="mb-4">
						<label className="labelStyling" aria-label="name">
							Name
						</label>
						<input
							className={errors.name ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="name"
							type="text"
							placeholder="Your name"
							{...register('name')}
						/>
						{errors.name && <p className="errorMsgStyling">{errors.name.message ?? "Invalid value"}</p>}
					</div>

					<div className="mb-4">
						<label className="labelStyling" aria-label="password">
							Password{' '}
							<span className="text-center text-gray-500 font-light text-xs mb-4">
								- at least 8 charachters.
							</span>
						</label>
						<input
							className={errors.password ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="password"
							type="password"
							placeholder="******************"
							{...register('password')}
						/>
						{errors.password && <p className="errorMsgStyling">{errors.password.message ?? "Invalid value"}</p>}

					</div>

					<div className="mb-6">
						<label className="labelStyling" aria-label="confirmPassword">
							Confirm password
						</label>
						<input
							className={errors.confirmPassword ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="confirmPassword"
							type="password"
							placeholder="******************"
							{...register('confirmPassword')}
						/>
						{errors.confirmPassword && <p className="errorMsgStyling">{errors.confirmPassword.message ?? "Invalid value"}</p>}
					</div>

					<div className="flex justify-end">
						<Button disabled={loading} type='submit'>
							{loading
								? 'Signing up... '
								: 'Sign up'}
						</Button>
					</div>
				</form>
				<div className="text-center text-light-background text-xs">
					<p>Do you already have an account?</p>
					<p>
						Go to <Link className='font-bold hover:text-link-hover' to='/sign-in'>sign in</Link>.
					</p>
				</div>
			</div>
		</div>
	)
}
