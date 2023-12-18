import React from 'react'

type CreateDishProps = {
	hej: string
}

// combine it with edit dish, or make it's own for that??
// isf måste man navigera olika efteråt, och visa lite olika
// grejor/ha lite olika alternativ men basically they are the same

export const CreateDish: React.FC<CreateDishProps> = ({ hej }) => {
	return (
		<div>CreateDish</div>
	)
}

