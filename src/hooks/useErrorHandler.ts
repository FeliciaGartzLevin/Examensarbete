import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

export const useErrorHandler = () => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const resetError = () => {
		setErrorMsg(null)
	}

	const setLoadingStatus = (status: boolean) => {
		setLoading(status)
	}

	const handleError = (error: unknown) => {

		if (error instanceof FirebaseError) {
			//handling different types of Firebase error codes
			if (error.code === 'auth/email-already-in-use') {
				setErrorMsg("This email is already in use. Go to 'sign in' or choose another email.")

			} else if (error.code === 'auth/invalid-credential') {
				setErrorMsg('Wrong email or password')

			} else if (error.code === 'auth/too-many-requests') {
				setErrorMsg('Too many requests. Wait a moment and try again.')

			} else if (error.code === 'auth/requires-recent-login') {
				setErrorMsg('You must sign in again in order to update your settings.')
			} else {
				setErrorMsg(error.code)
			}

		} else {
			setErrorMsg('An unknown error occurred. Please try again.')
		}

	}

	return {
		errorMsg,
		handleError,
		resetError,
		loading,
		setLoadingStatus
	}
}
