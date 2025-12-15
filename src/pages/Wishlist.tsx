import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HotelCard from "@/components/hotels/HotelCard";
import { useProperty } from "@/context/PropertyContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
    const { wishlist, fetchUserProperties } = useProperty(); // fetchUserProperties includes wishlist refresh in context
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 max-w-md"
                    >
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <Heart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold">Sign in to view your wishlist</h1>
                        <p className="text-muted-foreground">
                            You need to be logged in to see your saved properties.
                        </p>
                        <Button asChild size="lg" className="w-full">
                            <Link to="/signin">Sign In</Link>
                        </Button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-3xl font-bold">Your Wishlist</h1>
                    <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                        {wishlist.length} saved
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No saved properties yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Start exploring and save your favorite stays to access them here anytime.
                        </p>
                        <Button asChild size="lg">
                            <Link to="/search">Explore Hotels</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((hotel, index) => (
                            <motion.div
                                key={hotel.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <HotelCard hotel={hotel} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;
