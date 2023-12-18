import React from 'react'

type ChangeDishProps = {
	hej: string
}

const ChangeDish: React.FC<ChangeDishProps> = ({ hej }) => {
	return (
		<div>
			ChangeDish
			Funktionalitet och innehåll (utseende) för change dish modal, som läggs i den generiska modalen
		</div>
	)
}

export default ChangeDish
