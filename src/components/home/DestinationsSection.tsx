import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { popularDestinations } from "@/data/mockData";

const DestinationsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing hotels in the world's most sought-after locations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((destination, index) => (
            <motion.div
              key={destination.city}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={`/search?location=${encodeURIComponent(destination.city)}`}
                className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 aspect-square p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                  <span className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {destination.image}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {destination.city}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {destination.hotelCount} hotels
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
