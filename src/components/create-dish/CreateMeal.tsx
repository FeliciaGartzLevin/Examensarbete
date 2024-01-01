import { useEffect, useState } from 'react'
import { Button } from '../generic utilities/Button'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateMealSchema, createMealSchema } from '../../schemas/MealSchemas'
import { Alert } from '../generic utilities/Alert'
import { StarRating } from './StarRating'
import { categories } from '../../types/Meal.types'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirebaseUpdates } from '../../hooks/useFirebaseUpdates'

export const CreateMeal = () => {
	const { activeUser } = useAuthContext()
	const [starRating, setStarRating] = useState<number | null>(null)
	const {
		loading,
		setLoadingStatus,
		errorMsg,
		resetError,
		handleError,
		createNewMeal
	} = useFirebaseUpdates()

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitSuccessful },
		control,
		reset,
	} = useForm<CreateMealSchema>({
		resolver: zodResolver(createMealSchema),
		defaultValues: {
			category: []
		}
	})

	const options = categories.map(category => {
		return {
			value: category,
			label: category
		}
	})

	const onSubmit: SubmitHandler<CreateMealSchema> = async (data) => {
		resetError()

		try {
			setLoadingStatus(true)

			console.log('submitted data', data);

			await createNewMeal(data, starRating)
			// add everything, plus userId to owner: 'ahs3456dfbdfgm'

			// stars can be in their own firebase document, connected to the dish and the user Id,
			// because depending on who shows the dish, the grade will be different.
			// or shall it be an average value based on all ratings maybe?

		} catch (error) {
			handleError(error)
		} finally {
			setLoadingStatus(false)
		}
	}

	useEffect(() => {
		if (!isSubmitSuccessful) { return }
		reset()
	}, [isSubmitSuccessful, reset])

	return (
		<>
			<h2 className='h2 mb-6'>
				Create new dish
			</h2>
			<div className='grid grid-col-1'>

				{errorMsg &&
					<Alert body={errorMsg} color='red' />
				}
				<div className='mb-0'>
					<h3 className='labelStyling mb-0'>Rating</h3>
					<StarRating rating={starRating} onClick={(rating) => setStarRating(rating)} />
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label className="labelStyling" aria-label="name">
							Name*
						</label>
						<input
							className={errors.name ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="name"
							type="name"
							placeholder="eg. Pasta carbonara"
							{...register('name')}
						/>
						{errors.name && <p className="errorMsgStyling">{errors.name.message ?? "Invalid value"}</p>}
					</div>

					<div className="mb-4">
						<label className="labelStyling" aria-label="link">
							External link to recipe
						</label>
						<input
							className={errors.link ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="link"
							type="text"
							placeholder="url"
							{...register('link')}
						/>
						{errors.link && <p className="errorMsgStyling">{errors.link.message ?? "Invalid value"}</p>}
					</div>

					<div className="mb-4">
						<label className="labelStyling" aria-label="category">
							Category*
						</label>

						<Controller
							control={control}
							defaultValue={[]}
							name="category"
							render={({ field: { onChange, value } }) => (
								<Select
									styles={{
										control: (baseStyles) => ({
											...baseStyles,
											borderColor: errors.category ? '#EF4444' : 'gray',
										}),
									}}
									className='mb-2'
									name="category"
									value={options.filter(c => value.includes(c.value))}
									onChange={val => onChange(val.map(c => c.value))}
									options={options}
									isMulti
								/>
							)}
						/>
						{errors.category && <p className="errorMsgStyling">{errors.category.message ?? "Invalid value"}</p>}
					</div>

					<div className="mb-4">
						<label className="labelStyling" aria-label="description">
							Description
						</label>
						<textarea
							className={errors.description ? "errorInputStyling" : "defaultInputStyling"}
							aria-labelledby="description"
							placeholder="eg. recipe or instructions"
							{...register('description')}
						/>
						{errors.description && <p className="errorMsgStyling">{errors.description.message ?? "Invalid value"}</p>}
						<p className='text-xs text-gray-500'><span className='text-lg'>*</span> = mandatory fields</p>
					</div>

					<Button type='submit' disabled={loading}>
						Submit
					</Button>
				</form>
			</div>
		</>
	)
}

