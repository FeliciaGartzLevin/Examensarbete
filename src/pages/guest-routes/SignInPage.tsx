import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { SignInSchema, signInSchema } from '../../schemas/AuthSchemas'

export const SignInPage = () => {
	const { handleSubmit, register, formState: { errors } } = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema)
	})

	const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
		console.log('signing in user to firebase with data', data)

	}

	return (
		<div className="h-screen bg-dark-background flex justify-center items-center">
			<div className="w-full max-w-xs">
				<form onSubmit={handleSubmit(onSubmit)} className="bg-light-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<h2 className='text-lg text-center font-bold mb-1'>
						Sign in
					</h2>

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

					<div className="flex justify-between items-center">
						<Link to='/forgot-password' className='font-bold  hover:text-link-hover text-green-900'>Forgot password?</Link>
						<Button type='submit'>Sign in</Button>
					</div>
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
