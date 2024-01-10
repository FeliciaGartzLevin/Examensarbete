import React, { ReactNode, useState } from 'react'
import { LunchAndDinner, OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Alert } from '../generic-utilities/Alert'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchFirebaseDocs, usersCol } from '../../services/firebase'
import { where } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { UserDoc } from '../../types/User.types'
import { ImCross } from "react-icons/im";
import { Modal } from '../generic-utilities/Modal'
import { FaPencilAlt } from 'react-icons/fa'
import Select from 'react-select'
import { Meal } from '../../types/Meal.types'
import { Button } from '../generic-utilities/Button'

type GenerateTableProps = {
}

type ClickedBtnType = {
	weekday: keyof WeekPlan['meals'];
	mealType: 'meal' | 'lunch' | 'dinner';
}


export const GenerateTable: React.FC<GenerateTableProps> = () => {
	const { week: displayedWeek, year: displayedYear } = useParams()
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error('No active user') }
	const [showEditModal, setShowEditModal] = useState<boolean>(false)
	const [clickedModal, setClickedModal] = useState<ClickedBtnType | null>(null)
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const weekArr = weekdays

	const {
		data: userDocs,
		isLoading: isLoadingUserDocs,
		isError: isErrorUserDocs,
		error: userDocsError,
	} = useQuery({
		queryKey: ["userDoc"],
		queryFn: () => fetchFirebaseDocs<UserDoc>(
			usersCol,
			[where('uid', '==', activeUser?.uid)]
		),
		enabled: !!activeUser?.uid
	})

	const oneMeal = userDocs && userDocs[0].preferences?.mealsPerDay === 1
	const twoMeals = userDocs && userDocs[0].preferences?.mealsPerDay === 2
	console.log('clickedModal', clickedModal);

	// const getMealIds = () => {
	// 	const mealIdsArr: Array<string | null> = []

	// 	weekArr.map(weekday => {
	// 		if (oneMeal) {
	// 			mealIdsArr.push((weekDoc.meals as OneMealADay)[weekday as keyof WeekPlan['meals']])
	// 		}
	// 		if (twoMeals) {
	// 			mealIdsArr.push((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch)
	// 			mealIdsArr.push((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner)
	// 		}
	// 	})
	// 	// Remove null values if any
	// 	const filteredMealIds = mealIdsArr.filter((mealId) => mealId !== null);

	// 	return filteredMealIds
	// }

	// const {
	// 	data: mealsDocs,
	// 	isLoading: isLoadingMealsDocs,
	// 	isError: isErrorMealsDocs,
	// 	error: mealsDocsError,
	// } = useQuery({
	// 	queryKey: ["weekPlanMeals", { week: displayedWeek, year: displayedYear }],
	// 	queryFn: () => fetchFirebaseDocs<Meal>(
	// 		mealsCol,
	// 		[where('_id', 'in', getMealIds())]
	// 	),
	// 	enabled: false
	// })

	const getWeekdayName = (weekday: string) => {
		const wkdnLong = weekday.charAt(0).toUpperCase() + weekday.slice(1)
		const wkdnShort = wkdnLong.slice(0, 2)

		let weekDayName = wkdnLong

		if (!windowWidth || windowWidth && windowWidth < 640) {
			weekDayName = wkdnShort
		}

		return weekDayName
	}

	// const getMealName = (weekDocMealId: string | null) => {
	// 	// function that returns the mealDoc.name whos mealDoc._id === weekDocMealId
	// 	if (!mealsDocs) { throw new Error("Can't compare meal id's because meals couldn't be fetched") }

	// 	const foundMeal = mealsDocs.find(mealDoc => mealDoc._id === weekDocMealId)
	// 	return (
	// 		<Link to={`/meal/${foundMeal?._id}`}>
	// 			{foundMeal?.name}
	// 		</Link>
	// 		|| null)
	// }

	const handleEditClick = (object: ClickedBtnType) => {
		setShowEditModal(true)
		setClickedModal(object)
	}
	const renderTableContent = (object: ClickedBtnType) => {

		return (<div className='flex justify-center items-center gap-2'>
			<button
				onClick={() => handleEditClick(object)}
				type='button'
				title='Edit meal slot'
				className='text-gray-600 hover:text-black'
			>
				<FaPencilAlt size={23} />
			</button>
			{/* onClick={updateRemoveFn där meal blir null ist} */}
			<button
				title='Remove meal from slot'
				className='text-button-red text-lg hover:text-button-red-hover'>
				<ImCross />
			</button>
		</div>)
	}

	if (windowSizeisLoading || isLoadingUserDocs) {
		return <LoadingSpinner />
	}

	return (
		<>

			{showEditModal &&
				<div className='h-full w-full fixed top-0 left-0'>
					<Modal hide={() => setShowEditModal(false)}>
						<section>
							<h2 className='h2'>
								Filter
							</h2>
							{clickedModal &&
								<p className='text-sm text-gray-500'>
									{`for ${clickedModal?.weekday} ${clickedModal.mealType}`}
								</p>
							}
						</section>
						<section>
							<h3 className='h3'>Choose specific mealt</h3>
						</section>
						<section>
							<h3 className='h3'>Categories</h3>
						</section>
						<section>
							<Button type="button" color="green" style="fill">
								Save choice
							</Button>
						</section>
					</Modal>
				</div>
			}

			<div className='border border-black rounded-2xl'>

				<table className="table-auto text-left">
					{isErrorUserDocs &&
						<div className=' w-full h-full flex justify-center items-center'>
							<Alert color='red' header={userDocsError.name || "Error"} body={userDocsError.message || "An error occured fetching meals"} />
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
									<td className='text-left flex items-center justify-between gap-2'>
										{getWeekdayName(weekday)}

									</td>

									{/* render if oneMealPerDay*/}
									{oneMeal &&
										<td>
											{renderTableContent({
												weekday: weekday as keyof WeekPlan['meals'],
												mealType: 'meal'
											})}
											{/* {getMealName((weekDoc.meals as OneMealADay)[weekday as keyof WeekPlan['meals']]) || <LuUtensilsCrossed size={30} />} */}
										</td>
									}

									{/* render if twoMealsPerDay*/}
									{twoMeals &&
										<td>
											{renderTableContent({
												weekday: weekday as keyof WeekPlan['meals'],
												mealType: 'lunch'
											})}
											{/* {getMealName((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch) || <LuUtensilsCrossed size={30} />} */}
										</td>
									}
									{twoMeals &&
										<td>
											{renderTableContent({
												weekday: weekday as keyof WeekPlan['meals'],
												mealType: 'dinner'
											})}
											{/* {getMealName((weekDoc.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].dinner) || <LuUtensilsCrossed size={30} />} */}
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

