import { doc, setDoc } from "firebase/firestore"
import { mealsCol, usersCol } from "../services/firebase"
import { useAuthContext } from "./useAuthContext"
import { UserPreferences } from "../types/User.types"
import { useErrorHandler } from "./useErrorHandler"
import { CreateMealSchema } from "../schemas/MealSchemas"
import { v4 } from 'uuid'
import { useUploadImage } from "./useUploadImage"
import { useState } from "react"

export const useFirebaseUpdates = () => {
	const { activeUser } = useAuthContext()
	const [imageUrl, setImageUrl] = useState<string | null | undefined>(null)
	const { errorMsg, resetError, handleError, loading, setLoadingStatus } = useErrorHandler()
	const {
		errorMsg: imageUploadError,
		isSuccess,
		isUploading,
		progress,
		uploadImage,
	} = useUploadImage()

	const uploadAndGetImageUrl = async (image: File | null) => {
		if (image) {
			console.log('image exists, about to upload it')
			// if image exists, uploading it to Firebase Storage

			try {
				const url = await uploadImage(image)
				console.log('Upload to storage done. URL:', url);

				return url
			} catch (error) {
				handleError(error)
			}
		}

	}

	const createNewMeal = async (data: CreateMealSchema, starRating: number | null, image: File | null) => {
		if (!activeUser) { throw new Error("No active user") }

		// create uuid
		const _id = v4()

		// creating a new document reference with a uuid in 'meals' collection in firebase db
		const docRef = doc(mealsCol, _id)

		// let imageUrl: string | null | undefined = null
		const url = await uploadAndGetImageUrl(image)
		console.log('imageUrl after uploadAndGetImageUrl(image)', url)

		// setting the document with data from the user
		return setDoc(docRef, {
			...data,
			_id,
			owner: activeUser.uid, // userId of the creator
			rating: starRating,
			imageUrl: url ?? null,
		})
	}

	const updateUserPreferences = (choice: UserPreferences[keyof UserPreferences], preference: keyof UserPreferences) => {
		if (!activeUser) { throw new Error("No active user") }

		const docRef = doc(usersCol, activeUser.uid)

		// updating the Firebase db
		return setDoc(docRef, {
			preferences: {
				[preference]: choice,
			}
		}, { merge: true })
	}

	const updateFirebaseDb = async (options: UserPreferences[keyof UserPreferences], preference: keyof UserPreferences) => {
		resetError()

		try {
			setLoadingStatus(true)

			// logic for updating preferences in the db
			await updateUserPreferences(options, preference)

		} catch (error) {
			handleError(error)

		} finally {
			setLoadingStatus(false)
		}
	}

	return {
		updateUserPreferences,
		updateFirebaseDb,
		errorMsg,
		resetError,
		handleError,
		loading,
		setLoadingStatus,

		createNewMeal,
		imageUploadError,
		isSuccess,
		isUploading,
		progress,
		uploadImage,
	}
}


