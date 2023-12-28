import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/generic utilities/Button'
import { SignInSchema, signInSchema } from '../../schemas/AuthSchemas'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'
import { Alert } from '../../components/generic utilities/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'

export const SignInPage = () => {
	const { signin } = useAuthContext()
	const { errorMsg, resetError, handleError } = useErrorHandler()
	const navigate = useNavigate()
	const [loading, setLoading] = useState<boolean>(false)
	const { handleSubmit, register, formState: { errors } } = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema)
	})

	const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
		resetError()

		try {
			setLoading(true)

			//sin in to firebase user via AuthContext fn
			await signin(data.email, data.password)

			navigate('/')

		} catch (error) {
			handleError(error)
			setLoading(false)
		}
	}

	return (
		<div className="h-full flex justify-center items-center">
			<div className="w-full max-w-xs">
				<form onSubmit={handleSubmit(onSubmit)} className="bg-light-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<h2 className='text-lg text-center font-bold mb-1'>
						Sign in
					</h2>

					{errorMsg &&
						<Alert body={errorMsg} color='red' />
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

					<div className="mb-6">
						<label className="labelStyling" aria-label="password">
							Password
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

					<div className="flex justify-between items-center gap-2">
						<Link to='/reset-password' className='font-bold  hover:text-link-hover text-green-900 text-sm'>Forgot password?</Link>
						<Button disabled={loading} type='submit'>
							{loading
								? 'Signing in... '
								: 'Sign in'}
						</Button>					</div>
				</form>
				<div className="text-center text-light-background text-xs">
					<p>Don't have an account?</p>
					<p>
						Go to <Link className='font-bold hover:text-link-hover' to='/sign-up'>sign up</Link>.
					</p>
				</div>
			</div>
		</div>
	)
}
