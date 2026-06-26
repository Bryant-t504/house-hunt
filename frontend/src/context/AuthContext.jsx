import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in on page load
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile/');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    logoutUser();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const loginUser = async (credentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // Fetch profile after successful login
            const profileRes = await api.get('/auth/profile/');
            setUser(profileRes.data);
            navigate('/'); // Send user to home page
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.detail || "Login failed" 
            };
        }
    };

    const registerUser = async (formData) => {
        try {
            await api.post('/auth/register/', formData);
            // After register, automatically log them in
            return await loginUser({ 
                username: formData.username, 
                password: formData.password 
            });
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data || "Registration failed" 
            };
        }
    };

    const logoutUser = async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                await api.post('/auth/logout/', { refresh });
            } catch (error) {
                console.error("Failed to blacklist token on logout", error);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    const contextData = {
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
