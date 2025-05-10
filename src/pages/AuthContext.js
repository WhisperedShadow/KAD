import React, { createContext, useState, useEffect } from 'react';
import User from "./../components/Auth/Auth.jsx"
export const AuthContext = createContext();
const user = new User();
export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
    }, [username, userRole]);

    const login = (username, userRole) => {
        setUsername(username);
        setUserRole(userRole);
        user.authenticated = true;
        user.username = username;
        user.userRole = userRole;
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', userRole);
    };

    return (
        <AuthContext.Provider value={{ username, userRole, login }}>
            {children}
        </AuthContext.Provider>
    );
};
