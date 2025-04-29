import { createContext, useContext, useState, useEffect } from "react";

// create context for user data
// this will be used to store user data and provide it to the rest of the app
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    // Initialize user state by checking if user data exists in localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("petremind-user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // whenever user state changes, update localStorage
    useEffect(() => {
        if (user) {
        localStorage.setItem("petremind-user", JSON.stringify(user));
        } else {
        localStorage.removeItem("petremind-user");
        }
    }, [user]);

    return (
        // give user state and setter function to entire app
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);