import React, { useRef, useState } from 'react'
import { useStreamMealById } from '../../hooks/useStreamMealById'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { SmallLoadingSpinner } from '../generic utilities/SmallLoadingSpinner'
import { IoWarningOutline } from "react-icons/io5";
import { Alert } from '../generic utilities/Alert';
import { useCloseOnClickOutside } from '../../hooks/useCloseOnClickOutside';

type CellProps = {
	mealId: string | null
}

export const Cell: React.FC<CellProps> = ({ mealId }) => {
	const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
	const {
		data: mealDoc,
		isLoading: isLoadingMealDoc,
		isError: isErrorMealDoc,
		error: mealDocError,

	} = useStreamMealById(mealId)
	const alertRef = useRef<HTMLDivElement | null>(null)
	// makes the error alert close when clicking outside it
	useCloseOnClickOutside(alertRef, () => setShowErrorAlert(false))

	if (isLoadingMealDoc) {
		return (
			<div className='flex justify-center'>
				<SmallLoadingSpinner />
			</div>
		)
	}

	if (isErrorMealDoc) {
		return (
			<div className='flex justify-center relative'>
				<IoWarningOutline size={30} color="text-alert-red" onClick={() => setShowErrorAlert(!showErrorAlert)} />
				{showErrorAlert &&
					<div ref={alertRef as React.LegacyRef<HTMLDivElement>} className='absolute z-20 translate-y-[20%]'>
						<Alert
							color="red"
							header={'Error'}
							body={mealDocError || 'An error occured'}
						/>
					</div>

				}
			</div>
		)
	}

	return (
		<p>
			{mealDoc?.length
				? mealDoc[0].name
				: <LuUtensilsCrossed size={30} />
			}
		</p>
	)
}

