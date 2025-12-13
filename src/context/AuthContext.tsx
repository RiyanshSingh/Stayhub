import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone: string | null;
    address?: string; // New field
    gender?: string; // New field
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, securityQuestion?: string, securityAnswer?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    token: string | null;
    updateProfile: (name: string, phone: string, avatar: string, address?: string, gender?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("auth_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("auth_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("auth_user");
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data.user);
            localStorage.setItem("auth_token", data.token);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, securityQuestion?: string, securityAnswer?: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, security_question: securityQuestion, security_answer: securityAnswer }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("auth_token", data.token);
                // Also store user data
                localStorage.setItem("user_data", JSON.stringify(data.user));
                setUser(data.user);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    const updateProfile = async (name: string, phone: string, avatar: string, address?: string, gender?: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone, avatar, address, gender })
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_token");
    };

    return (
        <AuthContext.Provider value={{
            user,
            token: localStorage.getItem("auth_token"),
            isAuthenticated: !!user,
            login,
            register,
            updateProfile,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
