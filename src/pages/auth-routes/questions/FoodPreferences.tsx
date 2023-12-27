import { useEffect, useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"
import { Alert } from "../../../components/generic utilities/Alert";
import { useFirebaseUpdates } from "../../../hooks/useFirebaseUpdates";
import { Preference } from "../../../types/Meal.types";
import { QuestionsProps } from "./QuestionsPage";
import { extractPreferences } from "../../../helpers/questionHelpers";
import { UserPreferences } from "../../../types/User.types";

export const FoodPreferences: React.FC<QuestionsProps> = ({ userDocs, isLoading, activeUserId }) => {
	const {
		updateFirebaseDb,
		errorMsg,
		loading,
	} = useFirebaseUpdates()
	const [selectedOptions, setSelectedOptions] = useState<UserPreferences['foodPreferences']>([])
	const [initialFetchCompleted, setInitialFetchCompleted] = useState(false)
	const foodPrefs = ['Vegetarian', 'Vegan', 'Glutenfree', 'Lactose-free']

	const handleChoice = (foodPref: Preference) => {

		setSelectedOptions((prevSelectedOptions) => {
			return prevSelectedOptions.includes(foodPref)
				? prevSelectedOptions.filter((selectedOptions) => selectedOptions !== foodPref)
				: [...prevSelectedOptions, foodPref]
		})

	}

	useEffect(() => {
		// if loading fetch of userPreferences in the db or
		if (isLoading) { return }
		if (initialFetchCompleted) { return }

		const preferences = extractPreferences(userDocs, activeUserId, 'foodPreferences')
		setSelectedOptions(preferences as UserPreferences['foodPreferences'] ?? [])
		setInitialFetchCompleted(true)

		// eslint-disable-next-line
	}, [initialFetchCompleted, isLoading])

	useEffect(() => {
		if (!initialFetchCompleted) { return }

		updateFirebaseDb(selectedOptions, 'foodPreferences')
		// eslint-disable-next-line
	}, [selectedOptions])


	return (
		<div className="flex flex-col gap-4 text-center">
			<div>
				<h3 className="mb-2">Do you have any special food preferences or allergies?</h3>
				<p className="text-xs text-gray-500">If not, choose nothing.</p>
			</div>

			{errorMsg &&
				<Alert body={errorMsg} color='red' />
			}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{foodPrefs.map((foodPref) => (
					<Pill
						className="text-sm"
						disabled={loading}
						key={foodPref}
						onClick={() => handleChoice(foodPref as Preference)}
						isActive={selectedOptions ? selectedOptions.includes(foodPref as Preference) : false}
					>
						{foodPref}
					</Pill>
				))}
			</div>
		</div>
	)
}
