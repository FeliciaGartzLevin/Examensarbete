import React from 'react'
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

type PaginationProps = {
	header: string
	onClickBack: () => void
	onClickForward: () => void
}

export const Pagination: React.FC<PaginationProps> = ({ header, onClickBack, onClickForward }) => {
	return (
		<div className='flex justify-between w-[80%] lg:w-[60%] xl:w-[40%]'>
			<button
				type='button'
				title='back'
				onClick={onClickBack}
			>
				<FaArrowLeftLong size={23} />
			</button>
			<p>{header}</p>
			<button
				type='button'
				title='forward'
				onClick={onClickForward}
			>
				<FaArrowRightLong size={23} />
			</button>
		</div>
	)
}

