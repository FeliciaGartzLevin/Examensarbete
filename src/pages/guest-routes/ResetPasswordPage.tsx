import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '../../components/generic-utilities/Button'
import { ResetPasswordSchema, resetPasswordSchema } from '../../schemas/AuthSchemas'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { Alert } from '../../components/generic-utilities/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'

export const ResetPasswordPage = () => {
	const { resetPassword } = useAuthContext()
	const { errorMsg, resetError, handleError } = useErrorHandler()
	const [confirmationMsg, setConfirmationMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const {
		handleSubmit,
		reset,
		register,
		formState: { errors, isSubmitSuccessful }
	} = useForm<ResetPasswordSchema>({
		resolver: zodResolver(resetPasswordSchema)
	})

	const onSubmit: SubmitHandler<ResetPasswordSchema> = async (data) => {
		resetError()
		setConfirmationMsg(null)

		try {
			setLoading(true)


			//sin in to firebase user via AuthContext fn
			await resetPassword(data.email)

			setConfirmationMsg("We've just tossed a password reset link into your email oven. Let it bake a bit, and if it hasn't shown up in your inbox, peek into the spam pantry. Bon appétit! 🍽️")

			setLoading(false)
			reset({ ...data })

		} catch (error) {
			handleError(error)
			setLoading(false)
		}
	}

	// emptying form if isSubmitSuccessful
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({ email: "" })
		}
	}, [isSubmitSuccessful, reset])

	return (
		<div className="h-full flex justify-center items-center">
			<div className="w-full max-w-xs">
				<form onSubmit={handleSubmit(onSubmit)} className="bg-light-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<h2 className='text-lg text-center font-bold mb-1'>
						Reset password
					</h2>
					<p className="text-center text-gray-500 text-xs mb-4">
						Forgot your password? No worries. Reset it here by entering your email.
					</p>

					{errorMsg &&
						<Alert body={errorMsg} color='red' />
					}
					{confirmationMsg && (<Alert body={confirmationMsg} color="green" />)}


					<div className="mb-4">
						<label className="labelStyling" aria-label="email">
							Email
						</label>
						<input
							className={errors.email ? "errorInputStyling" : "defaultInputStyling"}
							type="email"
							placeholder="Your email"
							{...register('email')}
						/>
						{errors.email && <p className="errorMsgStyling">{errors.email.message ?? "Invalid value"}</p>}
					</div>


					<div className="flex justify-end items-center">
						<Button disabled={loading} type='submit'>
							{loading
								? 'Resetting... '
								: 'Reset'}
						</Button>
					</div>
				</form>
				<div className="text-center text-light-background text-xs">
					<p>Remember your password?</p>
					<p>
						Go to <Link className='font-bold hover:text-link-hover' to='/sign-in'>sign in</Link>.
					</p>
				</div>
			</div>
		</div>
	)
}





