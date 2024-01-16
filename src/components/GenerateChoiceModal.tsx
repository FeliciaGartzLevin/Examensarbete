import React, { useState } from 'react'
import { Button } from './generic-utilities/Button';
import { RiRestaurantLine } from 'react-icons/ri';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { Link, useParams } from 'react-router-dom';
import { Modal } from './generic-utilities/Modal';
import { Divider } from './generic-utilities/Divider';
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import { ClickedBtnType } from './table/GenerateTable';
import { Meal, categories } from '../types/Meal.types';
import { shuffle } from 'lodash';
import { LunchAndDinner, OneMealADay, TwoMealsADay, WeekPlan } from '../types/WeekPlan.types';
import { useFirebaseUpdates } from '../hooks/firebase/useFirebaseUpdates';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { Alert } from './generic-utilities/Alert';

type GenerateChoiceModalProps = {
	hide: () => void
	clickedModal: ClickedBtnType
	mealDocs: Meal[]
	windowWidth: number | null | undefined
	weekPreview: WeekPlan
	refetchPreview: () => void
}

export type Option = {
	value: string
	label: string
}

export const GenerateChoiceModal: React.FC<GenerateChoiceModalProps> = ({
	clickedModal,
	hide,
	mealDocs,
	windowWidth,
	weekPreview,
	refetchPreview
}) => {
	const { week: displayedWeek, year: displayedYear } = useParams()
	const [selectedMeal, setSelectedMeal] = useState<Option | null>(null)
	const [selectedCategory, setSelectedCategory] = useState<Option | null>(null)
	const [selected, setSelected] = useState<Option | null>(null)
	const [selectedNotFound, setSelectedNotFound] = useState<boolean>(false)
	const [showInfo, setShowInfo] = useState<boolean>(false)
	const [surprise, setSurprise] = useState<boolean>(false)
	const { updatePreview } = useFirebaseUpdates()
	const { errorMsg, handleError, setLoadingStatus, resetError, loading } = useErrorHandler()

	/* options for selects */
	const getFreeSearchOptions = () => {
		const nameArr = mealDocs?.map(meal => {
			return {
				value: meal._id,
				label: meal.name.charAt(0).toUpperCase() + meal.name.slice(1)
			}
		})
		return nameArr as unknown as OptionsOrGroups<string, GroupBase<string>> | undefined
	}

	const freeSearchOptions = getFreeSearchOptions()

	const categoryOptions = (categories as unknown as string[]).map(category => {
		return {
			value: category,
			label: category
		} as unknown as OptionsOrGroups<string, GroupBase<string>>

	})

	/* handle selects */
	const handleSearchSelect = (selectedOption: Option) => {
		setSelectedMeal(selectedOption)
		setSelectedCategory(null)
		setSelected(selectedOption)
		setSurprise(false)
		setSelectedNotFound(false)
	}

	const handleCategorySelect = (selectedOption: Option) => {
		setSelectedNotFound(false)
		setSelectedCategory(selectedOption)
		setSelectedMeal(null)
		setSurprise(false)


		// find meals only with chosen category
		const filteredMeals = mealDocs.filter(meal => meal.category.includes(selectedOption?.label))
		// return if no meal matches the chosen category
		if (!filteredMeals.length) {
			setSelectedNotFound(true)
			setSelected(null)
			return
		}
		// genererate random meal
		const shuffledMeals = shuffle([...filteredMeals])

		setSelected({
			value: shuffledMeals[0]._id,
			label: shuffledMeals[0].name,
		})

		setSelectedNotFound(false)

	}

	const handleSurprise = () => {
		// genererate random meal
		const shuffledMeals = shuffle([...mealDocs])
		setSelected({
			value: shuffledMeals[0]._id,
			label: shuffledMeals[0].name,
		})
		setSurprise(true)
		setSelectedNotFound(false)
		setSelectedCategory(null)
	}

	const handleButtonClick = (value: Option) => {
		setSelected(value)
		setSelectedNotFound(false)
		setSelectedCategory(null)
		setSelectedMeal(null)
		setSurprise(false)

	}

	const getUpdatedMeals = () => {
		let updatedMeals: OneMealADay | TwoMealsADay = { ...weekPreview.meals }

		// for OneMealADay
		if (clickedModal.mealType === 'meal') {
			updatedMeals = {
				...updatedMeals,
				[clickedModal.weekday]: selected?.value || null,
			} as OneMealADay

			// for TwoMealsADay
		} else {
			const mealSlot = updatedMeals[clickedModal.weekday] as LunchAndDinner

			updatedMeals = {
				...updatedMeals,
				[clickedModal.weekday]: {
					lunch: clickedModal.mealType === 'lunch'
						? selected?.value || null
						: mealSlot.lunch || null,
					dinner: clickedModal.mealType === 'dinner'
						? selected?.value || null
						: mealSlot?.dinner,
				} as LunchAndDinner,
			} as TwoMealsADay
		}

		return updatedMeals
	}

	const handleSaveChoice = async () => {

		try {
			resetError()
			setLoadingStatus(true)
			// uppdate weekPreview
			const updatedMeals = getUpdatedMeals()

			const update = {
				...weekPreview,
				meals: updatedMeals
			}

			await updatePreview(update)

			refetchPreview()

			// closing the modal
			hide()

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}
	}

	return (
		<div className='h-full w-full fixed top-0 left-0'>
			<Modal hide={hide}>
				<div className='flex flex-col gap-6 sm:mx-10'>
					<section className='mb-3'>
						<h2 className='h2'>
							Choice
						</h2>
						{clickedModal &&
							<section className='text-sm text-gray-500'>
								<p>
									{`for ${clickedModal?.weekday} ${clickedModal.mealType}`}
								</p>
								<p>
									on week {displayedWeek} of {displayedYear}
								</p>
							</section>
						}
						<Divider symbol="bowl" className='py-6' />
						<p className='text-gray-500'>
							Choose between various options below to help you decide what you want to eat.
						</p>
					</section>

					{errorMsg &&
						<Alert color='red' header="Error" body={"An error occured when trying to save your meal." + errorMsg || ''} />}

					<section className={'py-4 px-2 bg-white md:mx-[20%] rounded-md border-black border justify-center items-center flex flex-col  ' + `${selected || selectedNotFound ? 'block' : 'hidden'}`}>
						{selectedNotFound &&
							<p className='text-gray-500'>
								Meal from that category couldn't be found.
								Try either another method below,{' '}
								<Link to='/settings/preferences' className='font-bold hover:text-link-hover'>
									changing your settings
								</Link>
								{' '}
								or
								{' '}
								<Link to='/settings/preferences' className='font-bold hover:text-link-hover'>
									add more meals
								</Link>
								.
							</p>}

						{selected && <p className='text-gray-500 mb-2'>{selectedCategory || surprise ? 'Randomly picked:' : 'Selected:'}</p>}

						{selected && selected.value === 'eatOut' &&
							<h3 className='h3 inline-flex gap-2'>
								Eating out
								<RiRestaurantLine size={26} />
							</h3>}

						{selected && selected.value === 'noMeal' &&
							<h3 className='h3 inline-flex gap-2'>
								No meal
								<LuUtensilsCrossed size={26} />
							</h3>
						}
						{selected && selectedMeal &&
							<h3 className='selectedMeal h3'>
								{selectedMeal.label}
							</h3>
						}
						{selected && selectedCategory &&
							<h3 className='selectedCategory h3'>
								{selected.label}
							</h3>
						}

						{selected && surprise &&
							<h3 className='surprise h3'>
								{selected.label}
							</h3>
						}

						{selected &&
							<>
								<div>
									<Button
										onClick={handleSaveChoice}
										type="button" color="green"
										style="fill"
										disabled={loading}
									>
										Save choice
									</Button>
								</div>
								<p className='text-xs text-gray-500 mt-3'>
									or choose again
								</p>
							</>
						}

					</section>

					<section>
						<label className="labelStyling" aria-label="freeSearch">
							Choose specific meal
						</label>
						<Select
							styles={{
								control: (baseStyles) => ({
									...baseStyles,
									marginBottom: '1rem'
								}),
							}}
							classNames={{
								control: () => "shadow",
							}}
							placeholder="Write meal name..."
							name="freeSearch"
							value={selectedMeal || ''}
							onChange={choice => handleSearchSelect(choice as Option)}
							options={freeSearchOptions}
							blurInputOnSelect={windowWidth ? windowWidth < 640 : false}
						/>
					</section>

					<section>
						<div className='flex justify-center items-start gap-2'>
							<label className="labelStyling" aria-label="category">
								Category
							</label>
							<button
								onClick={() => setShowInfo(!showInfo)}
								className='text-xs -mt-1 px-2 py-1 flex items-center justify-center rounded-full border-2 border-gray-500'>
								?
							</button>

						</div>
						{showInfo &&
							<div className='flex justify-center items-center'>
								<section className='text-center max-w-[80%] lg:max-w-[50%] mb-6 text-gray-500'>

									<p className='text-left text-xs font-thin text-gray-500'>
										Your default preferences from settings are already considered. <br />
										Choose a category here if you want a meal from a more specific category randomized on this day.
									</p>
								</section>
							</div>
						}

						<Select
							styles={{
								control: (baseStyles) => ({
									...baseStyles,
									marginBottom: '1rem'
								}),
							}}
							classNames={{
								control: () => "shadow",
							}}
							name="category"
							value={selectedCategory}
							onChange={choice => handleCategorySelect(choice as Option)}
							options={categoryOptions as unknown as Option[]}
							blurInputOnSelect={windowWidth ? windowWidth < 640 : false}
						/>
					</section>

					<section className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
						<Button
							onClick={() => handleButtonClick({ value: 'eatOut', label: 'Eat Out' })}
							className='inline-flex gap-2 justify-center items-center' color='neutral'>
							Eat out
							<RiRestaurantLine size={20} />
						</Button>

						<Button
							onClick={() => handleButtonClick({ value: 'noMeal', label: 'No meal' })}
							className='inline-flex gap-2 justify-center items-center' color='neutral'>
							No meal
							<LuUtensilsCrossed size={20} />
						</Button>
					</section>

					<Button
						onClick={handleSurprise}
						color='neutral' style='ring' className='mb-6 text-sm'>
						Surprise me
					</Button>

				</div>
			</Modal >
		</div >
	)
}
