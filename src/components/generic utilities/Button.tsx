import React, { ReactNode } from 'react'
import { clsx } from 'clsx';

type ButtonProps = {
	children: ReactNode
	onClick?: () => void
	type?: 'button' | 'submit'
	disabled?: boolean
	style?: 'fill' | 'ring'
	color?: 'green' | 'red'
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false, style = 'fill', color = 'green' }) => {

	const buttonColorClasses = {
		'text-white': style === 'fill',
		'text-black': style === 'ring',
		'bg-button-green hover:bg-button-green-hover': color === 'green',
		'bg-button-red hover:bg-button-red-hover': color === 'red',
		'border-button-green border-2 bg-transparent': color === 'green' && style === 'ring',
		'border-button-red border-2 bg-transparent': color === 'red' && style === 'ring',
	};


	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			className={clsx(
				'hover:border-transparent hover:text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline',
				buttonColorClasses
			)}>
			{children}
		</button >
	)
}
