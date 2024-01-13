import { useParams } from 'react-router-dom'
import { ContentContainer } from '../../components/generic-utilities/ContentContainer'
import { Divider } from '../../components/generic-utilities/Divider'
import { GenerateTable } from '../../components/table/GenerateTable'
import { useState } from 'react'

export const AdvancedMenuGenerator = () => {
	const [showInfo, setShowInfo] = useState<boolean>(false)
	const { week: displayedWeek, year: displayedYear } = useParams()

	return (
		<ContentContainer className='pb-16 pt-12 gap-6'>
			{/* <AdvancedMenuGenerator /> */}
			<section className='max-w-[80%] '>
				<h2 className='h2'>
					Generate mealplan with advanced alternatives
				</h2>
				<p className='text-xs text-gray-500'>
					{`for week ${displayedWeek} of ${displayedYear}`}
				</p>
				<Divider symbol='bowl' className='pt-6 pb-4' />
			</section>

			<section className={'text-left text-center max-w-[80%] lg:max-w-[50%] flex flex-col justify-center items-center text-gray-500 gap-3 '}>
				<button
					onClick={() => setShowInfo(!showInfo)}
					className='text-l px-3 py-1 flex items-center justify-center rounded-full border-2 border-gray-500'>
					?
				</button>
				{showInfo &&
					<div className='text-sm '>
						<p className='text-left'>
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
