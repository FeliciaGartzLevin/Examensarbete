import React from 'react'
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

type PaginationProps = {
	week: number
	onClickBack?: React.MouseEventHandler<HTMLButtonElement> | undefined
	onClickForward?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const Pagination: React.FC<PaginationProps> = ({ week, onClickBack, onClickForward }) => {
	return (
		<div className='flex justify-between w-[80%] lg:w-[60%] xl:w-[40%]'>
			<button
				type='button'
				title='back'
				onClick={onClickBack}
			>
				<FaArrowLeftLong size={23} />
			</button>
			<p>Week {week}</p>
			<button
				type='button'
				title='back'
				onClick={onClickForward}
			>
				<FaArrowRightLong size={23} />
			</button>
		</div>
	)
}

