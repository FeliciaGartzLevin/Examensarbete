import { useEffect, useState } from 'react'
import { OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { weekdays } from '../../helpers/dates'
import { Alert } from '../generic-utilities/Alert'
import { useQuery } from '@tanstack/react-query'
import { deleteFirebaseDoc, fetchFirebaseDocs, mealsCol, previewsCol } from '../../services/firebase'
import { useAuthContext } from '../../hooks/useAuthContext'
import { ImCross } from "react-icons/im";
import { FaPencilAlt } from 'react-icons/fa'
import { Meal } from '../../types/Meal.types'
import { GenerateChoiceModal } from '../GenerateChoiceModal'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { generateMealsQueries } from '../../helpers/generating-weekPlan'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { useStreamUserDoc } from '../../hooks/firebase/useStreamUserDoc'
import { FaQuestion } from "react-icons/fa";
import { RiRestaurantLine } from 'react-icons/ri'

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
	const [mealAmountEnough, setMealAmoutEnough] = useState<boolean>(true)
	const [redirect, setRedirect] = useState<boolean>(false)
	const { getPreview, createNewWeekPreview } = useFirebaseUpdates()
	const navigate = useNavigate()
	const weekArr = weekdays
	/**
	 * Firebase streaming
	 *
	 * stream user docs to always have them available if any changes are being made
	 */
	const {
		data: userDocs,
		isLoading: isLoadingUserDocs,
		isError: isErrorUserDocs,
		error: userDocsError,
	} = useStreamUserDoc()

	/**
	 * Tanstack fetching
	 *
	 */

	const {
		data: weekPreviews,
		isLoading: isLoadingWeekPreviews,
		isError: isErrorWeekPreviews,
		error: weekPreviewsError,
		refetch: refetchWeekPreview,
	} = useQuery({
		queryKey: ["Week preview", { week: displayedWeek, year: displayedYear, previewId }],
		queryFn: () => getPreview(displayedWeek, displayedYear, previewId),
		enabled: !!previewId && !!displayedWeek && !!displayedYear,
		staleTime: Infinity // ändra tbx sen!!!!!!!!! detta är bara för stylingen
	})

	const {
		data: mealDocs,
		isLoading: isLoadingMealsDocs,
		isError: isErrorMealsDocs,
		error: mealsDocsError,
		isSuccess: isSuccessMealDocs,
		refetch: refetchMealDocs,
	} = useQuery({
		queryKey: ['All meals by user preferences'],
		queryFn: () => fetchFirebaseDocs<Meal>(
			mealsCol,
			// [where("_id", "in", mealIdsArr)]
			generateMealsQueries(userDocs![0].preferences, activeUser.uid)
		),
		enabled: !!userDocs,
		staleTime: Infinity // ändra tbx sen!!!!!!!!! detta är bara för stylingen
	})


	const oneMeal = userDocs && userDocs[0].preferences?.mealsPerDay === 1
	const twoMeals = userDocs && userDocs[0].preferences?.mealsPerDay === 2
	const requiredMealAmount = userDocs && userDocs[0].preferences.mealsPerDay === 1 ? 7 : 14
	const weekPreview = weekPreviews && weekPreviews[0]

	console.log('weekPreviews', weekPreviews);
	console.log('clickedModal', clickedModal);
	console.log('mealDocs', mealDocs);

	/**
	 * Initial check to see if settings have changed, and if meals are still enough for creating recipes
	 *
	 */

	useEffect(() => {
		if (!isSuccessMealDocs || !mealDocs || !userDocs) { return }

		if (mealDocs.length === 0) {
			setMealAmoutEnough(false)
			setRedirect(true)
		} else if (mealDocs.length >= 1) {
			setMealAmoutEnough(mealDocs.length >= requiredMealAmount)
			setRedirect(mealDocs.length <= requiredMealAmount)
		}

	}, [mealDocs, isSuccessMealDocs, requiredMealAmount, userDocs])

	// if there was enough meals, go to next check below

	const deleteAndMakeNewPreview = async () => {
		if (!weekPreview || !userDocs) { return }

		await deleteFirebaseDoc(previewsCol, weekPreview?._id)

		const newPreviewId = await createNewWeekPreview(userDocs[0].preferences, displayedWeek, displayedYear)

		if (!newPreviewId) { throw new Error("New week preview couldn't be created") }
		navigate(`/generate/week/${displayedWeek}/year/${displayedYear}/previewId/${newPreviewId}`)
	}

	useEffect(() => {
		if (!userDocs || !weekPreview || !mealAmountEnough) { return }
		// checking if the arrays contains the same values
		// if no preference settings have changed since preview was created: do nothing
		if (weekPreview.userPreferences.mealsPerDay === userDocs[0].preferences.mealsPerDay
			&& weekPreview.userPreferences.generateFrom === userDocs[0].preferences.generateFrom
			&& weekPreview.userPreferences.foodPreferences.every((preference, index) => preference === userDocs[0].preferences.foodPreferences[index])
		) { return }

		//  if preferences has changed: delete preview and create a new
		deleteAndMakeNewPreview()

		refetchMealDocs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekPreview, userDocs])

	/**
	 * Functions for rendering the table
	 *
	 */
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
					<div className='w-[1rem]'></div>
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

	const handleEditClick = (object: ClickedBtnType) => {
		setShowEditModal(true)
		setClickedModal(object)
	}

	const renderTableContent = (object: ClickedBtnType, weekDocMealId: string | null) => {
		return (
			<div className='flex justify-between items-center gap-2'>
				{getMealName(weekDocMealId)}

				<div className='flex flex-col justify-between items-center gap-3'>
					<button
						onClick={() => handleEditClick(object)}
						type='button'
						title='Edit meal slot'
						className='text-green-800 hover:bg-button-green-hover hover:text-white border border-black p-2'
					>
						<FaPencilAlt size={20} />
					</button>
					{/* onClick={updateRemoveFn där meal blir null ist} */}
					<button
						title='Remove meal from slot'
						className='text-button-red text-lg hover:bg-button-red hover:text-white border border-black p-2'>
						<ImCross />
					</button>

				</div>
			</div>
		)
	}

	if (windowSizeisLoading || isLoadingUserDocs || isLoadingMealsDocs || isLoadingWeekPreviews) {
		return <LoadingSpinner />
	}

	// if not enough meals, redirect is set to true and user gets a warning message + being redirected
	if (redirect) {

		setTimeout(() => {
			navigate(`/?week=${displayedWeek}&year=${displayedYear}`)
		}, 5000)

		return (
			<Alert color='orange' header="Not enough meals" body="There are not enough meals to create a weekplan after changing your preferences. You are being redirected." />
		)
	}

	return (
		<>

			{/* Modal for choosing */}
			{showEditModal && clickedModal && mealDocs && weekPreview &&
				<GenerateChoiceModal
					hide={() => setShowEditModal(false)}
					windowWidth={windowWidth}
					mealDocs={mealDocs}
					clickedModal={clickedModal}
					weekPreview={weekPreview}
					refetchPreview={() => refetchWeekPreview()}
				/>
			}
			{windowWidth && windowWidth < 640 && !windowSizeisLoading && weekPreview && weekPreview.userPreferences.mealsPerDay === 2 &&
				<div className='h-full flex justify-center items-center mb-3'>
					<Alert color='blackandwhite' body="Please turn your device screen for a better experience" className='w-[80%]' />
				</div>
			}

			{isErrorUserDocs &&
				<div className='w-full h-full flex justify-center items-center mb-3'>
					<Alert color='red' header={"Error"} body={userDocsError || "An error occured when fetching meals"} />
				</div>
			}
			{isErrorMealsDocs &&
				<div className=' w-full h-full flex justify-center items-center mb-3'>
					<Alert color='red' header={mealsDocsError.name || "Error"} body={mealsDocsError.message || "An error occured fetching meals"} />
				</div>
			}
			{isErrorWeekPreviews &&
				<div className=' w-full h-full flex justify-center items-center mb-3'>
					<Alert color='red' header={weekPreviewsError.name || "Error"} body={weekPreviewsError.message || "An error occured fetching meals"} />
				</div>
			}

			{weekPreview &&
				<div className='border border-black rounded-2xl overflow-hidden '>

					<table className="table-auto text-left overflow-x-auto ">

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
										<td>
											<div className='flex items-center justify-start'>
												{getWeekdayName(weekday)}
											</div>
										</td>

										{/* render if oneMealPerDay*/}
										{oneMeal &&
											<td>
												{renderTableContent({
													weekday: weekday as keyof WeekPlan['meals'],
													mealType: 'meal'
												},
													(weekPreview.meals as OneMealADay)[weekday as keyof WeekPlan['meals']]
												)}
											</td>
										}

										{/* render if twoMealsPerDay*/}
										{twoMeals &&
											<td>
												{renderTableContent({
													weekday: weekday as keyof WeekPlan['meals'],
													mealType: 'lunch'
												},
													(weekPreview.meals as TwoMealsADay)[weekday as keyof WeekPlan['meals']].lunch
												)}
											</td>
										}
										{twoMeals &&
											<td>
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
			}
		</>
	)
}

