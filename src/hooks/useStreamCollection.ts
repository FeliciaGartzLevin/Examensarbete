import { FirebaseError } from 'firebase/app'
import { CollectionReference, QueryConstraint, onSnapshot, query } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useStreamCollection = <T>(
	colRef: CollectionReference<T>,
	...queryConstraints: QueryConstraint[]
) => {
	const [data, setData] = useState<T[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isError, setIsError] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const getCollection = useCallback(() => {
		const queryRef = query(colRef, ...queryConstraints)

		const unsubscribe = onSnapshot(
			queryRef,
			(snapshot) => {
				const data: T[] = snapshot.docs.map((doc) => {
					return {
						...doc.data(),
						_id: doc.id
					}
				})

				setData(data)
				setIsLoading(false)
			},
			(error) => {
				if (error instanceof FirebaseError) {
					setError(error.message)
				} else {
					setError("Something went wrong when fetching data")
				}
				setIsError(true)
				setIsLoading(false)
			}
		)

		return unsubscribe
	}, [colRef, queryConstraints])

	useEffect(() => {
		getCollection()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return {
		data,
		error,
		getCollection,
		isError,
		isLoading
	}
}

export default useStreamCollection
