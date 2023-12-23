import React, { ReactNode } from 'react'

type AlertProps = {
	header?: string | ReactNode
	body?: string | ReactNode
	className?: string
	color: 'red' | 'green' | 'orange' | 'blackandwhite' | 'none'
}

export const Alert: React.FC<AlertProps> = ({ header, body, color, className }) => {
	let colorClasses = '';

	if (color === 'red') {
		colorClasses = 'border-alert-red bg-alert-lighter-red text-alert-red'

	} else if (color === 'green') {
		colorClasses = 'border-alert-green bg-alert-lighter-green text-alert-green'

	} else if (color === 'orange') {
		colorClasses = 'border-alert-orange bg-alert-lighter-orange text-alert-orange'

	} else if (color === 'blackandwhite') {
		colorClasses = 'border-gray-300 bg-white text-black'
	} else {
		colorClasses = ''

	}

	return (
		<div className={'my-2 text-sm font-semibold p-3 border-2 rounded-lg ' + colorClasses + ' ' + className}>
			{header && <h2 className='mb-2 text-lg font-bold'>{header}</h2>}
			{body && <p>{body}</p>}
		</div>
	)
}

