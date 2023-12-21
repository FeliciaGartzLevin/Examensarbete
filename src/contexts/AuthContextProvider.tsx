import {
	UserCredential,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	User,
	updateProfile,
	signOut,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { LoadingSpinner } from "../components/LoadingSpinner";

type AuthContextDef = {
	activeUser: User | null
	setDisplayName: (displayName: string) => Promise<void>
	signin: (email: string, password: string) => Promise<UserCredential>
	signout: () => Promise<void>
	signup: (email: string, password: string) => Promise<UserCredential>
	userName: string | null
}

export const AuthContext = createContext<AuthContextDef | null>(null)

type AuthContextProps = {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [userName, setUserName] = useState<string | null>(null)
	const [activeUser, setActiveUser] = useState<User | null>(null)
	const [pending, setPending] = useState(true)

	const setDisplayName = (displayName: string) => {
		if (!activeUser) {
			throw new Error("No active user")
		}
		return updateProfile(activeUser, { displayName })
	}

	const signout = () => {
		return signOut(auth)
	}

	const signin = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password)
	}

	const signup = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password)
	}


	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setActiveUser(user)
			if (user) {
				setUserName(user.displayName)
			} else {
				setUserName(null)
			}
			setPending(false)
		})

		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{
			activeUser,
			setDisplayName,
			signin,
			signout,
			signup,
			userName
		}}>
			{pending
				? <LoadingSpinner />
				: <>{children}</>
			}

		</AuthContext.Provider>
	)
}
