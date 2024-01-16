import { useState } from 'react'
import { Meal } from '../../types/Meal.types'
import { GenericTable } from '../../components/table/GenericTable'
import { LunchAndDinner, OneMealADay, TwoMealsADay } from '../../types/WeekPlan.types'
import { ClickedBtnType } from '../../components/table/GenerateTable'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { LoadingSpinner } from '../../components/generic-utilities/LoadingSpinner'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { Alert } from '../../components/generic-utilities/Alert'
import { useQuery } from '@tanstack/react-query'
import { generateMealsQueries } from '../../helpers/generating-weekPlan'
import { deleteFirebaseDoc, fetchFirebaseDocs, mealsCol, previewsCol, weeksCol } from '../../services/firebase'
import { useAuthContext } from '../../hooks/useAuthContext'
import { GenerateChoiceModal } from '../../components/GenerateChoiceModal'
import { useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useStreamUserDoc } from '../../hooks/firebase/useStreamUserDoc'
import { FaCheck } from 'react-icons/fa6'
import { ImCross } from 'react-icons/im'
import { ContentContainer } from '../../components/generic-utilities/ContentContainer'
import { PageInfo } from '../../components/generic-utilities/PageInfo'
import { Button } from '../../components/generic-utilities/Button'
import { Modal } from '../../components/generic-utilities/Modal'


export const EditWeek = () => {
	const { week, year, previewId } = useParams()
	const displayedWeek = Number(week)
	const displayedYear = Number(year)
	const { activeUser } = useAuthContext()
	if (!activeUser) { throw new Error('No active user') }
	const [showEditModal, setShowEditModal] = useState<boolean>(false)
	const [clickedModal, setClickedModal] = useState<ClickedBtnType | null>(null)
	const { windowWidth, windowSizeisLoading } = useWindowSize()
	const [showInfo, setShowInfo] = useState<boolean>(false)
	const [areUSure, setAreUSure] = useState<boolean>(true)
	const { getPreview, addPreviewToWeek, updatePreview } = useFirebaseUpdates()
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
	const weekPreview = weekPreviews && weekPreviews[0]


	/**
	 * Functions for the table
	 *
	 */
	const handleEditClick = (object: ClickedBtnType) => {
		setShowEditModal(true)
		setClickedModal(object)
	}

	const handleDeleteClick = async (object: ClickedBtnType) => {
		try {
			setLoadingStatus(true)
			if (!weekPreviews) { throw new Error('No week preview found') }

			const updatedWeekPreview = { ...weekPreviews[0] }

			if (updatedWeekPreview.userPreferences.mealsPerDay === 1) {
				const meals = updatedWeekPreview.meals as OneMealADay;
				meals[object.weekday] = 'noMeal'
			} else {
				const meals = updatedWeekPreview.meals as TwoMealsADay;
				const mealDay = meals[object.weekday] as LunchAndDinner;

				if (object.mealType === 'lunch') {
					mealDay.lunch = 'noMeal'
				} else if (object.mealType === 'dinner') {
					mealDay.dinner = 'noMeal'
				}
			}

			await updatePreview(updatedWeekPreview)
			await refetchWeekPreview()
			setLoadingStatus(false)
		} catch (error) {
			handleError(error)
		}
	}

	if (windowSizeisLoading || isLoadingUserDocs || isLoadingMealsDocs || isLoadingWeekPreviews) {
		return <LoadingSpinner />
	}


	const hideFn = () => {
		setShowEditModal(false)
		setClickedModal(null)
	}

	const handleClickSave = async () => {
		resetError()
		setLoadingStatus(true)
		try {
			const preview = await getPreview(displayedWeek, displayedYear, previewId)
			if (!preview) { throw new Error('No preview to add could be found') }
			if (!mealDocs) { throw new Error("Meals couldn't be found") }

			// adding the edited preview to weekplans collection
			await addPreviewToWeek(preview[0])

			// delete preview
			await deleteFirebaseDoc(previewsCol, preview[0]._id)

			// navigate to landing for displayedweek, to see the updated weekplan
			navigate(`/?week=${displayedWeek}&year=${displayedYear}`)

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}
	}

	const handleCancelEditing = async () => {
		resetError()
		setLoadingStatus(true)
		try {
			if (!previewId) { throw new Error('No preview found') }

			// delete preview
			await deleteFirebaseDoc(previewsCol, previewId)

			navigate(`/?week=${displayedWeek}&year=${displayedYear}`)

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}

	}

	const deleteWeekPlan = async () => {
		resetError()
		setLoadingStatus(true)
		try {
			if (!previewId) { throw new Error('No preview found') }

			await deleteFirebaseDoc(weeksCol, previewId)

			await deleteFirebaseDoc(previewsCol, previewId)

			navigate(`/?week=${displayedWeek}&year=${displayedYear}`)

			// refetch weekplans here somehow - send state?

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}

	}

	return (
		<ContentContainer className="gap-6 px-12 md:px-20">

			<h2 className="h2">Edit weekly meal plan</h2>

			<PageInfo
				onClick={() => setShowInfo(!showInfo)}
				showInfo={showInfo}
			>
				<p className='text-left mb-1'>
					Click a pen in the weekly menu to
					decide which specific meal you want
					in that slot or from which category you want it
					generated. Click on the red cross
					to remove meals from a slot completely.
					If no meal or category is chosen
					it will be genereted randomly
					outgoing from your preference settings.
				</p>
			</PageInfo>

			<p>week {displayedWeek} of {displayedYear}</p>

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

			{/* Delete confirmation modal */}
			{areUSure &&
				<Modal hide={() => setAreUSure(false)}>
					<div className='flex flex-col gap-6'>
						<h2 className='h2'>Delete entire weekplan</h2>
						<section>
							<p>Are you sure?</p>
							<p>This can't be regretted</p>
						</section>

						<div className='w-full justify-center items-center flex gap-4'>
							<Button
								onClick={() => setAreUSure(false)}
								title='Cancel the deletion'
								color='red'
								style='ring'>
								Cancel
							</Button>
							<Button
								onClick={deleteWeekPlan}
								title="Delete weekplan"
								color='red'>
								Delete
							</Button>
						</div>
					</div>

				</Modal>
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
					<section className="flex justify-center gap-3">

						<button
							onClick={handleClickSave}
							type='button'
							disabled={loading}
							title={'Save changes'}
							className='text-green-800 hover:bg-button-green-hover hover:text-white border border-black rounded-md p-2'
						>
							<FaCheck size={20} />
						</button>

						<button
							onClick={handleCancelEditing}
							title='Cancel editing'
							className='text-button-red text-lg hover:bg-button-red hover:text-white border border-black rounded-md p-2'>
							<ImCross />
						</button>

					</section>

					<GenericTable
						editTable={true}
						weekOrPreviewDoc={weekPreviews[0]}
						mealDocs={mealDocs}
						oneMeal={oneMeal}
						handleDeleteClick={handleDeleteClick}
						handleEditClick={handleEditClick}
					/>

					<div className='mt-6 mb-4'>
						<Button
							color='red'
							onClick={() => setAreUSure(true)}
							disabled={loading}
						>
							Delete entire mealplan
						</Button>

					</div>
				</>
			}
		</ContentContainer>
	)
}
