import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Set default axios auth header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Decode token to get user info
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                setUser(payload);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                email,
                password
            });
            
            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Decode token to get user info
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            setUser(payload);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'An error occurred during login'
            };
        }
    };

    const register = async (email, password, secretKey) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
                email,
                password,
                secretKey
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'An error occurred during registration'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
