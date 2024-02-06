import { createContext } from "react"
import { useState, useContext, useEffect } from "react"
import { auth, db } from "../firebase"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth"
import {setDoc, doc, getDoc} from "firebase/firestore"

const AuthContext =  createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const signUp = async (email, password) => {
        try {
            // Check if the email already exists in Firestore
            const docRef = doc(db, 'users', email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                throw new Error("Email already exists");
            }
    
            // If the email doesn't exist, create a new user
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            // Use the email as the document ID
            await setDoc(docRef, {
                savedShows: []
            });
        } catch (error) {
            console.error("Error signing up:", error);
            alert(error)
            throw error; // Rethrow the error to handle it in the component
        }
    }

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    })

    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}