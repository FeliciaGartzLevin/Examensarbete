import React, { ReactNode } from 'react'

type CommentsProps = {
	children: ReactNode
}

export const Comments: React.FC<CommentsProps> = ({ children }) => {
	return (
		<div>Comments</div>
	)
}

