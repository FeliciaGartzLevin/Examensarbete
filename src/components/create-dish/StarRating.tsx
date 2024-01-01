import React, { useState } from 'react'

type StarRatingProps = {
	onClick: (rating: number) => void
	rating: number | null
}

export const StarRating: React.FC<StarRatingProps> = ({ onClick, rating }) => {
	const [hover, setHover] = useState<number | null>(null)
	const totalStars = 5

	return (
		<div>
			{
				[...Array(totalStars)].map((star, index) => {
					const currentRating = index + 1;

					return (
						<label key={index}>
							<input
								id='star'
								type="radio"
								name="rating"
								value={currentRating}
								onChange={() => onClick(currentRating)}
							/>
							<span
								className="cursor-pointer text-[3rem] "
								style={{
									color:
										currentRating <= (hover || rating || 0) ? "#ffc107" : "#e4e5e9"
								}}
								onMouseEnter={() => setHover(currentRating)}
								onMouseLeave={() => setHover(null)}
							>
								&#9733;
							</span>
						</label>
					);
				})
			}
		</div>
	)

}
