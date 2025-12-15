import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search } from "lucide-react";

// Curated list of distinct, high-quality Unsplash images
const allDestinations = [
    { city: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80", hotelCount: 412 },
    { city: "Dubai", country: "UAE", image: "https://images.pexels.com/photos/1534411/pexels-photo-1534411.jpeg?auto=compress&cs=tinysrgb&w=800", hotelCount: 689 },
    { city: "Rome", country: "Italy", image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800", hotelCount: 523 },
    { city: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80", hotelCount: 478 },
    { city: "Sydney", country: "Australia", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80", hotelCount: 234 },
    { city: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80", hotelCount: 356 },
    { city: "Cape Town", country: "South Africa", image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80", hotelCount: 189 },
    { city: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80", hotelCount: 267 },
    { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", hotelCount: 198 },
    { city: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", hotelCount: 145 },
    { city: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80", hotelCount: 112 },
    { city: "Cairo", country: "Egypt", image: "https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=800", hotelCount: 201 },
    { city: "Miami", country: "USA", image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80", hotelCount: 234 },
    { city: "New York", country: "USA", image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800", hotelCount: 567 },
    { city: "Los Angeles", country: "USA", image: "https://images.pexels.com/photos/2030356/pexels-photo-2030356.jpeg?auto=compress&cs=tinysrgb&w=800", hotelCount: 389 },
    { city: "Paris", country: "France", image: "https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg", hotelCount: 445 },
    { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", hotelCount: 312 },
    { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80", hotelCount: 498 },
];

const DestinationCard = ({ dest, index }: { dest: typeof allDestinations[0], index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link
                to={`/search?location=${encodeURIComponent(dest.city)}`}
                className="group relative block overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl aspect-[4/5]"
            >
                <div className="absolute inset-0">
                    <img
                        src={dest.image}
                        alt={dest.city}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-foreground transition-colors">
                        {dest.city}
                    </h3>
                    <p className="text-sm text-gray-200 flex items-center justify-between">
                        <span>{dest.country}</span>
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs">
                            {dest.hotelCount} properties
                        </span>
                    </p>
                </div>

                {/* Hover Overlay Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-sm text-white">
                    <Search className="w-5 h-5" />
                </div>
            </Link>
        </motion.div>
    );
};

const Destinations = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 bg-secondary/20">
                <div className="container mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Explore the World
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Find the perfect stay in the world's most breathtaking destinations.
                    </motion.p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {allDestinations.map((dest, index) => (
                            <DestinationCard key={dest.city} dest={dest} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Destinations;
