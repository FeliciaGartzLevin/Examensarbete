import PlaceHolder from '../assets/img/square-placeholder.jpg'

import { useAuthContext } from "../hooks/useAuthContext"

export const UserImgAndName = () => {
	const { activeUser } = useAuthContext()

	return (
		<div className="flex flex-col items-center justify-center gap-3 mb-3">

			<img
				className="rounded-full object-scale-down h-[3.5rem] w-[3.5rem] border-2 border-black"
				src={activeUser?.photoURL ?? PlaceHolder}
				alt={'Profile picture for ' + activeUser?.displayName}
			/>
			{activeUser?.displayName && <p className='font-semibold'>{activeUser?.displayName}</p>}
		</div>
	)
}

