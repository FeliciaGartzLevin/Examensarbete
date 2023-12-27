import { useEffect, useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"
import { UserPreferences } from "../../../types/User.types";
import { Alert } from "../../../components/generic utilities/Alert";
import { useFirebaseUpdates } from "../../../hooks/useFirebaseUpdates";
import { QuestionsProps } from "./QuestionsPage";
import { extractPreferences } from "../../../helpers/questionHelpers";

export const MealsPerDay: React.FC<QuestionsProps> = ({ userDocs, isLoading, activeUserId }) => {
	const {
		updateFirebaseDb,
		errorMsg,
		loading,
	} = useFirebaseUpdates()
	const [selectedOption, setSelectedOption] = useState<UserPreferences['mealsPerDay'] | null>(null);
	const [initialFetchCompleted, setInitialFetchCompleted] = useState(false)
	const choices = [1, 2]


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

			<div className="flex justify-center gap-6">
				{choices.map((choice) => (
					<Pill
						disabled={loading}
						key={choice}
						onClick={() => setSelectedOption(choice as UserPreferences['mealsPerDay'])}
						isActive={selectedOption === choice}
					>
						{choice}
					</Pill>
				))}
			</div>
		</div>
	)
}
