import React, { ReactNode } from 'react'
import { clsx } from 'clsx';

type ButtonProps = {
	children: ReactNode
	onClick?: () => void
	type?: 'button' | 'submit'
	disabled?: boolean
	style?: 'fill' | 'ring'
	color?: 'green' | 'red' | 'neutral'
	className?: string
	title?: string
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick, type = 'button',
	disabled = false,
	style = 'fill',
	color = 'green',
	className,
	title
}) => {

	const buttonColorClasses = {
		'text-white': style === 'fill',
		'text-black bg-transparent border-2': style === 'ring',
		'bg-button-green hover:bg-button-green-hover': color === 'green',
		'bg-button-red hover:bg-button-red-hover': color === 'red',
		'bg-button-neutral hover:bg-button-neutral-hover': color === 'neutral',
		'border-button-green': color === 'green' && style === 'ring',
		'border-button-red': color === 'red' && style === 'ring',
		'border-button-neutral': color === 'neutral' && style === 'ring',
	};


	return (
		<button
			title={title}
			disabled={disabled}
			type={type}
			onClick={onClick}
			className={clsx(
				'hover:border-transparent hover:text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-lg',
				buttonColorClasses,
				className
			)}>
			{children}
		</button >
	)
}
