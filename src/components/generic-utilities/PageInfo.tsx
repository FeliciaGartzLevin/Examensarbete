import React, { ReactNode } from 'react'

type PageInfoProps = {
	onClick: () => void
	showInfo: boolean
	children: ReactNode
}

export const PageInfo: React.FC<PageInfoProps> = ({ onClick, showInfo, children }) => {
	return (
		<section className='lg:max-w-[50%] flex flex-col justify-center items-center text-gray-500 gap-3 px-4'>
			<button
				onClick={onClick}
				className='px-3 py-1 flex items-center justify-center rounded-full border-2 border-gray-500'>
				?
			</button>
			{showInfo &&
				<div className='text-sm '>
					{children}
				</div>
			}
		</section>
	)
}

