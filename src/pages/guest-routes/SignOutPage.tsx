import { useNavigate } from "react-router-dom"
import { Alert } from "../../components/generic utilities/Alert"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useEffect } from "react"

export const SignOutPage = () => {
	const navigate = useNavigate()
	const { signout } = useAuthContext()

	useEffect(() => {
		const signOutFn = async () => {
			await signout()
			navigate('/sign-in')
			console.log('you were signed out')
		}
		signOutFn()
	}, [signout, navigate])

	return (
		<div className="h-full flex items-start justify-center">
			<Alert
				className="mt-[30%]"
				header='Signing out'
				body='Please wait while your being signed out.'
				color="blackandwhite"
			/>

		</div>
	)
}
