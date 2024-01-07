import React from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Cell } from './Cell'

type WeekTableProps = {
	weekDoc: WeekPlan
}

export const WeekTable: React.FC<WeekTableProps> = ({ weekDoc }) => {
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const weekArr = weekdays
	const oneMeal = weekDoc.mealsPerDay === 1
	const twoMeals = weekDoc.mealsPerDay === 2

	const getWeekdayName = (weekday: string) => {
		const wkdnLong = weekday.charAt(0).toUpperCase() + weekday.slice(1)
		const wkdnShort = wkdnLong.slice(0, 2)

		let weekDayName = wkdnLong

		if (!windowWidth || windowWidth && windowWidth < 640) {
			weekDayName = wkdnShort
		}

		return weekDayName
	}

	if (windowSizeisLoading) {
		return <LoadingSpinner />
	}

	return (
		<div className='border border-black rounded-2xl'>
			<table className="table-auto text-left">

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
										<Cell mealId={(weekDoc.meals as OneMealADay)[weekday as keyof WeekPlan['meals']]} />
									</td>
								}

								{/* render if twoMealsPerDay*/}
								{twoMeals &&
									<td>
										<Cell mealId={(weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch} />
									</td>
								}
								{twoMeals &&
									<td>
										<Cell mealId={(weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner} />
									</td>
								}
							</tr>
						)
					})}
				</tbody>

			</table>
		</div>
	)
}

