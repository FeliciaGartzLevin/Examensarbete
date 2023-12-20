import React, { ReactNode } from 'react'

type ButtonProps = {
	children: ReactNode
	onClick?: () => void
	type?: 'button' | 'submit'
	disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {

	return (
		<button disabled={disabled} type={type} onClick={onClick} className="bg-button-bg hover:bg-link-hover text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
			{children}
		</button>
	)
}
