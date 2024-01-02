import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from 'react'
import { v4 } from 'uuid'
import { storage } from '../services/firebase'
import { useErrorHandler } from './useErrorHandler'

export const useUploadImage = () => {
	const { errorMsg, handleError, resetError, loading: isUploading, setLoadingStatus: setIsUploading } = useErrorHandler()
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
	const [progress, setProgress] = useState<number | null>(null)
	// const [imageUrl, setImageUrl] = useState<string | null>(null)

	const uploadImage = async (image: File) => {
		// reset states
		resetError()
		setIsSuccess(null)
		setIsUploading(true)
		setProgress(null)

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

			// attach upload observer
			uploadTask.on("state_changed", snapshot => {
				// update progress
				setProgress(
					Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 1000 / 10)
			})/* , async () => {
				try {
					// get download url to uploaded image
					const url = await getDownloadURL(storageRef)
					console.log('Upload to storage successful. URL:', url);

					setImageUrl(url)

				} catch (error) {
					handleError(error)
				}
			} */
			// wait for upload to complete
			await uploadTask.then()
			const url = await getDownloadURL(storageRef)

			setIsSuccess(true)
			setProgress(null)
			return url

		} catch (error) {
			handleError(error)

		} finally {
			setIsUploading(false)
		}
	}

	return {
		errorMsg,
		isSuccess,
		isUploading,
		progress,
		uploadImage,
	}
}

