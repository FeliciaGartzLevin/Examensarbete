import { useEffect, useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"
import { UserPreferences } from "../../../types/User.types";
import { Alert } from "../../../components/generic utilities/Alert";
import { useFirebaseUpdates } from "../../../hooks/firebase/useFirebaseUpdates";
import { QuestionsProps } from "./QuestionsPage";
import { extractPreferences } from "../../../helpers/questionHelpers";

export const DbSource: React.FC<QuestionsProps> = ({ userDocs, isLoading, activeUserId, pagination }) => {
	const {
		updateFirebaseDb,
		errorMsg,
		loading,
	} = useFirebaseUpdates()
	const [selectedOption, setSelectedOption] = useState<UserPreferences['generateFrom'] | null>(null);
	const [initialFetchCompleted, setInitialFetchCompleted] = useState(false)
	const [firstClickDone, setFirstClickDone] = useState<boolean>(false)
	const choices = [
		{ text: 'All dishes', value: 'allDishes' },
		{ text: 'Only my own', value: 'ownDishes' },
	]

	const handleClick = (choice: UserPreferences['generateFrom']) => {
		setSelectedOption(choice as UserPreferences['generateFrom'])
		setFirstClickDone(true)
	}

	useEffect(() => {
		if (isLoading) { return }
		if (initialFetchCompleted) { return }

		const preferences = extractPreferences(userDocs, activeUserId, 'generateFrom')
		setSelectedOption(preferences as UserPreferences['generateFrom'])
		setInitialFetchCompleted(true)

		// eslint-disable-next-line
	}, [initialFetchCompleted, isLoading])

	useEffect(() => {
		if (!initialFetchCompleted) { return }
		if (!selectedOption) { return }
		if (!firstClickDone) { return }

		updateFirebaseDb(selectedOption, 'generateFrom')
		// eslint-disable-next-line
	}, [selectedOption])

	return (
		<div className="flex flex-col gap-4 text-center">
			<h3 className="">Do you want to generate your weekly mealplan from all dishes in the database or only from your own?</h3>

			{errorMsg &&
				<Alert body={errorMsg} color='red' />
			}

			<div className="flex flex-col justify-center gap-6 sm:flex-row mb-4">
				{choices.map((choice) => (
					<Pill
						className="text-sm"
						disabled={loading}
						key={choice.value}
						onClick={() => handleClick(choice.value as UserPreferences['generateFrom'])}
						isActive={selectedOption === choice.value}
					>
						{choice.text}
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
