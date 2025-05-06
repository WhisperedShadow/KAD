import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username') || 'defaultuser');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'defaultrole');

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
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', userRole);
    };

    return (
        <AuthContext.Provider value={{ username, userRole, login }}>
            {children}
        </AuthContext.Provider>
    );
};
