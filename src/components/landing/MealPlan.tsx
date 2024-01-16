import React, { useEffect, useState } from 'react'
import { UserDoc } from '../../types/User.types'
import { Button } from '../generic-utilities/Button'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { Alert } from '../generic-utilities/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { WeekTable } from '../table/WeekTable'
import { useSuccessAlert } from '../../hooks/useSucessAlert'
import { FaCheck } from 'react-icons/fa6'
import { fetchFirebaseDocs, getCollectionLength, mealsCol } from '../../services/firebase'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useQuery } from '@tanstack/react-query'
import { Meal } from '../../types/Meal.types'
import { generateMealsQueries, shuffleFn } from '../../helpers/generating-weekPlan'
import { useGeneratePreview } from '../../hooks/firebase/useGeneratePreview'


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
	const requiredMealAmount = userDoc.preferences.mealsPerDay === 1 ? 7 : 14
	const [mealAmountEnough, setMealAmoutEnough] = useState<boolean>(true)
	const { getWeekPlan } = useFirebaseUpdates()
	const { generatePreview } = useGeneratePreview('generate')
	const { refetchWeekNavState } = useLocation().state || {}

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
		queryFn: () => getWeekPlan(displayedWeek, displayedYear),
	})

	// fetching the mealDocs that matches the user prefs
	const {
		data: mealsDocsLenght,
		isSuccess: isSuccessmealsDocsLenght,
		isLoading: isLoadingMealsDocsLenght,
		isError: isErrorMealsDocsLenght,
		error: mealsDocsLenghtError,
	} = useQuery({
		queryKey: ["Length of meals collection"],
		queryFn: () => getCollectionLength<Meal>(
			mealsCol,
			generateMealsQueries(userDoc.preferences, activeUser.uid)
		),
		enabled: weekDocsIsSuccess
			// don't fetch mealDocs lenght unnecessarily. it is not needed if weekDocs already exists
			&& !(weeksDocs?.some((week) => week.weekNumber === displayedWeek && week.year === displayedYear)),
		staleTime: 0 // so it will refetch on every trigger at any time
	})
	const { createNewWeek } = useFirebaseUpdates()
	const mealsDocsLenghtData = mealsDocsLenght?.data().count

	useEffect(() => {
		if (!isSuccessmealsDocsLenght) { return }

		if (mealsDocsLenghtData === 0) {
			setMealAmoutEnough(false)
		} else if (mealsDocsLenghtData && mealsDocsLenghtData >= 1) {
			setMealAmoutEnough(mealsDocsLenghtData >= requiredMealAmount)
		}

	}, [mealsDocsLenghtData, isSuccessmealsDocsLenght, requiredMealAmount])

	const handleClickOnGenerateMealPlan = async () => {
		resetError()
		setSuccessState(false)

		try {
			setLoadingStatus(true)

			const mealsArr = await fetchFirebaseDocs<Meal>(
				mealsCol,
				generateMealsQueries(userDoc.preferences, activeUser.uid)
			)

			const shuffledMealIds = shuffleFn(mealsArr, requiredMealAmount)

			if (!shuffledMealIds) { return }
			// creating new mealplan in firebase db
			await createNewWeek(shuffledMealIds, userDoc.preferences, displayedWeek, displayedYear)

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

	useEffect(() => {
		refetchWeekDocs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchWeekNavState])

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
			{!weeksDocs?.length && isSuccessmealsDocsLenght && !!mealsDocsLenght &&
				<>
					{!mealAmountEnough &&
						<section className="flex flex-col items-center gap-4 sm:px-14 md:px-20 lg:px-60">
							<p>
								There is not enough meals in the database for generating a weekly menu outgoing from your preferences.
							</p>

							<p className='text-sm text-gray-500'>
								You need to add {' '}
								<span className='text-base'>{requiredMealAmount - mealsDocsLenghtData!}</span>{' '}
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
							<p className="text-sm text-gray-500">or</p>
							<div>
								<Button onClick={() => generatePreview(userDoc, displayedWeek, displayedYear)}>
									Generate<br />
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
			{
				weekDocsIsSuccess
				&& weeksDocs.length > 0
				&& weeksDocs.some((week) => week.weekNumber === displayedWeek && week.year === displayedYear)
				&&
				<WeekTable
					userDoc={userDoc}
					weekDoc={
						weeksDocs.find((week) =>
							week.weekNumber === displayedWeek
							&& week.year === displayedYear)
					} />

			}

		</>

	)
}
