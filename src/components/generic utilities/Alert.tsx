import React from 'react'

type AlertProps = {
	message: string
	color: 'red' | 'green' | 'orange'
}

export const Alert: React.FC<AlertProps> = ({ message, color }) => {
	let colorClasses = '';

	if (color === 'red') {
		colorClasses = 'border-alert-red bg-alert-lighter-red text-alert-red'
	} else if (color === 'green') {
		colorClasses = 'border-alert-green bg-alert-lighter-green text-alert-green'
	} else {
		colorClasses = 'border-alert-orange bg-alert-lighter-orange text-alert-red'
	}

	return (
		<div className={'my-2 text-sm font-semibold p-3 border-2 rounded-lg ' + colorClasses}>
			<p>{message}</p>
		</div>
	)
}

