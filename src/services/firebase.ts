import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { CollectionReference, DocumentData, QueryConstraint, collection, getCountFromServer, getDocs, getFirestore, query } from "firebase/firestore"
import { Meal } from "../types/Meal.types"
import { UserDoc } from "../types/User.types"
import { WeekPlan } from "../types/WeekPlan.types"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)

// A helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(db, collectionName) as CollectionReference<T>
}

// Export collection references
export const usersCol = createCollection<UserDoc>('users')
export const mealsCol = createCollection<Meal>('meals')
export const weeksCol = createCollection<WeekPlan>('weekplans')

// A controlled generic fetch on the contrary to the useStreamCollection-hook
export const fetchFirebaseDocs = async <T>(
	colRef: CollectionReference<T>,
	queryConstraints: QueryConstraint[],
) => {
	const queryRef = query(colRef, ...queryConstraints)

	const snapshot = await getDocs(queryRef)
	const data: T[] = snapshot.docs.map(doc => ({
		...doc.data(),
		_id: doc.id
	}))

	return data

}

//getting the lenght of a collection
export const getCollectionLength = async <T>(
	colRef: CollectionReference<T>,
	queryConstraints: QueryConstraint[]
) => {

	const queryRef = query(colRef, ...queryConstraints)

	const snapshot = await getCountFromServer(queryRef)
	return snapshot
}
