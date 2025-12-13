import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HotelCard from "@/components/hotels/HotelCard";
import { useProperty } from "@/context/PropertyContext";

import { hotels } from "@/data/mockData";

const TrendingHotels = () => {
  const { properties: dbProperties } = useProperty();

  // Merge, favoring DB properties if they exist, otherwise showing mock
  const displayProperties = [...dbProperties, ...hotels].slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Trending Stays
            </h2>
            <p className="text-muted-foreground">
              The most loved hotels by our guests this month
            </p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/search">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <HotelCard hotel={hotel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingHotels;
