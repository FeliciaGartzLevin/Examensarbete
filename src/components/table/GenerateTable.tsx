import { useEffect, useState } from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Alert } from '../generic-utilities/Alert'
import { useQuery } from '@tanstack/react-query'
import { fetchFirebaseDocs, mealsCol, usersCol } from '../../services/firebase'
import { where } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { UserDoc } from '../../types/User.types'
import { ImCross } from "react-icons/im";
import { FaPencilAlt } from 'react-icons/fa'
import { Meal } from '../../types/Meal.types'
import { GenerateChoiceModal, Option } from '../GenerateChoiceModal'
import { Link, useParams } from 'react-router-dom'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { getMealIds } from '../../helpers/restructure-object'
import { generateMealsQueries } from '../../helpers/generating-weekPlan'

export type ClickedBtnType = {
	weekday: keyof WeekPlan['meals'];
	mealType: 'meal' | 'lunch' | 'dinner';
}


export const GenerateTable = () => {
	const { week, year, previewId } = useParams()
	const displayedWeek = Number(week)
	const displayedYear = Number(year)
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error('No active user') }
	const [showEditModal, setShowEditModal] = useState<boolean>(false)
	const [clickedModal, setClickedModal] = useState<ClickedBtnType | null>({ weekday: 'monday', mealType: 'lunch' })
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const [selectedValue, setSeletedValue] = useState<Option | null>(null)
	const [mealsIdsArr, setMealsIdsArr] = useState<(string | null)[] | null>(null)
	const { getPreview } = useFirebaseUpdates()
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

	const {
		data: weekPreviews,
		isLoading: isLoadingWeekPreviews,
		isError: isErrorWeekPreviews,
		error: weekPreviewsError,
	} = useQuery({
		queryKey: ["Week preview", { week: displayedWeek, year: displayedYear, previewId }],
		queryFn: () => getPreview(displayedWeek, displayedYear, previewId),
		enabled: !!previewId && !!displayedWeek && !!displayedYear
	})

	console.log('weekPreviews', weekPreviews);

	const oneMeal = userDocs && userDocs[0].preferences?.mealsPerDay === 1
	const twoMeals = userDocs && userDocs[0].preferences?.mealsPerDay === 2
	const weekPreview = weekPreviews && weekPreviews[0]

	console.log('clickedModal', clickedModal);

	useEffect(() => {
		if (!weekPreview || !oneMeal) { return }
		setMealsIdsArr(
			getMealIds(weekPreview, oneMeal)
		)

	}, [weekPreview, oneMeal])

	const {
		data: mealDocs,
		isLoading: isLoadingMealsDocs,
		isError: isErrorMealsDocs,
		error: mealsDocsError,
	} = useQuery({
		queryKey: ['All meals by user preferences'],
		queryFn: () => fetchFirebaseDocs<Meal>(
			mealsCol,
			// [where("_id", "in", mealIdsArr)]
			generateMealsQueries(userDocs![0].preferences, activeUser.uid)
		),
		enabled: !!userDocs,
		staleTime: 3 * 60 * 1000 // 3 minutes - ev kortare, för skapas ett nytt meal så vill jag hämta direkt igen. hur?
	})

	console.log('mealDocs', mealDocs);

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
		if (!mealDocs) { throw new Error("Can't compare meal id's because meals couldn't be fetched") }

		const foundMeal = mealDocs.find(mealDoc => mealDoc._id === weekDocMealId)
		return (
			<Link to={`/meal/${foundMeal?._id}`}>
				{foundMeal?.name}
			</Link>
			|| null)
	}

	const handleEditClick = (object: ClickedBtnType) => {
		setShowEditModal(true)
		setClickedModal(object)
		setSeletedValue(null)
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
	console.log('selectedValue', selectedValue);

	if (windowSizeisLoading || isLoadingUserDocs || isLoadingMealsDocs || isLoadingWeekPreviews) {
		return <LoadingSpinner />
	}

	return (
		<>

			{/* MODAL for preferences */}
			{showEditModal && clickedModal && mealDocs &&
				<GenerateChoiceModal
					selectedValue={val => setSeletedValue(val)}
					hide={() => setShowEditModal(false)}
					windowWidth={windowWidth}
					mealDocs={mealDocs}
					clickedModal={clickedModal}
				/>
			}

			<div className='border border-black rounded-2xl'>

				<table className="table-auto text-left">
					{isErrorUserDocs &&
						<div className=' w-full h-full flex justify-center items-center'>
							<Alert color='red' header={userDocsError.name || "Error"} body={userDocsError.message || "An error occured fetching meals"} />
						</div>
					}
					{isErrorMealsDocs &&
						<div className=' w-full h-full flex justify-center items-center'>
							<Alert color='red' header={mealsDocsError.name || "Error"} body={mealsDocsError.message || "An error occured fetching meals"} />
						</div>
					}
					{isErrorWeekPreviews &&
						<div className=' w-full h-full flex justify-center items-center'>
							<Alert color='red' header={weekPreviewsError.name || "Error"} body={weekPreviewsError.message || "An error occured fetching meals"} />
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

