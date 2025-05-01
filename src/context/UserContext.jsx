import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../hosting/firebase";
import { onAuthStateChanged } from "firebase/auth";

// create context for user data
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    // initialize user state from local storage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("petremind-user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // track loading state while checking Firebase auth
    const [loading, setLoading] = useState(true);

    // update local storage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("petremind-user", JSON.stringify(user));
        } else {
            localStorage.removeItem("petremind-user");
        }
    }, [user]);

    // listen for Firebase authentication changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // update state if Firebase has a logged-in user
                const userData = {
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    uid: firebaseUser.uid,
                };
                setUser(userData);
                localStorage.setItem("petremind-user", JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem("petremind-user");
            }
            // after Firebase finishes checking, stop loading
            setLoading(false);
        });

        // cleanup listener when unmount happens
        return () => unsubscribe();
    }, []);

    return (
        // give user state, setter function, and loading state to entire app
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);