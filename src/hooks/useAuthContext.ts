import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextProvider";

export const useAuthContext = () => {
	const authContext = useContext(AuthContext)

	if (!authContext) {
		throw new Error("Error in AuthContextProvider")
	}

	return authContext
}
