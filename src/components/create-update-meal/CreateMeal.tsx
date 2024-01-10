import { useEffect, useState } from 'react'
import { Button } from '../generic-utilities/Button'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateMealSchema, createMealSchema } from '../../schemas/MealSchemas'
import { Alert } from '../generic-utilities/Alert'
import { StarRating } from './StarRating'
import { categories } from '../../types/Meal.types'
import Select from 'react-select'
import { useFirebaseUpdates } from '../../hooks/firebase/useFirebaseUpdates'
import { useWindowSize } from '../../hooks/useWindowSize'
import { LoadingSpinner } from '../generic-utilities/LoadingSpinner'
import { ContentContainer } from '../generic-utilities/ContentContainer'
import { Dropzone } from './Dropzone'
import { useUploadImage } from '../../hooks/useUploadImage'
import { useSuccessAlert } from '../../hooks/useSucessAlert'

export const CreateMeal = () => {
	const [starRating, setStarRating] = useState<number | null>(null)
	const { windowSizeisLoading, windowWidth } = useWindowSize()
	const [image, setImage] = useState<File | null>(null)
	const { success, setSuccessState } = useSuccessAlert()

	const {
		loading,
		setLoadingStatus,
		errorMsg,
		resetError,
		handleError,
		createNewMeal,
	} = useFirebaseUpdates()

	const {
		imageUploadErrorMsg,
		uploadImage,
		isUploadingImage
	} = useUploadImage()

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

	// helper function to upload image and get the url
	const uploadAndGetImageUrl = async (image: File | null) => {
		if (!image) { return null }

		// if image exists, try uploading it to Firebase Storage
		try {
			const url = await uploadImage(image)

			return url
		} catch (error) {
			handleError(error)
		}
	}

	// handling when user is submitting the form
	const onSubmit: SubmitHandler<CreateMealSchema> = async (data) => {
		resetError()
		setSuccessState(false)

		// scroll smoothly to top
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		})

		try {
			setLoadingStatus(true)

			// uploading image, if any, to firebase storage + getting url for new image
			const url = await uploadAndGetImageUrl(image)

			// creating new meal in firebase db
			await createNewMeal(data, starRating, url)

			// show confirmation alert
			setSuccessState(true)
		} catch (error) {
			handleError(error)
			setSuccessState(false)
		} finally {
			setLoadingStatus(false)
		}
	}

	useEffect(() => {
		if (!isSubmitSuccessful) { return }

		reset()
		setStarRating(null)
	}, [isSubmitSuccessful, reset])


	if (windowSizeisLoading || isUploadingImage) {
		return <LoadingSpinner />
	}

	return (
		<ContentContainer>
			<h2 className='h2 mb-6'>
				Create new meal
			</h2>
			<div className='grid grid-cols-1 gap-4 '>
				<section className='mb-4'>
					<section className='mb-4'>
						{errorMsg &&
							<Alert header={'Error'} body={errorMsg} color='red' />
						}

						{imageUploadErrorMsg &&
							<Alert header={'Error'} body={imageUploadErrorMsg} color='red' />
						}

						{success &&
							<Alert
								color='green'
								body={
									<p>
										New meal was successfully created.<br />
										Now you can create more if you want.
									</p>}
							/>
						}
					</section>

					<section>
						<div className='mb-6'>
							<h3 className='labelStyling mb-3'>Image</h3>
							<Dropzone resetOnUpload={isSubmitSuccessful} liftImageUp={(image: File | null) => setImage(image)} />
						</div>

						<div className=''>
							<label className="labelStyling" aria-label="name">
								Rating
							</label>
							<StarRating rating={starRating} onClick={(rating) => setStarRating(rating)} />
						</div>
					</section>
				</section>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10 lg:justify-start mb-4'>
						<div>
							<label id='name' className="labelStyling" aria-label="name">
								Name*
							</label>
							<input
								className={errors.name ? "errorInputStyling" : "defaultInputStyling"}
								type="name"
								placeholder="eg. Pasta carbonara"
								{...register('name')}
							/>
							{errors.name && <p className="errorMsgStyling">{errors.name.message ?? "Invalid value"}</p>}
						</div>

						<div>
							<label id='link' className="labelStyling" aria-label="link">
								External link to recipe
							</label>
							<input
								className={errors.link ? "errorInputStyling" : "defaultInputStyling"}
								type="text"
								placeholder="url"
								{...register('link')}
							/>
							{errors.link && <p className="errorMsgStyling">{errors.link.message ?? "Invalid value"}</p>}
						</div>

						<div>
							<label className="labelStyling" aria-label="category">
								Category*
								<p className='text-xs font-thin text-gray-500'>
									More than one can be chosen
								</p>
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
												borderColor: errors.category ? '#EF4444' : 'none',
												marginBottom: '1rem'
											}),
										}}
										classNames={{
											control: () => "shadow",
										}}
										name="category"
										value={options.filter(choice => value.includes(choice.value))}
										onChange={val => onChange(val.map(choice => choice.value))}
										options={options}
										isMulti
										blurInputOnSelect={windowWidth ? windowWidth < 640 : false}
									/>
								)}
							/>
							{errors.category && <p className="errorMsgStyling">{errors.category.message ?? "Invalid value"}</p>}
						</div>

						<div>
							<label className="labelStyling" aria-label="description">
								Description
							</label>
							<textarea
								className={errors.description ? "errorInputStyling" : "defaultInputStyling"}
								placeholder="eg. recipe or instructions"
								{...register('description')}
							/>
							{errors.description && <p className="errorMsgStyling">{errors.description.message ?? "Invalid value"}</p>}
						</div>
					</div>
					<p className='text-xs text-gray-500 mb-4'><span className='text-lg'>*</span> = mandatory fields</p>

					<div className='flex justify-center items-center'>
						<Button type='submit' disabled={loading}>
							Submit
						</Button>
					</div>
				</form>
			</div>
		</ContentContainer>
	)
}

