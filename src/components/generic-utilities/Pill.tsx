import React, { ReactNode } from 'react'

type PillProps = {
	children: ReactNode
	py?: 'py-1' | 'py-2' // padding y
	isActive: boolean
	onClick: () => void
	disabled?: boolean
	className?: string
}

export const Pill: React.FC<PillProps> = ({ children, onClick, py = 'py-2', isActive, disabled = false, className }) => {

	return (
		<button
			disabled={disabled}
			type='button'
			onClick={onClick}
			className={'px-3 min-w-[2.5rem] border-black rounded-xl box-border ' + py + (isActive ? ' border-2 bg-button-neutral-soft' : ' border') + ' ' + (className ?? '')}
		>
			<p className='font-medium'>
				{children}
			</p>
		</button>
	)
}
