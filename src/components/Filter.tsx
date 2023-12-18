import React, { ReactNode } from 'react'

type FilterProps = {
	children: ReactNode
}

export const Filter: React.FC<FilterProps> = ({ children }) => {
	return (
		<div>Filter</div>
	)
}

