import { useEffect, useState } from "react";
import { Pill } from "../../../components/generic-utilities/Pill"
import { UserPreferences } from "../../../types/User.types";
import { Alert } from "../../../components/generic-utilities/Alert";
import { useFirebaseUpdates } from "../../../hooks/firebase/useFirebaseUpdates";
import { QuestionsProps } from "./QuestionsPage";
import { extractPreferences } from "../../../helpers/questionHelpers";

export const MealsPerDay: React.FC<QuestionsProps> = ({ userDocs, isLoading, activeUserId, pagination }) => {
	const {
		updateFirebaseDb,
		errorMsg,
		loading,
	} = useFirebaseUpdates()
	const [selectedOption, setSelectedOption] = useState<UserPreferences['mealsPerDay'] | null>(null);
	const [initialFetchCompleted, setInitialFetchCompleted] = useState(false)
	const [firstClickDone, setFirstClickDone] = useState<boolean>(false)
	const choices = [1, 2]

	const handleClick = (choice: UserPreferences['mealsPerDay']) => {
		setSelectedOption(choice as UserPreferences['mealsPerDay'])
		setFirstClickDone(true)
	}

	useEffect(() => {
		if (isLoading) { return }
		if (initialFetchCompleted) { return }

		const preferences = extractPreferences(userDocs, activeUserId, 'mealsPerDay')
		setSelectedOption(preferences as UserPreferences['mealsPerDay'])
		setInitialFetchCompleted(true)

		// eslint-disable-next-line
	}, [initialFetchCompleted, isLoading])

	useEffect(() => {
		if (!initialFetchCompleted) { return }
		if (!selectedOption) { return }
		if (!firstClickDone) { return }

		updateFirebaseDb(selectedOption, 'mealsPerDay')
		// eslint-disable-next-line
	}, [selectedOption])

	return (
		<div className="flex flex-col gap-4 text-center">
			<div>
				<h3 className="mb-2">How many meals per day do you wish to see in your mealplan?</h3>
				<p className="text-xs text-gray-500">You can choose more than one option.</p>
			</div>
			{errorMsg &&
				<Alert body={errorMsg} color='red' />
			}

			<div className="flex justify-center gap-6 mb-4">
				{choices.map((choice) => (
					<Pill
						disabled={loading}
						key={choice}
						onClick={() => handleClick(choice as UserPreferences['mealsPerDay'])}
						isActive={selectedOption === choice}
					>
						{choice}
					</Pill>
				))}
			</div>
			{pagination &&
				<div className="flex justify-center">
					{pagination}
				</div>
			}
		</div>
	)
}
