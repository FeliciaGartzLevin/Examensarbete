import { useCallback, useEffect, useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"
import { Alert } from "../../../components/generic utilities/Alert";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useFirebaseUpdates } from "../../../hooks/useFirebaseUpdates";
import { Preference } from "../../../types/Meal.types";
import { Button } from "../../../components/generic utilities/Button";
import { Link } from "react-router-dom";
import { useStreamUserPreferences } from "../../../hooks/useStreamUserPreferences";
import { useAuthContext } from "../../../hooks/useAuthContext";

export const FoodPreferences = () => {
	const { activeUser } = useAuthContext()
	const { updateUserPreferences } = useFirebaseUpdates()
	const { data: userDocs, isLoading } = useStreamUserPreferences()
	const [selectedOptions, setSelectedOptions] = useState<Preference[]>(extractPreferences())
	const [initialFetchCompleted, setInitialFetchCompleted] = useState(false)
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()
	const foodPrefs = ['Vegetarian', 'Vegan', 'Glutenfree', 'Lactose-free']

	function extractPreferences() {
		if (!userDocs) { return [] }
		if (!activeUser) { return [] }

		const userDoc = userDocs.find(doc => doc.uid === activeUser.uid)

		if (!userDoc) { return [] }

		return userDoc.preferences.foodPreferences
	}


	const updateFirebaseDb = useCallback(async () => {
		resetError()

		try {
			setLoadingStatus(true)

			// logic for updating preferences in the db
			await updateUserPreferences(selectedOptions, 'foodPreferences')

		} catch (error) {
			handleError(error)

		} finally {
			setLoadingStatus(false)
		}

		// eslint-disable-next-line
	}, [selectedOptions])

	const handleChoice = (foodPref: Preference) => {

		setSelectedOptions((prevSelectedOptions) => {
			return prevSelectedOptions.includes(foodPref)
				? prevSelectedOptions.filter((selectedOptions) => selectedOptions !== foodPref)
				: [...prevSelectedOptions, foodPref]
		})

	}

	useEffect(() => {
		if (isLoading) { return }
		if (initialFetchCompleted) { return }

		const preferences = extractPreferences()
		setSelectedOptions(preferences)
		setInitialFetchCompleted(true)

		// eslint-disable-next-line
	}, [initialFetchCompleted, isLoading])

	useEffect(() => {
		if (!initialFetchCompleted) { return }

		updateFirebaseDb()
		// eslint-disable-next-line
	}, [selectedOptions, updateFirebaseDb])


	return (
		<div className="flex flex-col gap-4 text-center">
			<h3 className="">Do you have any special food preferences or allergies?<br /> If not, choose nothing.</h3>

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
			<div>
				<Link to="/questions/db-source"><Button>Next</Button></Link>
			</div>
		</div>
	)
}
