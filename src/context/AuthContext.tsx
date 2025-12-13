import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone: string | null;
    address?: string;
    gender?: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (name: string, email: string, password: string, securityQuestion?: string, securityAnswer?: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    updateProfile: (name: string, phone: string, avatar: string, address?: string, gender?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${supabaseUser.email}`,
        phone: supabaseUser.user_metadata?.phone || null,
        address: supabaseUser.user_metadata?.address,
        gender: supabaseUser.user_metadata?.gender,
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(mapSupabaseUser(session?.user ?? null));
            }
        );

        // THEN check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(mapSupabaseUser(session?.user ?? null));
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        });

        if (error) {
            throw new Error(error.message);
        }
    };

    const register = async (name: string, email: string, password: string, securityQuestion?: string, securityAnswer?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
                data: {
                    name,
                    full_name: name,
                    security_question: securityQuestion,
                    security_answer: securityAnswer,
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }
    };

    const updateProfile = async (name: string, phone: string, avatar: string, address?: string, gender?: string) => {
        const { error } = await supabase.auth.updateUser({
            data: {
                name,
                full_name: name,
                phone,
                avatar_url: avatar,
                address,
                gender,
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Refresh the user data
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        setUser(mapSupabaseUser(updatedUser));
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isAuthenticated: !!session,
            login,
            loginWithGoogle,
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
