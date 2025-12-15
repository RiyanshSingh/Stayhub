import React, { createContext, useContext, useState, useEffect } from "react";
import { Hotel } from "@/data/mockData";
import { useAuth } from "./AuthContext";

interface PropertyContextType {
    properties: Hotel[];
    userProperties: Hotel[];
    addProperty: (property: any) => Promise<void>;
    updateProperty: (id: string, property: any) => Promise<void>;
    deleteProperty: (id: string) => Promise<void>;
    fetchUserProperties: () => Promise<void>;
    wishlist: Hotel[];
    addToWishlist: (hotel: Hotel) => Promise<void>;
    removeFromWishlist: (hotelId: string) => Promise<void>;
    loading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [properties, setProperties] = useState<Hotel[]>([]);
    const [userProperties, setUserProperties] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch all properties (public)
    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/properties');
            const data = await response.json();
            const normalizedData = data.map((item: any) => ({
                ...item,
                pricePerNight: item.price
            }));
            setProperties(normalizedData);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    // Fetch user's properties (private)
    const fetchUserProperties = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/properties/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                const normalizedData = data.map((item: any) => ({
                    ...item,
                    pricePerNight: item.price
                }));
                setUserProperties(normalizedData);
            }
        } catch (error) {
            console.error("Error fetching user properties:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProperties();
        } else {
            setUserProperties([]);
        }
    }, [isAuthenticated]);

    const addProperty = async (property: any) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(property),
            });
            if (response.ok) {
                await fetchProperties();
                await fetchUserProperties();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error("Error adding property:", error);
            throw error;
        }
    };

    const updateProperty = async (id: string, property: any) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(property),
            });
            if (response.ok) {
                await fetchProperties();
                await fetchUserProperties();
            }
        } catch (error) {
            console.error("Error updating property:", error);
            throw error;
        }
    };

    const deleteProperty = async (id: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                await fetchProperties();
                await fetchUserProperties();
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            throw error;
        }
    };

    const [wishlist, setWishlist] = useState<Hotel[]>([]);

    // Fetch wishlist
    const fetchWishlist = async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            return;
        }
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const normalizedData = data.map((item: any) => ({
                    ...item,
                    pricePerNight: item.price
                }));
                setWishlist(normalizedData);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addToWishlist = async (hotel: Hotel) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/wishlist/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ property_id: hotel.id })
            });
            if (response.ok) {
                await fetchWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishlist = async (hotelId: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch('/api/wishlist/toggle', {
                method: 'POST', // Toggle endpoint uses POST
                headers: {
                    'Content-Type': 'application/json', // Added Content-Type
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ property_id: hotelId }) // Send ID in body
            });
            if (response.ok) {
                await fetchWishlist();
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
            fetchUserProperties();
        } else {
            setWishlist([]);
            setUserProperties([]);
        }
    }, [isAuthenticated]);

    return (
        <PropertyContext.Provider value={{
            properties,
            userProperties,
            wishlist,
            addProperty,
            updateProperty,
            deleteProperty,
            fetchUserProperties,
            addToWishlist,
            removeFromWishlist,
            loading
        }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const useProperty = () => {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
};
