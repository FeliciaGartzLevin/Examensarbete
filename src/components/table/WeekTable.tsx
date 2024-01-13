import React from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Alert } from '../generic-utilities/Alert'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchFirebaseDocs, mealsCol } from '../../services/firebase'
import { Meal } from '../../types/Meal.types'
import { where } from 'firebase/firestore'

type WeekTableProps = {
	weekDoc: WeekPlan | undefined
}

export const WeekTable: React.FC<WeekTableProps> = ({ weekDoc }) => {
	const { windowWidth, windowSizeisLoading } = useWindowSize()
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

	const getWeekdayName = (weekday: string) => {
		const wkdnLong = weekday.charAt(0).toUpperCase() + weekday.slice(1)
		const wkdnShort = wkdnLong.slice(0, 2)

		let weekDayName = wkdnLong

		if (!windowWidth || windowWidth && windowWidth < 640) {
			weekDayName = wkdnShort
		}

		return weekDayName
	}

	const getMealName = (weekDocMealId: string | null) => {
		// function that returns the mealDoc.name whos mealDoc._id === weekDocMealId
		if (!mealsDocs) { throw new Error("Can't compare meal id's because mealsDocs couln't be found") }

		const foundMeal = mealsDocs.find(mealDoc => mealDoc._id === weekDocMealId)
		return (
			<Link to={`/meal/${foundMeal?._id}`}>
				{foundMeal?.name}
			</Link>
			|| null)
	}

	if (windowSizeisLoading || isLoadingMealsDocs) {
		return <LoadingSpinner />
	}

	return (
		<>
			<div className='border border-black rounded-2xl'>

				<table className="table-auto text-left relative">
					{isErrorMealsDocs && mealsDocsError &&
						<div className='absolute w-full h-full flex justify-center items-center'>
							<Alert color='red' header={mealsDocsError.name || "Error"} body={mealsDocsError.message || "An error occured fetching meals"} />
						</div>
					}

					<thead>
						<tr className='bg-slate-200'>
							<th>Day</th>
							{oneMeal &&
								<th>Meal</th>
							}
							{twoMeals &&
								<>
									<th>Lunch</th>
									<th>Dinner</th>
								</>
							}
						</tr>
					</thead>

					<tbody>
						{weekArr.map((weekday, index) => {
							return (
								<tr key={index} className='odd:bg-white even:bg-slate-100'>

									{/* Always render name of weekday */}
									<td>{getWeekdayName(weekday)}</td>

									{/* render if oneMealPerDay*/}
									{oneMeal &&
										<td>
											{getMealName((weekDoc.meals as OneMealADay)[weekday as keyof WeekPlan['meals']]) || <LuUtensilsCrossed size={30} />}
										</td>
									}

									{/* render if twoMealsPerDay*/}
									{twoMeals &&
										<td>
											{getMealName((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch) || <LuUtensilsCrossed size={30} />}
										</td>
									}
									{twoMeals &&
										<td>
											{getMealName((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner) || <LuUtensilsCrossed size={30} />}
										</td>
									}
								</tr>
							)
						})}
					</tbody>

				</table>
			</div>
		</>
	)
}

