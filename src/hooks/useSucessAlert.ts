import { useEffect, useState } from "react"

export const useSuccessAlert = (sec: number = 5000) => {
	const [success, setSuccess] = useState<boolean>(false)

	const setSuccessState = (status: boolean) => {
		setSuccess(status)
	}

	useEffect(() => {
		if (!success) { return }

		// hide the success alert after 5 secs
		const timeoutId = setTimeout(() => {
			setSuccess(false)
		}, sec)

		// Clear the timeout when the component unmounts
		return () => clearTimeout(timeoutId)

	}, [success, sec])

	return {
		success,
		setSuccessState
	}

}
