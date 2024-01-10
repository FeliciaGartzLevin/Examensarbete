import React from 'react'
import { UserDoc } from '../types/User.types'
import { Button } from './generic utilities/Button'
import { Link, useSearchParams } from 'react-router-dom'
import { LoadingSpinner } from './generic utilities/LoadingSpinner'
import { Alert } from './generic utilities/Alert'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { useFirebaseUpdates } from '../hooks/firebase/useFirebaseUpdates'
import shuffle from 'lodash/shuffle'
import { WeekTable } from './table/WeekTable'
import { useSuccessAlert } from '../hooks/useSucessAlert'
import { FaCheck } from 'react-icons/fa6'
import { fetchFirebaseDocs, getCollectionLength, mealsCol, weeksCol } from '../services/firebase'
import { where } from 'firebase/firestore'
import { WeekPlan } from '../types/WeekPlan.types'
import { useAuthContext } from '../hooks/useAuthContext'
import { useQuery } from '@tanstack/react-query'
import { Meal } from '../types/Meal.types'
import { compact } from 'lodash'

type MealPlanProps = {
	userDoc: UserDoc
}

export const MealPlan: React.FC<MealPlanProps> = ({ userDoc }) => {
	const { errorMsg, handleError, resetError, loading, setLoadingStatus } = useErrorHandler()
	const { success, setSuccessState } = useSuccessAlert()
	const [searchParams,] = useSearchParams()
	const displayedWeek = Number(searchParams.get("week"))
	const displayedYear = Number(searchParams.get("year"))
	const { activeUser } = useAuthContext()

	if (!activeUser) { throw new Error("No active user") }

	const {
		data: weeksDocs,
		isLoading: isLoadingWeeksDocs,
		isError: isErrorWeeksDocs,
		error: weeksDocsError,
		isSuccess: weekDocsIsSuccess,
		refetch: refetchWeekDocs,
	} = useQuery({
		queryKey: ["weekPlan", { week: displayedWeek, year: displayedYear }],
		queryFn: () => fetchFirebaseDocs<WeekPlan>(
			weeksCol,
			[
				where('owner', '==', activeUser.uid),
				where('weekNumber', '==', displayedWeek),
				where('year', '==', displayedYear),
			]
		),
	})

	const generateMealsQueries = () => {
		// if generateFrom === "ownDishes", query only meals that active user are owner to, otherwise no query (will fetch all dishes)
		const generateFromFilter = userDoc.preferences.generateFrom === "ownDishes"
			? where("owner", "==", activeUser.uid)
			: null

		let prefFilter = null
		if (userDoc.preferences.foodPreferences.length > 0) {
			// if foodPreferences exists: query on them, otherwise no query, just get all meals
			prefFilter = where("category", "array-contains-any", [userDoc.preferences.foodPreferences])
		}

		// compact = lodash function that removes all falsy values since QueryConstraint[] don't accept such
		return compact([
			prefFilter,
			generateFromFilter
		])
	}

	// fetching the mealDocs that matches the user prefs
	const {
		data: mealsDocsLenght,
		isLoading: isLoadingMealsDocsLenght,
		isError: isErrorMealsDocsLenght,
		error: mealsDocsLenghtError,
	} = useQuery({
		queryKey: ["Length of meals collection"],
		queryFn: () => getCollectionLength<Meal>(mealsCol),
		enabled: weekDocsIsSuccess
			// don't fetch mealDocs lenght unnecessarily. it is not needed if weekDocs already exists
			&& !(weeksDocs?.some((week) => week.weekNumber === displayedWeek && week.year === displayedYear))
	})
	const { createNewWeek } = useFirebaseUpdates()
	const mealsDocsLenghtData = mealsDocsLenght?.data().count
	const requiredMealAmount = userDoc.preferences.mealsPerDay === 1 ? 7 : 14
	const mealAmountTooFew = mealsDocsLenghtData && mealsDocsLenghtData < requiredMealAmount
	const mealAmountEnough = mealsDocsLenghtData && mealsDocsLenghtData >= requiredMealAmount

	const shuffleFn = (mealsDocs: Meal[]) => {
		if (!mealsDocs) { return }

		// shuffle all meals
		const shuffledMeals = shuffle([...mealsDocs])

		// get the first requiredMealAmount from the shuffled array
		return shuffledMeals.slice(0, requiredMealAmount).map(meal => meal._id)
	}


	const handleClickOnGenerateMealPlan = async () => {
		resetError()
		setSuccessState(false)



		try {
			setLoadingStatus(true)

			const mealsArr = await fetchFirebaseDocs<Meal>(
				mealsCol,
				generateMealsQueries()
			)
			console.log('mealsArr', mealsArr)


			const shuffledMealIds = shuffleFn(mealsArr)

			if (!shuffledMealIds) { return }
			// creating new mealplan in firebase db
			await createNewWeek(shuffledMealIds, userDoc.preferences.mealsPerDay, displayedWeek, displayedYear)

			// show confirmation alert
			setSuccessState(true)
			refetchWeekDocs()

		} catch (error) {
			handleError(error)
			setSuccessState(false)
		} finally {
			setLoadingStatus(false)
		}

	}

	if (isLoadingMealsDocsLenght || isLoadingWeeksDocs || loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			{/* error and success handling */}
			{isErrorMealsDocsLenght && mealsDocsLenghtError && <Alert color='red' header={mealsDocsLenghtError.name || "Error"} body={mealsDocsLenghtError.message || "An error occured"} />}
			{isErrorWeeksDocs && weeksDocsError && <Alert color='red' header={weeksDocsError.name || "Error"} body={weeksDocsError.message || "An error occured"} />}
			{errorMsg && <Alert color='red' header="Error" body={errorMsg} />}
			{success && <Alert
				color='green'
				header="Success"
				body={
					<div className='flex justify-center items-center gap-2'>
						<div><FaCheck size={30} color={'text-green-700'} /></div>
						<p>Mealplan was successfully created</p>
					</div>
				}
			/>}

			{/* consider making this whole block to a component (if I can avoid prop drilling) */}
			{!weeksDocs?.length &&
				<>
					{mealAmountTooFew &&
						<section className="flex flex-col items-center gap-4 sm:px-14 md:px-20 lg:px-60">
							<p>
								There is not enough meals in the database for generating a weekly menu outgoing from your preferences.
							</p>

							{mealAmountTooFew && (
								<p className='text-sm text-gray-500'>
									You need to add {' '}
									<span className='text-base'>{requiredMealAmount - mealsDocsLenghtData}</span>{' '}
									more meals to the database
									{userDoc.preferences.mealsPerDay === 2
										? (
											<span>
												{' '}or change to 1 meal a day in the{' '}
												<Link to="/settings/preferences" className="m-0 font-semibold">
													settings
												</Link>.
											</span>
										)
										: '.'
									}
								</p>
							)}

							<Button>
								<Link to="/create-meal">
									Create meals
								</Link>
							</Button>
						</section >
					}

					{mealAmountEnough &&
						<section className="flex flex-col gap-2">
							<p className='mb-4'>Here is no mealplan yet for this week.</p>
							<div>
								<Button onClick={handleClickOnGenerateMealPlan}>
									Generate mealplan
								</Button>
							</div>
							<p className="text-xs text-gray-500">or</p>
							<div>
								<Button>
									Generate mealplan<br />
									<span className='font-thin text-xs'>
										with advanced alternatives
									</span>
								</Button>
							</div>
						</section>
					}
				</>
			}

			{/* If week has mealplan, show it  */}
			{weekDocsIsSuccess
				&& weeksDocs.length > 0
				&& weeksDocs.some((week) => week.weekNumber === displayedWeek && week.year === displayedYear)
				&&
				<WeekTable weekDoc={weeksDocs.find((week) => week.weekNumber === displayedWeek && week.year === displayedYear)} />
			}


		</>

	)
}
