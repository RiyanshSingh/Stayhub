import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar as CalendarIcon, Users, ChevronDown, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import heroImage from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  /* Validation Logic */
  const { toast } = useToast();

  const handleSearch = () => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a destination to start your search.",
        variant: "destructive",
      });
      return;
    }
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
            Find Your
            <span className="block mt-2 bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">
              Perfect Stay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal pl-12 rounded-xl border-0",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className="w-full h-14 justify-start text-left font-normal pl-12 rounded-xl border-0"
                      >
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <span>
                          {adults} Adult{adults !== 1 && "s"}, {children} Child{children !== 1 && "ren"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium leading-none">Adults</h4>
                            <p className="text-sm text-muted-foreground">Ages 13 or above</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              disabled={adults <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-4 text-center">{adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setAdults(adults + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium leading-none">Children</h4>
                            <p className="text-sm text-muted-foreground">Ages 2-12</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              disabled={children <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-4 text-center">{children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setChildren(children + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal pl-12 rounded-xl border-0",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Check in — Check out</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="relative w-40">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="w-full h-14 justify-start text-left font-normal pl-12 rounded-xl border-0"
                    >
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <span className="truncate">
                        {adults} Adult{adults !== 1 && "s"}
                        {children > 0 && `, ${children} Child${children !== 1 ? "ren" : ""}`}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium leading-none">Adults</h4>
                          <p className="text-sm text-muted-foreground">Ages 13 or above</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center">{adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(adults + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium leading-none">Children</h4>
                          <p className="text-sm text-muted-foreground">Ages 2-12</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center">{children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setChildren(children + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
          <div className="flex justify-center gap-8 md:gap-16 mt-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">2.5M+</div>
              <div className="text-sm">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">15K+</div>
              <div className="text-sm">Hotels Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">120+</div>
              <div className="text-sm">Countries</div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-white/80"
        >
          <span className="text-xs mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
