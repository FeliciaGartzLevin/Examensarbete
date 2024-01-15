import { useParams } from 'react-router-dom'
import { ContentContainer } from '../../components/generic-utilities/ContentContainer'
import { Divider } from '../../components/generic-utilities/Divider'
import { GenerateTable } from '../../components/table/GenerateTable'
import { useState } from 'react'
import { FaQuestion } from 'react-icons/fa6'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { RiRestaurantLine } from 'react-icons/ri'

export const AdvancedMenuGenerator = () => {
	const [showInfo, setShowInfo] = useState<boolean>(false)
	const { week: displayedWeek, year: displayedYear } = useParams()


	return (
		<ContentContainer className='pb-16 pt-12'>
			<div className='max-w-[94%] flex flex-col gap-6 justify-center items-center'>

				<section>
					<h2 className='h2'>
						Generate mealplan with advanced alternatives
					</h2>
					<p className='text-xs text-gray-500'>
						{`for week ${displayedWeek} of ${displayedYear}`}
					</p>
					<Divider symbol='bowl' className='pt-6 pb-4' />
				</section>

				<section className={'lg:max-w-[50%] flex flex-col justify-center items-center text-gray-500 gap-3'}>
					<button
						onClick={() => setShowInfo(!showInfo)}
						className='px-3 py-1 flex items-center justify-center rounded-full border-2 border-gray-500'>
						?
					</button>
					{showInfo &&
						<div className='text-sm '>
							<p className='text-left mb-1'>
								Click a pen in the weekly menu to
								decide which specific meal you want
								in that slot or from which category you want it
								generated. Click on the red cross
								to remove meals from a slot completely.
								If no meal or category is chosen
								it will be genereted randomly
								outgoing from your preference settings.
							</p>

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
					}
				</section>

				<section>
					<GenerateTable />
				</section>


			</div>

		</ContentContainer>

	)
}
