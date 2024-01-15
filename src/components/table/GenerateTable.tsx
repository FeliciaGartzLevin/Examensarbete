import { useCallback, useEffect, useState } from 'react'
import { LunchAndDinner, OneMealADay, TwoMealsADay, WeekPlan } from '../../types/WeekPlan.types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { Alert } from '../generic-utilities/Alert'
import { useQuery } from '@tanstack/react-query'
import { deleteFirebaseDoc, fetchFirebaseDocs, mealsCol, previewsCol } from '../../services/firebase'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Meal } from '../../types/Meal.types'
import { GenerateChoiceModal } from '../GenerateChoiceModal'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { generateMealsQueries } from '../../helpers/generating-weekPlan'
import { useStreamUserDoc } from '../../hooks/firebase/useStreamUserDoc'
import { Button } from '../generic-utilities/Button'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { generateRandomForNullValues, getMealIds } from '../../helpers/restructure-object'
import { shuffle } from 'lodash'
import { GenericTable } from './GenericTable'

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
	const [clickedModal, setClickedModal] = useState<ClickedBtnType | null>(null)
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const [mealAmountEnough, setMealAmoutEnough] = useState<boolean>(true)
	const [redirect, setRedirect] = useState<boolean>(false)
	const { getPreview, createNewWeekPreview, addPreviewToWeek, updatePreview } = useFirebaseUpdates()
	const navigate = useNavigate()
	const {
		errorMsg,
		handleError,
		resetError,
		loading,
		setLoadingStatus
	} = useErrorHandler()

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
			generateMealsQueries(userDocs![0].preferences, activeUser.uid)
		),
		enabled: !!userDocs,
		staleTime: 1 * 1000 // 1sec
	})

	const {
		data: weekPreviews,
		isLoading: isLoadingWeekPreviews,
		isError: isErrorWeekPreviews,
		error: weekPreviewsError,
		refetch: refetchWeekPreview,
	} = useQuery({
		queryKey: ["Week preview", { week: displayedWeek, year: displayedYear, previewId }],
		queryFn: () => getPreview(displayedWeek, displayedYear, previewId),
		enabled: !!previewId && !!displayedWeek && !!displayedYear && !!mealDocs,
		staleTime: 1 * 1000 // 1sec
	})

	const oneMeal = userDocs && userDocs[0].preferences?.mealsPerDay === 1
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
	 * Functions for the table
	 *
	 */
	const handleEditClick = (object: ClickedBtnType) => {
		setShowEditModal(true)
		setClickedModal(object)
	}

	const handleDeleteClick = useCallback(async (object: ClickedBtnType) => {
		try {
			setLoadingStatus(true)
			if (!weekPreviews) { throw new Error('No week preview found') }

			const updatedWeekPreview = { ...weekPreviews[0] }

			if (updatedWeekPreview.userPreferences.mealsPerDay === 1) {
				const meals = updatedWeekPreview.meals as OneMealADay;
				meals[object.weekday] = null
			} else {
				const meals = updatedWeekPreview.meals as TwoMealsADay;
				const mealDay = meals[object.weekday] as LunchAndDinner;

				if (object.mealType === 'lunch') {
					mealDay.lunch = null
				} else if (object.mealType === 'dinner') {
					mealDay.dinner = null
				}
			}

			await updatePreview(updatedWeekPreview)
			await refetchWeekPreview()
			setLoadingStatus(false)
		} catch (error) {
			handleError(error)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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

	const hideFn = () => {
		setShowEditModal(false)
		setClickedModal(null)
	}

	const handleGenerateClick = async () => {
		resetError()
		setLoadingStatus(true)
		try {
			const preview = await getPreview(Number(displayedWeek), Number(displayedYear), previewId)
			if (!preview) { throw new Error('No preview to add could be found') }
			if (!mealDocs) { throw new Error("Meals couldn't be found") }

			// getting the meals that are not already used
			const mealIdArray = getMealIds(preview[0], preview[0].userPreferences.mealsPerDay === 1)
			const notUsedMeals = mealDocs?.filter(meal => !mealIdArray.includes(meal._id))

			// shuffling them and replacing null values with meal-ids
			const shuffledNotUsedMeals = shuffle([...notUsedMeals])
			const previewWithReplacedNullValues = generateRandomForNullValues(preview[0], shuffledNotUsedMeals)

			// adding the completed generated preview to weekplans collection
			await addPreviewToWeek(previewWithReplacedNullValues)

			// delete preview
			await deleteFirebaseDoc(previewsCol, preview[0]._id)

			// navigate to landing for displayedweek, to see the new weekplan
			navigate(`/?week=${displayedWeek}&year=${displayedYear}`)

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}
	}

	return (
		<>

			{/* Modal for choosing */}
			{showEditModal && clickedModal && mealDocs && weekPreview &&
				<GenerateChoiceModal
					hide={hideFn}
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

			{isErrorWeekPreviews &&
				<div className=' w-full h-full flex justify-center items-center mb-3'>
					<Alert color='red' header={weekPreviewsError.name || "Error"} body={weekPreviewsError.message || "An error occured fetching meals"} />
				</div>
			}

			{errorMsg &&
				<div className=' w-full h-full flex justify-center items-center mb-3'>
					<Alert color='red' header={errorMsg || "Error"} body={errorMsg || "An error occured fetching meals"} />
				</div>
			}


			{weekPreviews &&
				<>
					<GenericTable
						editTable={true}
						weekOrPreviewDoc={weekPreviews[0]}
						mealDocs={mealDocs}
						oneMeal={oneMeal}
						handleDeleteClick={handleDeleteClick}
						handleEditClick={handleEditClick}
					/>

					{previewId &&
						<div className='mt-6 mb-4'>
							<Button
								onClick={handleGenerateClick}
								disabled={loading}
							>
								Generate mealplan
							</Button>

						</div>
					}
				</>
			}
		</>
	)
}

