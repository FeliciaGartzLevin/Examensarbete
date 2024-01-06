import { Link } from "react-router-dom"
import { Pagination } from "../../components/Pagination"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { useStreamUserDoc } from "../../hooks/useStreamUserDoc"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { Alert } from "../../components/generic utilities/Alert"
import { Divider } from "../../components/generic utilities/Divider"
import { MealPlan } from "../../components/MealPlan"

export const LandingPage = () => {
	const {
		data: userDocs,
		isLoading,
		isError,
		error
	} = useStreamUserDoc()

	if (isLoading) {
		return (
			<LoadingSpinner />
		)
	}

	return (
		<ContentContainer className="gap-6 px-12 md:px-20">
			<h2 className="h2">Weekly meal plan</h2>
			<Pagination week={45} />

			{isError &&
				<Alert color="red" body={'An error occured' + error ? + `: ${error}` : '.'} />
			}

			{userDocs && userDocs[0] && !isLoading &&
				<MealPlan userDoc={userDocs[0]} />
			}

			<section className="flex flex-col items-center gap-0">
				<Divider symbol="settings" className="py-2" />

				<p className="text-xs text-gray-500">Having other default preferences?</p>

				<Link to="/settings/preferences" className="m-0">
					<button
						type="button"
						className="m-0 text-xs text-gray-500 hover:text-link-hover font-semibold inline-flex gap-1 items-center"
					>
						Change them in settings.
					</button>
				</Link>
			</section>

		</ContentContainer>
	)
}
