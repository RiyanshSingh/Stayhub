import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import { motion } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  MapPin,
  List,
  Map,
  X,
  Star,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HotelCard from "@/components/hotels/HotelCard";
import { hotels, categories } from "@/data/mockData";
import { useProperty } from "@/context/PropertyContext";

const SearchPage = () => {
  const { properties } = useProperty();
  const searchParams = useSearchParams()[0];
  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [priceRange, setPriceRange] = useState([50000]); // Increased range
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [freeCancellation, setFreeCancellation] = useState(false); // New state
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Sync category URL param with state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  const allAmenities = [
    "WiFi",
    "Pool",
    "Spa",
    "Gym",
    "Restaurant",
    "Parking",
    "Beach Access",
    "Room Service",
    "Business Center",
  ];

  // Merge mock hotels with real properties from DB
  // We need to map DB properties to ensure they have necessary fields if missing
  const dbPropertiesMapped = properties.map(p => ({
    ...p,
    // Ensure strictly required fields for filtering exist if they are missing
    amenities: p.amenities || [],
    pricePerNight: p.pricePerNight || 0, // Fallback
    reviewCount: p.reviewCount || 0,
    rating: p.rating || 0,
    category: (['budget', 'boutique', 'business', 'family', 'luxury'].includes(p.category) ? p.category : 'budget') as any,
    // Mock data structure might require these for the Card
    images: p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"],
    location: p.location || '',
    city: p.city || '',
    country: p.country || '',
    freeCancellation: p.freeCancellation || false, // Ensure this field exists
  }));

  const allHotels = [...hotels, ...dbPropertiesMapped];

  const filteredHotels = useMemo(() => {
    let filtered = allHotels.filter((hotel) => {

      // Search Query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = hotel.name.toLowerCase().includes(query);
        const matchCity = hotel.city.toLowerCase().includes(query);
        const matchCountry = hotel.country.toLowerCase().includes(query);
        const matchLocation = hotel.location.toLowerCase().includes(query);

        if (!matchName && !matchCity && !matchCountry && !matchLocation) {
          return false;
        }
      }

      // Location filter
      if (locationParam) {
        const search = locationParam.toLowerCase();
        if (
          !hotel.city.toLowerCase().includes(search) &&
          !hotel.location.toLowerCase().includes(search) &&
          !hotel.country.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Price filter
      if (hotel.pricePerNight > priceRange[0]) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(hotel.category)) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every((amenity) =>
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Free Cancellation filter
      if (freeCancellation && !hotel.freeCancellation) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "price-high":
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [locationParam, priceRange, selectedCategories, selectedAmenities, sortBy, searchQuery, freeCancellation]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setPriceRange([50000]);
    setSelectedAmenities([]);
    setSelectedCategories([]);
    setFreeCancellation(false);
  };

  const activeFiltersCount =
    (priceRange[0] < 50000 ? 1 : 0) +
    selectedAmenities.length +
    selectedCategories.length +
    (freeCancellation ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={500}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">₹0</span>
          <span className="text-muted-foreground">₹{priceRange[0]}+</span>
        </div>
      </div>

      {/* Free Cancellation Toggle */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Booking Options</h4>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={freeCancellation}
            onCheckedChange={(checked) => setFreeCancellation(!!checked)}
          />
          <span className="text-foreground">Free Cancellation</span>
          <Badge variant="outline" className="ml-auto text-xs font-normal">Popular</Badge>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Property Type</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-lg">{category.icon}</span>
              <span className="text-foreground">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {allAmenities.map((amenity) => (
            <Badge
              key={amenity}
              variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
              className="cursor-pointer transition-all"
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );


  // ... imports remain the same

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={locationParam ? `Hotels in ${locationParam} | StayHub search` : "Explore Hotels | StayHub"}
        description="Find the best hotels, resorts, and vacation rentals. Filter by price, amenities, and more."
      />
      <Header />

      {/* Search Header */}
      <div className="pt-20 md:pt-24 pb-6 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {locationParam ? `Hotels in ${locationParam}` : "All Hotels"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredHotels.length} properties found
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden md:flex items-center rounded-lg border border-border overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {categories.find((c) => c.id === cat)?.name}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {priceRange[0] < 1000 && (
                <Badge variant="secondary" className="cursor-pointer">
                  Up to ₹{priceRange[0]}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount} active</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No stays found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try widening your dates or removing some filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <HotelCard hotel={hotel} variant="horizontal" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
