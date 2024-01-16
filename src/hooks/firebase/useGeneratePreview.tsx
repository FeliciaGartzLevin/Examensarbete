import { useNavigate } from "react-router-dom"
import { WeekPlan } from "../../types/WeekPlan.types"
import { useErrorHandler } from "../useErrorHandler"
import { useFirebaseUpdates } from "./useFirebaseUpdates"
import { deleteFirebaseDoc, previewsCol } from "../../services/firebase"
import { UserDoc } from "../../types/User.types"

export const useGeneratePreview = (action: 'generate' | 'edit') => {
	const { errorMsg, handleError, resetError, loading, setLoadingStatus } = useErrorHandler()
	const { getPreview, createNewWeekPreview, copyWeekIntoPreview } = useFirebaseUpdates()
	const navigate = useNavigate()

	const generatePreview = async (userDoc: UserDoc, displayedWeek: number, displayedYear: number, previewOrWeekPlan?: WeekPlan) => {
		try {
			resetError()
			setLoadingStatus(true)

			// checking if preview exist for displayedWeek and year
			const preview = await getPreview(displayedWeek, displayedYear)

			// if preview exists
			if (preview.length) {

				// if preview exists, check if the user preferences are same like the current user preferences settings
				if (preview[0].userPreferences.mealsPerDay === userDoc.preferences.mealsPerDay
					&& preview[0].userPreferences.generateFrom === userDoc.preferences.generateFrom
					&& preview[0].userPreferences.foodPreferences.every((preference, index) => preference === userDoc.preferences.foodPreferences[index])
				) {
					// if so, navigate to mealPlan
					return navigate(`/${action}/week/${displayedWeek}/year/${displayedYear}/previewId/${preview[0]._id}`)

				} else {
					//  if else delete it in order to generate a new preview that applies to current user preferences
					await deleteFirebaseDoc(previewsCol, preview[0]._id)
				}
			}

			if (action === 'generate') {
				//if preview doesn't exist
				// create a new preview and then navigate to it's page
				const newPreviewId = await createNewWeekPreview(userDoc.preferences, displayedWeek, displayedYear)

				if (!newPreviewId) { throw new Error("New week preview couldn't be created") }
				navigate(`/generate/week/${displayedWeek}/year/${displayedYear}/previewId/${newPreviewId}`)

			} else if (action === 'edit') {

				await copyWeekIntoPreview(previewOrWeekPlan!)

				navigate(`/edit/week/${displayedWeek}/year/${displayedYear}/previewId/${previewOrWeekPlan!._id}`)

			}

			setLoadingStatus(false)

		} catch (error) {
			handleError(error)
		}

	}

	return {
		generatePreview,
		errorMsg,
		loading,
	}
}

