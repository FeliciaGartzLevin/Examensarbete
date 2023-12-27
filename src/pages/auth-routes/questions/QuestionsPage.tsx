import { Link, Route, Routes } from "react-router-dom"
import { Alert } from "../../../components/generic utilities/Alert"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { ReactNode, useEffect, useState } from "react"
import { useStreamUserPreferences } from "../../../hooks/useStreamUserPreferences"
import { UserDoc } from "../../../types/User.types"
import { MealsPerDay } from "./MealsPerDay"
import { FoodPreferences } from "./FoodPreferences"
import { Button } from "../../../components/generic utilities/Button"
import { DbSource } from "./DbSource"
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { AuthControl } from "../../../components/auth/AuthControl"

export type QuestionsProps = {
	userDocs: UserDoc[] | null
	isLoading: boolean
	activeUserId: string | undefined
	pagination?: ReactNode
}

export const QuestionsPage = () => {
	const { activeUser } = useAuthContext()
	const { userName } = useAuthContext()
	const { data: userDocs, isLoading } = useStreamUserPreferences()
	const [showAlert, setShowAlert] = useState(true)

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
				<div className="relative gap-6 flex flex-col justify-center items-center bg-light-background shadow-md rounded px-8 pt-6 pb-12 min-h-[50%]">
					<Routes>
						<Route path="/meals" element={
							<AuthControl>
								<MealsPerDay
									userDocs={userDocs}
									isLoading={isLoading}
									activeUserId={activeUser?.uid}
									pagination={
										<div className="flex items-center gap-6">
											<Link to="/questions/food-preferences"><Button><FaAnglesRight /></Button></Link>
										</div>
									}
								/>
							</AuthControl>
						} />
						<Route path="/food-preferences" element={
							<AuthControl>
								<FoodPreferences
									userDocs={userDocs}
									isLoading={isLoading}
									activeUserId={activeUser?.uid}
									pagination={
										<div className="flex items-center gap-6">
											<Link to="/questions/meals"><Button><FaAnglesLeft /></Button></Link>
											<Link to="/questions/db-source"><Button><FaAnglesRight /></Button></Link>
										</div>
									}
								/>
							</AuthControl>
						} />
						<Route path="/db-source" element={
							<AuthControl>
								<DbSource
									userDocs={userDocs}
									isLoading={isLoading}
									activeUserId={activeUser?.uid}
									pagination={
										<div className="flex items-center gap-6">
											<Link to="/questions/food-preferences"><Button><FaAnglesLeft /></Button></Link>
											<Link to="/"><Button><FaAnglesRight /></Button></Link>
										</div>
									}
								/>
							</AuthControl>
						} />

					</Routes>

					<p className="absolute text-xs text-gray-500 bottom-5 right-5"><Link to="/">Skip</Link></p>
				</div>
			</div>
		</div >
	)
}
