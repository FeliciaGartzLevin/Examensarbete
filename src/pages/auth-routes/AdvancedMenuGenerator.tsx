import { useParams } from 'react-router-dom'
import { ContentContainer } from '../../components/generic-utilities/ContentContainer'
import { Divider } from '../../components/generic-utilities/Divider'
import { GenerateTable } from '../../components/table/GenerateTable'
import { useState } from 'react'

export const AdvancedMenuGenerator = () => {
	const [showInfo, setShowInfo] = useState<boolean>(true)
	const { week: displayedWeek, year: displayedYear } = useParams()

	return (
		<ContentContainer className='pb-16 pt-12'>
			{/* <AdvancedMenuGenerator /> */}
			<section className='max-w-[80%] '>
				<h2 className='h2'>
					Generate mealplan with advanced alternatives
				</h2>
				<p className='text-xs text-gray-500'>
					{`for week ${displayedWeek} year ${displayedYear}`}
				</p>
				<Divider symbol='bowl' className='py-6' />
			</section>

			<section className='text-left max-w-[80%] lg:max-w-[50%] mb-6 flex justify-center items-center text-gray-500 gap-3'>
				<button
					onClick={() => setShowInfo(!showInfo)}
					className='text-xl px-4 py-2 flex items-center justify-center rounded-full border-2 border-gray-500'>
					?
				</button>
				{showInfo &&
					<div className='text-sm'>
						<p>
							Click a pen in the weekly menu to
							decide in advance which specific meal you want
							in that slot or from which category you want it
							generated. Click on the red cross
							to remove meals from a day or a slot completely.
							If no meal or category is chosen it will be genereted randomly.
						</p>
					</div>
				}
			</section>

			<section>
				<GenerateTable />
			</section>

		</ContentContainer>

	)
}
