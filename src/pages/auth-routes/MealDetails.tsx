import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { fetchFirebaseDocs, mealsCol } from "../../services/firebase"
import { Meal } from "../../types/Meal.types"
import { where } from "firebase/firestore"
import { ContentContainer } from "../../components/generic-utilities/ContentContainer"
import { LoadingSpinner } from "../../components/generic-utilities/LoadingSpinner"
import { Alert } from "../../components/generic-utilities/Alert"
import { FaStar } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { Button } from "../../components/generic-utilities/Button"

export const MealDetails = () => {
	const { mealId } = useParams()

	const {
		data: mealData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['meal', mealId],
		queryFn: () => fetchFirebaseDocs<Meal>(
			mealsCol,
			[where("_id", "==", mealId)]
		),
		enabled: !!mealId
	})

	if (isLoading) {
		return <LoadingSpinner />
	}

	const meal = mealData && mealData[0]

	return (
		<ContentContainer className="gap-6 pb-14">
			{isError && error && <Alert color='red' header={error.name || "Error"} body={error.message || "An error occured"} />}

			{meal?.imageUrl && <img src={meal.imageUrl} />}

			{meal && (
				<>
					<h2 className="h2">{meal.name}</h2>
					{meal.rating &&
						<div>
							{
								[...Array(5)].map((star, index) => {
									return (
										<span
											key={index}
											className="drop-shadow text-[1.8rem] sm:text-[2.3rem] inline-flex mx-1"
											style={{
												color: index + 1 <= meal.rating! ? "#ffc107" : "#e4e5e9"
											}}
										>
											<FaStar />
										</span>

									)
								})
							}

						</div>}
					{meal.link &&
						<Button type="button" style="ring" color="green">
							<Link to={meal.link} className="flex items-center justify-center gap-2">
								<BsGlobe />
								<span>
									Link to recipe
								</span>
							</Link>
						</Button>
					}

					<section>
						<h3 className="h3">{meal.category.length === 1 ? 'Category' : 'Categories'}</h3>
						<div className="flex gap-2">
							{meal.category.map((cat, index) => {
								return (
									<span
										key={index}
										className={'px-3 py-[0.1rem] border-black rounded-xl bg-gray-200 border'}
									>
										{cat}
									</span>
								)
							})}
						</div>
					</section>

					{meal.description &&
						<section className="max-w-[80%]">
							<h3 className="h3">Description</h3>
							<p className="text-left">{meal.description}</p>
						</section>
					}
				</>
			)}
		</ContentContainer>
	)
}
