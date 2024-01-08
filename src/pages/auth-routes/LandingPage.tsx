import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Pagination } from "../../components/Pagination"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { useStreamUserDoc } from "../../hooks/useStreamUserDoc"
import { LoadingSpinner } from "../../components/generic utilities/LoadingSpinner"
import { Alert } from "../../components/generic utilities/Alert"
import { Divider } from "../../components/generic utilities/Divider"
import { MealPlan } from "../../components/MealPlan"
import { useEffect } from "react"
import { findLastWeekOfTheYear, getCurrentWeekNumber } from "../../helpers/dates"

export const LandingPage = () => {
	const { weekNumber, year } = getCurrentWeekNumber()
	const [searchParams, setSearchParams] = useSearchParams()
	const thisWeek = Number(searchParams.get("week"))
	const thisYear = Number(searchParams.get("year"))
	const {
		data: userDocs,
		isLoading,
		isError,
		error
	} = useStreamUserDoc()
	const navigate = useNavigate()

	useEffect(() => {
		// if no searchParam
		if (!window.location.search) {
			// redirect initially from "/" to the current week
			navigate(`/?week=${weekNumber}&year=${year}`)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekNumber, year, navigate, window.location.search])

	useEffect(() => {
		const lastWeekOfYear = findLastWeekOfTheYear(year)
		if (thisWeek > lastWeekOfYear) {
			navigate('*')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekNumber, year, navigate])

	if (isLoading) {
		return (
			<LoadingSpinner />
		)
	}

	const handleWeekPaginationBackwards = () => {
		// default new year to same as now
		let newYear = String(searchParams.get("year"))
		// default new week to - 1 week
		let newWeek = String(Number(searchParams.get("week")) - 1)

		// if current week is 1
		if (thisWeek === 1) {
			// then last week is last of the year. check what week that is and set it + set year
			newWeek = String(findLastWeekOfTheYear(thisYear - 1))
			newYear = String(thisYear - 1)
		}

		// finally, set the params
		setSearchParams({
			week: newWeek,
			year: newYear
		})
	}

	const handleWeekPaginationForwards = () => {
		// default new year to same as now
		let newYear = String(searchParams.get("year"))
		// default new week to + 1 week
		let newWeek = String(Number(searchParams.get("week")) + 1)

		// check if thisWeek is the last week of the year
		if (thisWeek === findLastWeekOfTheYear(thisYear)) {
			// if so, let next week be the first week of the new year + set the new year
			newWeek = String(1)
			newYear = String(thisYear + 1)
		}

		// finally, set the params
		setSearchParams({
			week: newWeek,
			year: newYear
		})
	}

	return (
		<ContentContainer className="gap-6 px-12 md:px-20">
			<h2 className="h2">Weekly meal plan</h2>
			<Pagination
				header={'Week ' + searchParams.get("week") + ' of ' + searchParams.get("year")}
				onClickBack={handleWeekPaginationBackwards}
				onClickForward={handleWeekPaginationForwards}
			/>

			{isError &&
				<Alert color="red" body={'An error occured' + error ? + `: ${error}` : '.'} />
			}

			{userDocs && userDocs[0] && !isLoading &&
				<MealPlan userDoc={userDocs[0]} displayedWeek={Number(searchParams.get("week"))} displayedYear={Number(searchParams.get("year"))} />
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
