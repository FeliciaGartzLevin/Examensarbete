import React, { ReactNode } from 'react'

type PillProps = {
	children: ReactNode
}

export const Pill: React.FC<PillProps> = ({ children }) => {
	return (
		<div>Pill</div>
	)
}
