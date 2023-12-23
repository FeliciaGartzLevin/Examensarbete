import {
	UserCredential,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	User,
	updateProfile,
	signOut,
	sendPasswordResetEmail,
	updateEmail,
	updatePassword,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth, usersCol } from "../services/firebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type AuthContextType = {
	activeUser: User | null
	activeUserId: string | null
	resetPassword: (email: string) => Promise<void>
	setEmail: (email: string) => Promise<void>
	setDisplayName: (displayName: string) => Promise<void>
	setPassword: (password: string) => Promise<void>
	signin: (email: string, password: string) => Promise<UserCredential>
	signout: () => Promise<void>
	signup: (email: string, name: string, password: string) => Promise<UserCredential>
	updateUserLocally: () => false | undefined
	userName: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

type AuthContextProps = {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [userName, setUserName] = useState<string | null>(null)
	const [activeUser, setActiveUser] = useState<User | null>(null)
	const [activeUserId, setActiveUserId] = useState<string | null>(null)
	const [pending, setPending] = useState(true)

	const resetPassword = (email: string) => {
		return sendPasswordResetEmail(auth, email, {
			url: window.location.origin + "/sign-in",
		})
	}

	const setEmail = (email: string) => {
		if (!activeUser) {
			throw new Error("No active user")
		}
		return updateEmail(activeUser, email)
	}

	const setDisplayName = (displayName: string) => {
		if (!activeUser) {
			throw new Error("No active user")
		}
		return updateProfile(activeUser, { displayName })
	}

	const setPassword = (password: string) => {
		if (!activeUser) {
			throw new Error("No active user")
		}
		return updatePassword(activeUser, password)
	}

	const signout = () => {
		return signOut(auth)
	}

	const signin = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password)
	}

	const signup = async (email: string, name: string, password: string) => {
		const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
		const newUser = userCredentials.user

		updateProfile(newUser, {
			displayName: name,
		})

		setUserName(name)

		const docRef = doc(usersCol, newUser.uid)
		setDoc(docRef, {
			uid: newUser.uid,
			email,
			displayName: name,
			createdMealIds: null,
			preferences: {
				mealsPerDay: 1,
				foodPreferences: null,
				generateFrom: 'allDishes'
			},
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		})

		return userCredentials
	}

	const updateUserLocally = () => {
		if (!auth.currentUser) { return false }
		setUserName(auth.currentUser.displayName)
		setActiveUserId(auth.currentUser.uid)
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setActiveUser(user)
			if (user) {
				setUserName(user.displayName)
				setActiveUserId(user.uid)
			} else {
				setUserName(null)
				setActiveUserId(null)
			}
			setPending(false)
		})

		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{
			activeUser,
			activeUserId,
			resetPassword,
			setEmail,
			setDisplayName,
			setPassword,
			signin,
			signout,
			signup,
			updateUserLocally,
			userName
		}}>
			{pending
				? <LoadingSpinner />
				: <>{children}</>
			}

		</AuthContext.Provider>
	)
}
