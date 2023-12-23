import { Link, Outlet } from "react-router-dom"
import { Alert } from "../../../components/generic utilities/Alert"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { useEffect, useState } from "react"

export const QuestionsPage = () => {
	const { userName } = useAuthContext()
	const [showAlert, setShowAlert] = useState(true)

	useEffect(() => {
		// Set a timeout to hide the alert after 5000 milliseconds (5 seconds)
		const timeoutId = setTimeout(() => {
			setShowAlert(false)
		}, 5000)

		// Clear the timeout when the component unmounts
		return () => clearTimeout(timeoutId)
	}, [])

	return (
		<div className="bg-dark-background h-full flex flex-col justify-center items-center">

			<div className="w-[90%] sm:w-[60%]">
				<div className="relative -top-8">
					{showAlert && <Alert header={'Welcome ' + userName + '!'} body="First some questions for you to set your preferences right." color="green" />}
				</div>
				<div className="relative flex justify-center items-center bg-light-background shadow-md rounded px-8 pt-6 pb-8 min-h-[50%]">
					<Outlet />
					<p className="absolute text-xs text-gray-500 bottom-5 right-5"><Link to="/">Skip</Link></p>
				</div>
			</div>

		</div >
	)
}
