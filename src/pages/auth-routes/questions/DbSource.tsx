import { useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"
import { UserPreferences } from "../../../types/User.types";
import { Alert } from "../../../components/generic utilities/Alert";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useFirebaseUpdates } from "../../../hooks/useFirebaseUpdates";
// import { useNavigate } from "react-router-dom";

export const DbSource = () => {
	const { updateUserPreferences } = useFirebaseUpdates()
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()
	// const navigate = useNavigate()
	const choices = [1, 2]

	const handleChoice = async (choice: UserPreferences['mealsPerDay']) => {
		resetError()
		setSelectedOption(choice)

		try {
			setLoadingStatus(true)

			// logic for updating preferences in the db
			await updateUserPreferences(choice, 'generateFrom')

			//navigate to next question
			// navigate('/')

			console.log('update in db succeeded')

		} catch (error) {
			handleError(error)
			setLoadingStatus(false)

		}
		setLoadingStatus(false)
	}

	return (
		<div className="flex flex-col gap-4 text-center">
			<h3 className="">How many meals per day do you wish to see in your mealplan?</h3>

			{errorMsg &&
				<Alert body={errorMsg} color='red' />
			}

			<div className="flex justify-center gap-6">
				{choices.map((choice) => (
					<Pill
						disabled={loading}
						key={choice}
						onClick={() => handleChoice(choice as UserPreferences['mealsPerDay'])}
						isActive={selectedOption === choice}
					>
						{choice}
					</Pill>
				))}
			</div>
		</div>
	)
}
