import { PiBowlFoodDuotone } from "react-icons/pi"

type DividerProps = {
	symbol?: boolean
}

export const Divider: React.FC<DividerProps> = ({ symbol }) => {
	return (
		<div className="flex items-center py-6">
			<hr className="flex-grow border-t border-gray-800" />
			{symbol &&
				<span className="px-3 text-gray-800">
					<PiBowlFoodDuotone size={20} />
				</span>
			}
			<hr className="flex-grow border-t border-gray-800" />
		</div>
	)
}
