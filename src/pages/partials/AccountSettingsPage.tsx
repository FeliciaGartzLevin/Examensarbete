import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '../../components/generic utilities/Button'
import { EditAccountSchema, editAccountSchema } from '../../schemas/AuthSchemas'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { Alert } from '../../components/generic utilities/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { Link } from 'react-router-dom'


export const AccountSettingsPage = () => {
	const { activeUser, setEmail, setDisplayName, setPassword, updateUserLocally } = useAuthContext()
	const { errorMsg, resetError, handleError } = useErrorHandler()
	const [confirmationMsg, setConfirmationMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const { handleSubmit, register, reset, formState: { isSubmitSuccessful, errors } } = useForm<EditAccountSchema>({
		defaultValues: {
			email: activeUser?.email ?? '',
			name: activeUser?.displayName ?? '',
		},
		resolver: zodResolver(editAccountSchema)
	})

	const onSubmit: SubmitHandler<EditAccountSchema> = async (data) => {
		resetError()

		try {
			setLoading(true)

			if (data.email !== (activeUser?.email ?? '')) {
				await setEmail(data.email)
			}
			if (data.name !== (activeUser?.displayName ?? '')) {
				await setDisplayName(data.name)
			}

			await setPassword(data.password)

			setConfirmationMsg('Changes saved')
			updateUserLocally()

			setLoading(false)

		} catch (error) {
			handleError(error)
			setLoading(false)
		}
	}

	// emptying form if isSubmitSuccessful
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({
				password: "",
				confirmPassword: "",
			})
		}
	}, [isSubmitSuccessful, reset])

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full max-w-xs">
				<form onSubmit={handleSubmit(onSubmit)} className="">
					<div className='flex flex-col mb-4'>
						<h3 className='text-lg text-center font-bold'>
							Account settings
						</h3>
						<p className="text-center text-gray-500 text-xs mb-4">
							Edit your information here if desired.<br />
							You must first <Link className='font-bold hover:text-link-hover' to="/sign-out">sign in</Link>
							{' '}in again if you haven't done it recently, in order to update your settings.
						</p>
					</div>

					{errorMsg &&
						<Alert body={errorMsg} color='red' />
					}
					{confirmationMsg && <Alert body={confirmationMsg} color='green' />}

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
								? 'Submitting...'
								: 'Submit'}
						</Button>
					</div>
				</form>

			</div >
		</div >
	)
}

