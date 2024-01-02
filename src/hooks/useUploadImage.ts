import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from 'react'
import { v4 } from 'uuid'
import { storage } from '../services/firebase'
import { useErrorHandler } from './useErrorHandler'

export const useUploadImage = () => {
	const {
		errorMsg: imageUploadErrorMsg,
		handleError,
		resetError,
		loading: isUploadingImage,
		setLoadingStatus: setIsUploadingImage
	} = useErrorHandler()
	const [imageUploadIssSuccess, setImageUploadIssSuccess] = useState<boolean | null>(null)

	const uploadImage = async (image: File) => {
		// reset states
		resetError()
		setImageUploadIssSuccess(null)
		setIsUploadingImage(true)

		try {
			// generate a uuid for the file
			const uuid = v4()

			// find file extension
			const fileExtension = image.name.substring(image.name.lastIndexOf(".") + 1)

			// construct filename to save image as
			const storageFilename = `${uuid}.${fileExtension}`

			// create reference to the file in storage
			const storageRef = ref(storage, `meal-images/${storageFilename}`)

			// start upload of image
			const uploadTask = uploadBytesResumable(storageRef, image)

			// wait for upload to complete
			await uploadTask.then()
			const url = await getDownloadURL(storageRef)

			setImageUploadIssSuccess(true)
			setIsUploadingImage(false)

			return url
		} catch (error) {
			handleError(error)

		} finally {
			setIsUploadingImage(false)
		}
	}

	return {
		imageUploadErrorMsg,
		imageUploadIssSuccess,
		isUploadingImage,
		uploadImage,
	}
}

