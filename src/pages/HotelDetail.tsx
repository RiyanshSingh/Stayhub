import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Sparkles,
  Users,
  BedDouble,
  Maximize,
  CheckCircle,
  X,
  Calendar,
  ChevronRight,
  Shield,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { hotels, reviews } from "@/data/mockData";
import { cn } from "@/lib/utils";

const HotelDetail = () => {
  const { slug } = useParams();
  const hotel = hotels.find((h) => h.slug === slug);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Hotel Not Found
          </h1>
          <Button asChild>
            <Link to="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hotelReviews = reviews.filter((r) => r.hotelId === hotel.id);

  const amenityIcons: Record<string, JSX.Element> = {
    WiFi: <Wifi className="w-5 h-5" />,
    Parking: <Car className="w-5 h-5" />,
    Restaurant: <Coffee className="w-5 h-5" />,
    Spa: <Sparkles className="w-5 h-5" />,
    Pool: <span className="text-lg">🏊</span>,
    Gym: <span className="text-lg">💪</span>,
    "Beach Access": <span className="text-lg">🏖️</span>,
    "Room Service": <span className="text-lg">🛎️</span>,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Gallery */}
      <section className="pt-20 md:pt-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between py-4">
            <Link
              to="/search"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to results
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    isLiked && "fill-destructive text-destructive"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2">
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-64 md:h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
            {hotel.images.slice(1, 5).map((image, index) => (
              <div key={index} className="hidden md:block">
                <img
                  src={image}
                  alt={`${hotel.name} ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setShowAllPhotos(true)}
                />
              </div>
            ))}
            <Button
              variant="secondary"
              className="absolute bottom-4 right-4 md:relative md:bottom-auto md:right-auto"
              onClick={() => setShowAllPhotos(true)}
            >
              Show all photos
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                  </Badge>
                  {hotel.instantBook && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Instant Book
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {hotel.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-medium text-foreground">{hotel.rating}</span>
                    <span>({hotel.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}, {hotel.city}, {hotel.country}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3">
                {hotel.highlights.map((highlight) => (
                  <Badge key={highlight} variant="secondary" className="px-4 py-2 text-sm">
                    ✨ {highlight}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Host Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={hotel.host.avatar} />
                    <AvatarFallback>{hotel.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Hosted by {hotel.host.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {hotel.host.responseRate}% response rate · Responds {hotel.host.responseTime}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="hidden md:flex">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Host
                </Button>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  About this property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    >
                      <span className="text-primary">
                        {amenityIcons[amenity] || <CheckCircle className="w-5 h-5" />}
                      </span>
                      <span className="text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Rooms */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Available Rooms
                </h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all cursor-pointer",
                        selectedRoom === room.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                      )}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="w-full md:w-40 h-32 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">
                                {room.title}
                              </h3>
                              {!room.available && (
                                <Badge variant="destructive" className="mt-1">
                                  Sold Out
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-foreground">
                                ${room.pricePerNight}
                              </div>
                              <div className="text-sm text-muted-foreground">/night</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {room.capacity} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <BedDouble className="w-4 h-4" />
                              {room.beds}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="w-4 h-4" />
                              {room.size} m²
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Guest Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">{hotel.rating}</span>
                    <span className="text-muted-foreground">
                      ({hotel.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {hotelReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {review.userName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-accent text-accent"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6">
                  Show all {hotel.reviewCount} reviews
                </Button>
              </div>

              <Separator />

              {/* Policies */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Things to know
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Check-in/out
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Check-in: {hotel.policies.checkIn}</li>
                      <li>Check-out: {hotel.policies.checkOut}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancellation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {hotel.policies.cancellation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Safety
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Security cameras on property</li>
                      <li>Carbon monoxide alarm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border shadow-card-hover p-6"
                >
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-foreground">
                        ${hotel.pricePerNight}
                      </span>
                      <span className="text-muted-foreground"> /night</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 border border-border rounded-xl">
                      <label className="text-xs text-muted-foreground block mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div className="p-3 border border-border rounded-xl">
                      <label className="text-xs text-muted-foreground block mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="p-3 border border-border rounded-xl mb-6">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Guests
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">2 guests</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <Button variant="accent" size="xl" className="w-full rounded-xl mb-4">
                    Reserve
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mb-6">
                    You won't be charged yet
                  </p>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${hotel.pricePerNight} x 3 nights</span>
                      <span>${hotel.pricePerNight * 3}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Cleaning fee</span>
                      <span>$45</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee</span>
                      <span>$89</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>Total</span>
                      <span>${hotel.pricePerNight * 3 + 45 + 89}</span>
                    </div>
                  </div>

                  {hotel.freeCancellation && (
                    <div className="mt-6 p-3 rounded-xl bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2 text-success text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Free cancellation up to 48 hours
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelDetail;
