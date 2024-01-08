import { previousMonday } from "date-fns/previousMonday"
import { ContentContainer } from "../../components/generic utilities/ContentContainer"
import { findLastWeekOfTheYear } from "../../helpers/dates"


export const MealsOverView = () => {

	previousMonday(new Date())
	findLastWeekOfTheYear(2023)

	return (
		<ContentContainer>
			hello

		</ContentContainer>
	)
}
