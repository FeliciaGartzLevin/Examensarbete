import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ReactNode, createContext, useState } from "react";
import { auth } from "../services/firebase";

type AuthContextDef = {
	signup: (email: string, name: string, password: string) => Promise<UserCredential>
	signin: (email: string, password: string) => Promise<UserCredential>
	userName: string | null
}

export const AuthContext = createContext<AuthContextDef | null>(null)

type AuthContextProps = {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [userName, setUserName] = useState<string | null>(null)

	const signin = (email: string, password: string) => {
		console.log('Signing in user in authcontext', email, password)
		return signInWithEmailAndPassword(auth, email, password)
	}

	const signup = (email: string, name: string, password: string) => {
		console.log('Signing up user in authcontext', email, password)
		setUserName(name)
		return createUserWithEmailAndPassword(auth, email, password)
	}

	return (
		<AuthContext.Provider value={{
			signup,
			signin,
			userName
		}}>
			{children}
		</AuthContext.Provider>
	)
}
