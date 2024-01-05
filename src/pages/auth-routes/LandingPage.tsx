import { Link } from "react-router-dom"
import { Pagination } from "../../components/Pagination"
import { Button } from "../../components/generic utilities/Button"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { useStreamUserDoc } from "../../hooks/useStreamUserDoc"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { Alert } from "../../components/generic utilities/Alert"
import { useAuthContext } from "../../hooks/useAuthContext"
import { Divider } from "../../components/generic utilities/Divider"
import { useEffect, useState } from "react"
import { UserPreferences } from "../../types/User.types"
import { GenerateMealPlan } from "../../components/GenerateMealPlan"

export const LandingPage = () => {
	const { activeUser } = useAuthContext()
	const {
		data: userDocs,
		isLoading,
		isError,
		error
	} = useStreamUserDoc()

	const [mealsPerDay, setMealsPerDay] = useState<UserPreferences['mealsPerDay'] | null>(null)
	const [foodPreferences, setfoodPreferences] = useState<UserPreferences['foodPreferences'] | null>(null)
	const [generateFrom, setGenerateFrom] = useState<UserPreferences['generateFrom'] | null>(null)

	useEffect(() => {
		if (isLoading) { return }
		if (!activeUser || !userDocs) { return }

		// setting states from userDoc to know the preferences
		setMealsPerDay(userDocs[0].preferences.mealsPerDay)
		setfoodPreferences(userDocs[0].preferences.foodPreferences)
		setGenerateFrom(userDocs[0].preferences.generateFrom)

		// eslint-disable-next-line
	}, [isLoading])

	if (isLoading) {
		return (
			<LoadingSpinner />
		)
	}

	return (
		<ContentContainer className="gap-6 px-12 md:px-">
			<h2 className="h2">Weekly meal plan</h2>
			<Pagination week={45} />

			{isError &&
				<Alert color="red" body={'An error occured' + error ? + `: ${error}` : '.'} />
			}

			{userDocs && userDocs[0] && !isLoading &&
				<GenerateMealPlan userDoc={userDocs[0]} />
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
