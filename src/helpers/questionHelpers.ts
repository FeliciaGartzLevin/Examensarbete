import { UserDoc, UserPreferences } from "../types/User.types"

export const extractPreferences = <T extends keyof UserPreferences>(
	userDocs: UserDoc[] | null,
	activeUserId: string | undefined,
	preference: T
) => {
	if (!userDocs) { return [] }
	if (!activeUserId) { return [] }

	const userDoc = userDocs.find(doc => doc.uid === activeUserId)

	if (!userDoc) { return [] }

	return userDoc.preferences[preference]
}
