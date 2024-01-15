import React from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Alert } from '../generic-utilities/Alert'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchFirebaseDocs, mealsCol } from '../../services/firebase'
import { Meal } from '../../types/Meal.types'
import { where } from 'firebase/firestore'
import { GenericTable } from './GenericTable'

type WeekTableProps = {
	weekDoc: WeekPlan | undefined
}

export const WeekTable: React.FC<WeekTableProps> = ({ weekDoc }) => {
	const weekArr = weekdays
	const oneMeal = weekDoc?.userPreferences.mealsPerDay === 1
	const twoMeals = weekDoc?.userPreferences.mealsPerDay === 2
	const [searchParams,] = useSearchParams()
	const displayedWeek = Number(searchParams.get("week"))
	const displayedYear = Number(searchParams.get("year"))
	const getMealIds = () => {
		const mealIdsArr: Array<string | null> = []

		weekArr.map(weekday => {
			if (oneMeal) {
				mealIdsArr.push((weekDoc.meals as OneMealADay)[weekday as keyof WeekPlan['meals']])
			}
			if (twoMeals) {
				mealIdsArr.push((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch)
				mealIdsArr.push((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner)
			}
		})
		// Remove null values if any
		const filteredMealIds = mealIdsArr.filter((mealId) => mealId !== null);

		return filteredMealIds
	}

	const {
		data: mealsDocs,
		isLoading: isLoadingMealsDocs,
		isError: isErrorMealsDocs,
		error: mealsDocsError,
	} = useQuery({
		queryKey: ["weekPlanMeals", { week: displayedWeek, year: displayedYear }],
		queryFn: () => fetchFirebaseDocs<Meal>(
			mealsCol,
			[where('_id', 'in', getMealIds())]
		)
	})


	if (isLoadingMealsDocs) {
		return <LoadingSpinner />
	}

	return (
		<>
			{isErrorMealsDocs && mealsDocsError &&
				<div className='absolute w-full h-full flex justify-center items-center'>
					<Alert color='red' header={mealsDocsError.name || "Error"} body={mealsDocsError.message || "An error occured fetching meals"} />
				</div>
			}
			{weekDoc &&
				<GenericTable
					editTable={false}
					weekOrPreviewDoc={weekDoc}
					mealDocs={mealsDocs}
					oneMeal={oneMeal}
				/>

			}

		</>
	)
}

