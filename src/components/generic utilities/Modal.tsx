import React, { ReactNode } from 'react'

type ModalProps = {
	children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
	return (
		<div>Modal</div>
	)
}
