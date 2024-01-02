import { Link } from "react-router-dom"
import { Pagination } from "../../components/Pagination"
import { Button } from "../../components/generic utilities/Button"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { useStreamUserPreferences } from "../../hooks/useStreamUserPreferences"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { Alert } from "../../components/generic utilities/Alert"
import { extractPreferences } from "../../helpers/questionHelpers"
import { useAuthContext } from "../../hooks/useAuthContext"
import { UserPreferences } from "../../types/User.types"
import { CreateMeal } from "../../components/create-update-meal/CreateMeal"
import { Modal } from "../../components/generic utilities/Modal"
import { IoMdSettings } from "react-icons/io";
import { Divider } from "../../components/generic utilities/Divider"

export const LandingPage = () => {
	const { activeUser } = useAuthContext()
	const { data: userDocs, isLoading, isError, error } = useStreamUserPreferences()

	// det är nog bättre att skicka in till en generera week menu här som får
	// ge ett error om att det inte finns tillräckligt med maträtter, sen rendera error här.
	// onödigt att hämta flera ggr.
	// const [mealsPerDay, setMealsPerDay] = useState<UserPreferences['mealsPerDay']>()

	// useEffect(() => {
	// 	if (isLoading) { return }
	// 	if (!activeUser) { return }

	// 	const meals = extractPreferences(userDocs, activeUser.uid, 'mealsPerDay')
	// 	setMealsPerDay(meals as UserPreferences['mealsPerDay'])

	// 	// eslint-disable-next-line
	// }, [isLoading])

	if (isLoading) {
		return (
			<LoadingSpinner />
		)
	}

	return (
		<ContentContainer className="gap-6">
			<h2 className="h2">Weekly meal plan</h2>
			<Pagination week={45} />

			{isError &&
				<Alert color="red" body={'An error occured' + error ? + `: ${error}` : '.'} />
			}
			{/* visa härifrån */}
			{/* <p>Här finns ingen veckomeny ännu</p>

			<section className="flex flex-col gap-2">
				<div>
					<Button>
						Generate weekly menu
					</Button>
				</div>
				<p className="text-xs text-gray-500">eller</p>
				<div>
					<Button>
						Generate weekly menu with advanced alternatives
					</Button>
				</div>
			</section> */}
			{/* till hit om: det inte finns veckomeny */}

			{/* kolla preferenser: behövs 7 eller 14 rätter? 1 or 2 mealsPerDay?
			Jämför antalet som behövs med antalet i db, då antingen om det är min egen db eller alla rätter.
			visa SKAPA RÄTTER istället för ovan om det inte finns tillräckligt med rätter */}

			<section className="flex flex-col gap-4">
				<p className="w-80">
					{/* Your preferences for creating the the weekly meal plan is */}
					There is not enough meals in the db for generating a weekly menu outgoing from your preferences.
				</p>
				<Link to="/create-meal">
					<Button>
						Create dish
					</Button>
				</Link>
			</section>


			<section className="flex flex-col items-center gap-0">
				<Divider symbol={<IoMdSettings />} className="py-2" />

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
