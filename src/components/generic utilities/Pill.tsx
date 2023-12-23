import React, { ReactNode } from 'react'

type PillProps = {
	children: ReactNode
	py?: 'py-1' | 'py-2' // padding y
	isActive: boolean
	onClick: () => void
}

export const Pill: React.FC<PillProps> = ({ children, onClick, py = 'py-2', isActive }) => {

	return (
		<button
			type='button'
			onClick={onClick}
			className={'px-3 min-w-[2.5rem] border-black rounded-xl ' + py + (isActive ? ' border-2 bg-gray-300' : ' border')}
		>
			<p className='font-medium'>
				{children}
			</p>
		</button>
	)
}
