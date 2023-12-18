import React, { ReactNode } from 'react'

type ButtonProps = {
	children: ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
	return (
		<div>Button</div>
	)
}
