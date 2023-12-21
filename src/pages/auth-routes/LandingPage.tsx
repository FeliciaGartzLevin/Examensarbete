import { useAuthContext } from "../../hooks/useAuthContext"

export const LandingPage = () => {
	const { activeUser, userName } = useAuthContext()

	return (
		<div>
			Hello {userName}, {activeUser?.email}
		</div>
	)
}
