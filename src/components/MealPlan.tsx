import React, { useState } from 'react'
import { UserDoc } from '../types/User.types'
import { useStreamMealsByPreferences } from '../hooks/useStreamMealsByPreferences'
import { Button } from './generic utilities/Button'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from './LoadingSpinner'
import { Alert } from './generic utilities/Alert'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { useFirebaseUpdates } from '../hooks/useFirebaseUpdates'
import shuffle from 'lodash/shuffle'

type MealPlanProps = {
	userDoc: UserDoc
}

export const MealPlan: React.FC<MealPlanProps> = ({ userDoc }) => {
	const { errorMsg, handleError, resetError, loading, setLoadingStatus } = useErrorHandler()
	const [success, setSuccess] = useState(false)
	const [hasMealPlan, setHasMealPlan] = useState<boolean>(false)
	const {
		data: mealsDocs,
		isLoading,
		isError,
		error,
	} = useStreamMealsByPreferences(
		userDoc.preferences.generateFrom,
		userDoc.preferences.foodPreferences.length > 0
			? userDoc.preferences.foodPreferences
			: null
	)
	const { createNewWeek } = useFirebaseUpdates()
	const requiredMealAmount = userDoc.preferences.mealsPerDay === 1 ? 7 : 14
	const mealAmountTooFew = mealsDocs && mealsDocs.length < requiredMealAmount
	const mealAmountEnough = mealsDocs && mealsDocs.length >= requiredMealAmount
	console.log('mealsDocs', mealsDocs);

	if (isLoading) {
		return <LoadingSpinner />
	}

	const shuffleFn = () => {
		if (!mealsDocs) { return }

		// shuffle all meals with fisher yates
		const shuffledMeals = shuffle([...mealsDocs])

		return shuffledMeals.slice(0, requiredMealAmount).map(meal => meal._id);

	}

	const handleClickOnGenerateMealPlan = async () => {
		resetError()
		setSuccess(false)

		try {
			setLoadingStatus(true)

			const shuffledMealIds = shuffleFn()
			if (!shuffledMealIds) { return }

			// creating new mealplan in firebase db
			await createNewWeek(shuffledMealIds, userDoc.preferences.mealsPerDay)

			// show confirmation alert
			setSuccess(true)
		} catch (error) {
			handleError(error)
			setSuccess(false)
		} finally {
			setLoadingStatus(false)
		}

	}

	return (
		<>
			{/* error handling */}
			{isError && error && <Alert color='red' header="Error" body={error} />}
			{isError && !error && <Alert color='red' header="Error" body="An error occured" />}
			{errorMsg && <Alert color='red' header="Error" body={errorMsg} />}

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


			{/* If week has mealplan show it */}
			{/* {hasMealPlan &&
			<WeekTable/>
			} */}


		</>

	)
}
