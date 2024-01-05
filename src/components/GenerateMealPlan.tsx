import React from 'react'
import { UserDoc } from '../types/User.types'
import { useStreamMealsByPreferences } from '../hooks/useStreamMealsByPreferences'
import { Button } from './generic utilities/Button'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from './LoadingSpinner'
import { Alert } from './generic utilities/Alert'

type GenerateMealPlanProps = {
	userDoc: UserDoc
}

export const GenerateMealPlan: React.FC<GenerateMealPlanProps> = ({ userDoc }) => {
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
	const requiredMealAmount = userDoc.preferences.mealsPerDay === 1 ? 7 : 14
	const mealAmountTooFew = mealsDocs && mealsDocs.length < requiredMealAmount
	const mealAmountEnough = mealsDocs && mealsDocs.length >= requiredMealAmount
	console.log('mealsDocs', mealsDocs);

	if (isLoading) {
		return <LoadingSpinner />
	}

	return (
		<>
			{isError && error && <Alert color='red' header="Error" body={error} />}
			{isError && !error && <Alert color='red' header="Error" body="An error occured" />}

			{mealAmountEnough &&
				<section className="flex flex-col gap-2">
					<p>Här finns ingen veckomeny ännu</p>
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
				</section>
			}



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


		</>

	)
}
