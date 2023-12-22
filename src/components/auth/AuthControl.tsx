import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

type AuthControlProps = {
	children: ReactNode
	redirectTo?: string
}

export const AuthControl: React.FC<AuthControlProps> = ({ children, redirectTo = '/sign-in' }) => {
	const { activeUser } = useAuthContext()

	return (
		activeUser
			? <>{children}</>
			: <Navigate to={redirectTo} />
	)
}
