import { useAuthContext } from "../../../hooks/useAuthContext"
import { useStreamUserDoc } from "../../../hooks/firebase/useStreamUserDoc"
import { MealsPerDay } from "../questions/MealsPerDay"
import { FoodPreferences } from "../questions/FoodPreferences"
import { DbSource } from "../questions/DbSource"
import { Divider } from "../../../components/generic utilities/Divider"

export const UserPreferencesPage = () => {
	const { activeUser } = useAuthContext()
	const { data: userDocs, isLoading } = useStreamUserDoc()

	return (
		<div className="flex flex-col gap-4 px-4">
			<h3 className="h2">Preferences</h3>
			<div>
				<MealsPerDay
					userDocs={userDocs}
					isLoading={isLoading}
					activeUserId={activeUser?.uid}
				/>
			</div>
			<Divider className="py-6" symbol='bowl' />
			<div className="flex flex-col">
				<FoodPreferences
					userDocs={userDocs}
					isLoading={isLoading}
					activeUserId={activeUser?.uid}
				/>
			</div>
			<Divider className="py-6" symbol='bowl' />
			<div>
				<DbSource
					userDocs={userDocs}
					isLoading={isLoading}
					activeUserId={activeUser?.uid}
				/>
			</div>

		</div>
	)
}
