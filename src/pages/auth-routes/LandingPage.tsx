import { useAuthContext } from "../../hooks/useAuthContext"

export const LandingPage = () => {
	const { activeUser, userName } = useAuthContext()

	return (
		<div className="h-full">
			Hello {userName}, {activeUser?.email}
		</div>
	)
}
