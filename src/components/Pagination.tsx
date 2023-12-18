import React, { ReactNode } from 'react'

type PaginationProps = {
	children: ReactNode
}

export const Pagination: React.FC<PaginationProps> = ({ children }) => {
	return (
		<div>Pagination</div>
	)
}

