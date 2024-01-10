import React from 'react'
import { PiBowlFoodDuotone } from 'react-icons/pi'
import { Link } from 'react-router-dom'

type LogoProps = {
	text?: boolean
	link?: boolean
}

export const Logo: React.FC<LogoProps> = ({ text, link }) => {

	const Content = () => {
		return (
			<h1 className='flex justify-between items-center gap-2'>
				<div className='bg-white rounded-full p-2'>
					<PiBowlFoodDuotone
						size={40}
						alt='Meal Plan Helper logo'
					/>
				</div>
				{text &&
					<p className='hidden md:block'>
						Meal Plan Helper
					</p>
				}
			</h1>

		)
	}


	return (link
		? (
			<Link to="/">
				<Content />
			</Link>
		)
		: <Content />
	)

}

export default Logo
