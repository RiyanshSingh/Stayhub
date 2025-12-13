import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, Wifi, Car, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useProperty } from "@/context/PropertyContext";

interface HotelCardProps {
  hotel: Hotel;
  variant?: "default" | "horizontal";
}

const HotelCard = ({ hotel, variant = "default" }: HotelCardProps) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useProperty();
  const isLiked = wishlist.some(item => item.id === hotel.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const amenityIcons: Record<string, JSX.Element> = {
    WiFi: <Wifi className="w-3.5 h-3.5" />,
    Parking: <Car className="w-3.5 h-3.5" />,
    Restaurant: <Coffee className="w-3.5 h-3.5" />,
    Spa: <Sparkles className="w-3.5 h-3.5" />,
  };

  const getCategoryBadge = () => {
    const styles: Record<string, string> = {
      luxury: "bg-amber-100 text-amber-800 border-amber-200",
      boutique: "bg-violet-100 text-violet-800 border-violet-200",
      business: "bg-slate-100 text-slate-800 border-slate-200",
      family: "bg-emerald-100 text-emerald-800 border-emerald-200",
      budget: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return styles[hotel.category] || "bg-muted text-muted-foreground";
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please sign in to save properties.");
      return;
    }

    if (isLiked) {
      await removeFromWishlist(hotel.id);
    } else {
      await addToWishlist(hotel);
    }
  };

  if (variant === "horizontal") {
    return (
      <Link to={`/hotel/${hotel.slug}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
        >
          {/* Image */}
          <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isLiked ? "fill-destructive text-destructive" : "text-foreground"
                )}
              />
            </Button>
            {hotel.freeCancellation && (
              <Badge
                variant="secondary"
                className="absolute bottom-3 left-3 bg-success text-success-foreground border-0"
              >
                Free Cancellation
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <Badge variant="outline" className={cn("mb-2", getCategoryBadge())}>
                  {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                </Badge>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {hotel.name}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-foreground">
                  ₹{hotel.pricePerNight}
                </div>
                <div className="text-sm text-muted-foreground">/night</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {hotel.location}, {hotel.city}
            </div>

            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{hotel.rating}</span>
              <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {amenityIcons[amenity] || null}
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/hotel/${hotel.slug}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
      >
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.images[currentImageIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full z-10"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isLiked ? "fill-destructive text-destructive" : "text-foreground"
              )}
            />
          </Button>

          {/* Category Badge */}
          <Badge
            variant="outline"
            className={cn("absolute top-3 left-3 border", getCategoryBadge())}
          >
            {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
          </Badge>

          {/* Image Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {hotel.images.slice(0, 4).map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  currentImageIndex === index
                    ? "bg-card w-3"
                    : "bg-card/60 hover:bg-card/80"
                )}
              />
            ))}
          </div>

          {/* Free Cancellation */}
          {hotel.freeCancellation && (
            <Badge className="absolute bottom-3 left-3 bg-success text-success-foreground border-0">
              Free Cancellation
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium text-sm">{hotel.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{hotel.location}, {hotel.city}</span>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex gap-2">
              {hotel.amenities.slice(0, 3).map((amenity) => (
                <div
                  key={amenity}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                  title={amenity}
                >
                  {amenityIcons[amenity] || <span className="text-xs">{amenity[0]}</span>}
                </div>
              ))}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                ₹{hotel.pricePerNight}
              </div>
              <div className="text-xs text-muted-foreground">/night</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default HotelCard;
