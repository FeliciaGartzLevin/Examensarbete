import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

export const useErrorHandler = () => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const resetError = () => {
		setErrorMsg(null)
	}

	const handleError = (error: unknown) => {

		if (error instanceof FirebaseError) {
			//handling different types of Firebase error codes
			if (error.code === 'auth/email-already-in-use') {
				setErrorMsg("Email is already in use. Go to 'sign in' or choose another email.")

			} else if (error.code === 'auth/invalid-credential') {
				setErrorMsg('Wrong email or password')

			} else if (error.code === 'auth/too-many-requests') {
				setErrorMsg('Too many requests. Wait a moment and try again.')

			}
			else {
				setErrorMsg(error.code)
			}

		} else {
			setErrorMsg('An unknown error occurred. Please try again.')
		}

	}

	return {
		errorMsg,
		handleError,
		resetError
	}
}