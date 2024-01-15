import React, { useCallback } from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { ClickedBtnType } from './GenerateTable'
import { ImCross } from 'react-icons/im'
import { FaPencilAlt } from 'react-icons/fa'
import { FaQuestion } from 'react-icons/fa6'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { RiRestaurantLine } from 'react-icons/ri'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { Meal } from '../../types/Meal.types'
import { weekdays } from '../../helpers/dates'


type GenericTableProps = {
	editTable: boolean
	weekOrPreviewDoc: WeekPlan
	mealDocs: Meal[] | undefined
	oneMeal: boolean | null
	handleDeleteClick?: (object: ClickedBtnType) => Promise<void>
	handleEditClick?: (object: ClickedBtnType) => void
}

export const GenericTable: React.FC<GenericTableProps> = ({
	editTable,
	weekOrPreviewDoc,
	mealDocs,
	oneMeal,
	handleDeleteClick,
	handleEditClick,
}) => {
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const weekPreview = weekOrPreviewDoc
	const weekArr = weekdays

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
		if (!mealDocs) { throw new Error("Can't find meal names because meals couldn't be fetched") }

		if (weekDocMealId === 'eatOut' || weekDocMealId === 'noMeal' || !weekDocMealId) {
			return (
				<>
					{editTable && <div className='w-[1rem]'></div>}
					<div>
						{weekDocMealId === 'eatOut' && <RiRestaurantLine size={33} />}
						{weekDocMealId === 'noMeal' && <LuUtensilsCrossed size={33} />}
						{!weekDocMealId && <FaQuestion size={33} />}
					</div>
				</>
			)
		}

		const foundMeal = mealDocs.find(mealDoc => mealDoc._id === weekDocMealId)

		return foundMeal?.name || <FaQuestion size={33} />

	}

	const renderTableContent = useCallback((object: ClickedBtnType, weekDocMealId: string | null) => {

		const renderEditButtons = () => {
			if (handleDeleteClick && handleEditClick) {
				return (
					<div className='flex justify-end gap-3'>
						<button
							onClick={() => handleEditClick(object)}
							type='button'
							title='Edit meal slot'
							className='text-green-800 hover:bg-button-green-hover hover:text-white border border-black rounded-md p-2'
						>
							<FaPencilAlt size={20} />
						</button>

						{weekDocMealId &&
							<button
								onClick={() => handleDeleteClick(object)}
								title='Remove meal from slot'
								className='text-button-red text-lg hover:bg-button-red hover:text-white border border-black rounded-md p-2'>
								<ImCross />
							</button>}
					</div>
				)
			} else {
				return
			}
		}

		return (
			<div className='flex flex-col justify-between items-start gap-2'>
				{getMealName(weekDocMealId)}
				{renderEditButtons()}
			</div>
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleDeleteClick])

	if (windowSizeisLoading) {
		return <LoadingSpinner />
	}

	return (
		<div className='border border-black rounded-2xl overflow-hidden'>

			<table className="table-fixed text-left overflow-x-auto no-scrollbar">

				<thead>
					<tr className='bg-slate-200'>
						<th>Day</th>
						{oneMeal &&
							<th >Meal</th>
						}
						{!oneMeal &&
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
								<td>
									<div className='flex items-center justify-start'>
										{getWeekdayName(weekday)}
									</div>
								</td>

								{/* render if oneMealPerDay*/}
								{oneMeal &&
									<td >
										{renderTableContent({
											weekday: weekday as keyof WeekPlan['meals'],
											mealType: 'meal'
										},
											(weekPreview.meals as OneMealADay)[weekday as keyof WeekPlan['meals']]
										)}
									</td>
								}

								{/* render if twoMealsPerDay*/}
								{!oneMeal &&
									<td >
										{renderTableContent({
											weekday: weekday as keyof WeekPlan['meals'],
											mealType: 'lunch'
										},
											(weekPreview.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch
										)}
									</td>
								}
								{!oneMeal &&
									<td >
										{renderTableContent({
											weekday: weekday as keyof WeekPlan['meals'],
											mealType: 'dinner'
										},
											(weekPreview.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner
										)}
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
