import React, { ReactNode } from 'react'

type AuthControlProps = {
	children: ReactNode
}

export const AuthControl: React.FC<AuthControlProps> = ({ children }) => {
	return (
		<div>AuthControl</div>
	)
}
