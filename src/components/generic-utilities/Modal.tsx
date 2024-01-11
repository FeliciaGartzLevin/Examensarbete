import React, { ReactNode, useRef } from 'react'
import { IoClose } from "react-icons/io5";
import { useCloseOnClickOutside } from '../../hooks/useCloseOnClickOutside';

type ModalProps = {
	children: ReactNode
	hide: () => void
}

export const Modal: React.FC<ModalProps> = ({ children, hide }) => {
	const modalRef = useRef<HTMLDivElement | null>(null)

	useCloseOnClickOutside(modalRef, hide)

	return (
		<div className="absolute top-0 h-full w-full lg:px-20 px-2 md:px-8 py-6 bg-gray-800 bg-opacity-75 flex justify-center">
			<div ref={modalRef as React.LegacyRef<HTMLDivElement>} className='relative top-[10%] max-h-[90%] bg-light-background py-12 px-6 rounded-md flex flex-col items-center min-w-full sm:min-w-[60%] overflow-y-auto no-scrollbar'>

				<button onClick={hide} title='close' type='button' className="absolute text-xs text-gray-500 top-5 right-5">
					<IoClose size={23} />
				</button>

				{children}

			</div>
		</div>
	)
}
