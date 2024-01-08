import React, { useEffect, useState } from 'react'
import { UserDoc } from '../types/User.types'
import { useStreamMealsByPreferences } from '../hooks/useStreamMealsByPreferences'
import { Button } from './generic utilities/Button'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from './generic utilities/LoadingSpinner'
import { Alert } from './generic utilities/Alert'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { useFirebaseUpdates } from '../hooks/useFirebaseUpdates'
import shuffle from 'lodash/shuffle'
import { WeekTable } from './table/WeekTable'
import { useSuccessAlert } from '../hooks/useSucessAlert'
import { FaCheck } from 'react-icons/fa6'
import { useStreamUserWeek } from '../hooks/useStreamUserWeek'

type MealPlanProps = {
	userDoc: UserDoc
	displayedWeek: number
	displayedYear: number
}

export const MealPlan: React.FC<MealPlanProps> = ({ userDoc, displayedWeek, displayedYear }) => {
	const { errorMsg, handleError, resetError, loading, setLoadingStatus } = useErrorHandler()
	const { success, setSuccessState } = useSuccessAlert()
	const [hasMealPlan, setHasMealPlan] = useState<boolean>(false)

	// streaming the mealDocs that matches the user prefs
	const {
		data: mealsDocs,
		isLoading: isLoadingMealsDocs,
		isError: isErrorMealsDocs,
		error: mealsDocsError,
	} = useStreamMealsByPreferences(
		userDoc.preferences.generateFrom,
		userDoc.preferences.foodPreferences.length > 0
			? userDoc.preferences.foodPreferences
			: null
	)

	// getting mealplan, if any, for displayed week and year
	const {
		data: weeksDocs,
		isLoading: isLoadingWeeksDocs,
		isError: isErrorWeeksDocs,
		error: weeksDocsError,
	} = useStreamUserWeek(displayedWeek, displayedYear)

	const { createNewWeek } = useFirebaseUpdates()
	const requiredMealAmount = userDoc.preferences.mealsPerDay === 1 ? 7 : 14
	const mealAmountTooFew = mealsDocs && mealsDocs.length < requiredMealAmount
	const mealAmountEnough = mealsDocs && mealsDocs.length >= requiredMealAmount

	useEffect(() => {
		if (!weeksDocs?.length) { return }

		setHasMealPlan(true)
	}, [weeksDocs, displayedWeek])

	const shuffleFn = () => {
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

			const shuffledMealIds = shuffleFn()

			if (!shuffledMealIds) { return }
			// creating new mealplan in firebase db
			await createNewWeek(shuffledMealIds, userDoc.preferences.mealsPerDay, displayedWeek, displayedYear)

			// show confirmation alert
			setSuccessState(true)
		} catch (error) {
			handleError(error)
			setSuccessState(false)
		} finally {
			setLoadingStatus(false)
		}

	}

	if (isLoadingMealsDocs || isLoadingWeeksDocs || loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			{/* error and success handling */}
			{isErrorMealsDocs && mealsDocsError && <Alert color='red' header="Error" body={mealsDocsError || "An error occured"} />}
			{isErrorWeeksDocs && weeksDocsError && <Alert color='red' header="Error" body={weeksDocsError || "An error occured"} />}
			{errorMsg && <Alert color='red' header="Error" body={errorMsg} />}
			{success && <Alert
				color='green'
				header="Success"
				body={
					<div className='flex justify-center'>
						<div><FaCheck size={30} color={'text-green-700'} /></div>
						<p>Mealplan was successfully created</p>
					</div>
				}
			/>}


			{/* consider making this whole block to a component (if I can avoid prop drilling) */}
			{!hasMealPlan &&
				<>
					{mealAmountTooFew &&
						<section className="flex flex-col items-center gap-4 sm:px-14 md:px-20 lg:px-60">
							<p>
								There is not enough meals in the database for generating a weekly menu outgoing from your preferences.
							</p>

							{mealAmountTooFew && (
								<p className='text-sm text-gray-500'>
									You need to add {' '}
									<span className='text-base'>{requiredMealAmount - mealsDocs.length}</span>{' '}
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
			{hasMealPlan && weeksDocs && weeksDocs.length &&
				<WeekTable weekDoc={weeksDocs[0]} />
			}


		</>

	)
}
