import { ReactNode } from "react"
import { PiBowlFoodDuotone } from "react-icons/pi"

type DividerProps = {
	symbol?: ReactNode
	className?: string
}

export const Divider: React.FC<DividerProps> = ({ symbol = <PiBowlFoodDuotone size={20} />, className }) => {
	return (
		<div className={"flex flex-row items-center w-full " + (className ?? '')}>
			<hr className="flex-grow border-t border-gray-800" />
			{symbol &&
				<span className="px-3 text-gray-800">
					{symbol}
				</span>
			}
			<hr className="flex-grow border-t border-gray-800" />
		</div>
	)
}
