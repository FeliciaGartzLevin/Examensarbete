import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { fetchFirebaseDocs, mealsCol } from "../../services/firebase"
import { Meal } from "../../types/Meal.types"
import { where } from "firebase/firestore"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { LoadingSpinner } from "../../components/generic utilities/LoadingSpinner"
import { Alert } from "../../components/generic utilities/Alert"

export const MealDetails = () => {
	const { mealId } = useParams()

	const {
		data: mealData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['meal', mealId],
		queryFn: () => fetchFirebaseDocs<Meal>(
			mealsCol,
			[where("_id", "==", mealId)]
		),
		enabled: !!mealId
	})

	if (isLoading) {
		return <LoadingSpinner />
	}

	const meal = mealData && mealData[0]

	return (
		<ContentContainer>
			{isError && error && <Alert color='red' header={error.name || "Error"} body={error.message || "An error occured"} />}

			{meal &&
				<h2>{meal.name}</h2>

			}
		</ContentContainer>
	)
}
