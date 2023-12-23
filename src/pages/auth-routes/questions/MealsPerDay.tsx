import { useState } from "react";
import { Pill } from "../../../components/generic utilities/Pill"

export const MealsPerDay = () => {
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const choices = [1, 2]

	return (
		<div className="flex flex-col gap-4 text-center">
			<h3 className="">How many meals per day do you wish to see in your mealplan?</h3>
			<div className="flex justify-center gap-6">
				{choices.map(choice => (
					<Pill
						key={choice}
						onClick={() => setSelectedOption(choice)}
						isActive={selectedOption === choice}>
						{choice}
					</Pill>
				))}
			</div>
		</div>
	)
}
