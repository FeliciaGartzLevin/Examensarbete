import { FaQuestion } from 'react-icons/fa6'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { RiRestaurantLine } from 'react-icons/ri'


export const SymbolsExplanation = () => {
	return (
		<div>
			<p>
				<span className='inline-flex text-black'>
					<FaQuestion size={18} />
				</span>{' '}
				= no choice
			</p>
			<p>
				<span className='inline-flex text-black'>
					<RiRestaurantLine size={18} />
				</span>{' '}
				= eating out
			</p>
			<p>
				<span className='inline-flex text-black'>
					<LuUtensilsCrossed size={18} />
				</span>{' '}
				= no meal

			</p>
		</div>
	)
}

