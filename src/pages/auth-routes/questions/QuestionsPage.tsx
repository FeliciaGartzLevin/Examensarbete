import { Link } from "react-router-dom"
import { Alert } from "../../../components/generic utilities/Alert"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { useEffect, useState } from "react"
import { useStreamUserPreferences } from "../../../hooks/useStreamUserPreferences"
import { UserDoc } from "../../../types/User.types"
import { MealsPerDay } from "./MealsPerDay"
import { FoodPreferences } from "./FoodPreferences"
import { Button } from "../../../components/generic utilities/Button"
import { DbSource } from "./DbSource"

export type QuestionsProps = {
	userDocs: UserDoc[] | null
	isLoading: boolean
	activeUserId: string | undefined
}

export const QuestionsPage = () => {
	const { activeUser } = useAuthContext()
	const { userName } = useAuthContext()
	const { data: userDocs, isLoading } = useStreamUserPreferences()
	const [showAlert, setShowAlert] = useState(true)
	const [currentQuestion, setCurrentQuestion] = useState(1)

	const handlePagination = (direction: number) => {
		setCurrentQuestion((prevQuestion) => prevQuestion + direction)
	}

	useEffect(() => {
		// hide the alert after 5 secs
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
				<div className="relative gap-6 flex flex-col justify-center items-center bg-light-background shadow-md rounded px-8 pt-6 pb-8 min-h-[50%]">
					{currentQuestion === 1 && <MealsPerDay userDocs={userDocs} isLoading={isLoading} activeUserId={activeUser?.uid} />}
					{currentQuestion === 2 && <FoodPreferences userDocs={userDocs} isLoading={isLoading} activeUserId={activeUser?.uid} />}
					{currentQuestion === 3 && <DbSource userDocs={userDocs} isLoading={isLoading} activeUserId={activeUser?.uid} />}
					<div className="flex items-center gap-2">
						{currentQuestion > 1 && <Button onClick={() => handlePagination(-1)}>Prev</Button>}
						<Button onClick={() => handlePagination(1)}>Next</Button>
					</div>
					<p className="absolute text-xs text-gray-500 bottom-5 right-5"><Link to="/">Skip</Link></p>
				</div>
			</div>

		</div >
	)
}
