import React, { ReactNode } from 'react'

type ContentContainerProps = {
	children: ReactNode
	className?: string
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ children, className }) => {
	return (
		<div className="text-center h-full lg:px-20 px-2 md:px-8 py-6">
			<div className={'bg-light-background py-6 px-6 md:px-12 rounded-md flex flex-col items-center ' + className}>
				{children}
			</div>
		</div>
	)
}
