import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const handleSearch = () => {
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury hotel exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-card mb-4 md:mb-6 tracking-tight">
            Find Your
            <span className="block mt-2 bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">
              Perfect Stay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-card/80 max-w-2xl mx-auto">
            From cosy boutique hotels to luxury resorts. Book fast, stay safe, create memories.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 border border-border/50">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Where are you going?"
                  className="pl-12 h-14 rounded-xl bg-secondary border-0 text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    type="text"
                    placeholder="Dates"
                    className="pl-12 h-14 rounded-xl bg-secondary border-0"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    type="text"
                    placeholder="Guests"
                    className="pl-12 h-14 rounded-xl bg-secondary border-0"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>
              <Button
                size="xl"
                variant="accent"
                className="w-full rounded-xl"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Search Rooms
              </Button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Where are you going?"
                  className="pl-12 h-14 rounded-xl bg-secondary border-0 text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="relative flex-1">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Check in — Check out"
                  className="pl-12 h-14 rounded-xl bg-secondary border-0"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                />
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="relative w-40">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="2 Adults"
                  className="pl-12 h-14 rounded-xl bg-secondary border-0"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
              <Button
                size="xl"
                variant="accent"
                className="rounded-xl px-8"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-8 text-card/80">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-card">2.5M+</div>
              <div className="text-sm">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-card">15K+</div>
              <div className="text-sm">Hotels Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-card">120+</div>
              <div className="text-sm">Countries</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-card/60"
          >
            <span className="text-xs mb-2">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
