import hotelRoom1 from "@/assets/hotel-room-1.jpg";
import hotelRoom2 from "@/assets/hotel-room-2.jpg";
import hotelRoom3 from "@/assets/hotel-room-3.jpg";

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  country: string;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  images: string[];
  amenities: string[];
  category: "budget" | "boutique" | "business" | "family" | "luxury";
  instantBook: boolean;
  freeCancellation: boolean;
  coordinates: { lat: number; lng: number };
  rooms: Room[];
  highlights: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  host: {
    name: string;
    avatar: string;
    responseRate: number;
    responseRate: number;
    responseTime: string;
  };
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Room {
  id: string;
  title: string;
  description: string;
  capacity: number;
  beds: string;
  size: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Ocean View Resort & Spa",
    slug: "ocean-view-resort-spa",
    location: "Beachfront, Marina District",
    city: "Miami",
    country: "USA",
    description: "Experience luxury beachfront living at Ocean View Resort & Spa. Wake up to stunning sunrise views, relax at our world-class spa, and enjoy gourmet dining with panoramic ocean vistas.",
    rating: 4.9,
    reviewCount: 342,
    pricePerNight: 289,
    currency: "INR",
    images: [hotelRoom1, hotelRoom2, hotelRoom3],
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Beach Access", "WiFi", "Parking", "Room Service"],
    category: "luxury",
    instantBook: true,
    freeCancellation: true,
    coordinates: { lat: 25.7617, lng: -80.1918 },
    highlights: ["Beachfront Location", "Award-winning Spa", "Michelin-star Restaurant", "Private Beach"],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
    },
    host: {
      name: "Maria Santos",
      avatar: "https://i.pravatar.cc/150?img=1",
      responseRate: 98,
      responseTime: "within an hour",
    },
    rooms: [
      {
        id: "r1",
        title: "Ocean View Suite",
        description: "Spacious suite with panoramic ocean views, private balcony, and luxury amenities.",
        capacity: 2,
        beds: "1 King Bed",
        size: 45,
        pricePerNight: 289,
        amenities: ["Ocean View", "Private Balcony", "Mini Bar", "Coffee Machine", "Safe"],
        images: [hotelRoom1],
        available: true,
      },
      {
        id: "r2",
        title: "Deluxe Family Room",
        description: "Perfect for families with connecting rooms and kid-friendly amenities.",
        capacity: 4,
        beds: "2 Queen Beds",
        size: 65,
        pricePerNight: 389,
        amenities: ["City View", "Connecting Rooms", "Mini Bar", "Game Console", "Safe"],
        images: [hotelRoom2],
        available: true,
      },
      {
        id: "r3",
        title: "Presidential Suite",
        description: "Ultimate luxury with private pool, butler service, and exclusive amenities.",
        capacity: 2,
        beds: "1 King Bed",
        size: 120,
        pricePerNight: 899,
        amenities: ["Private Pool", "Butler Service", "Ocean View", "Jacuzzi", "Kitchen"],
        images: [hotelRoom3],
        available: false,
      },
    ],
  },
  {
    id: "2",
    name: "The Boutique Loft",
    slug: "the-boutique-loft",
    location: "Arts District, Downtown",
    city: "New York",
    country: "USA",
    description: "A charming boutique hotel in the heart of the arts district. Original artwork, exposed brick, and artisanal touches create a unique stay experience.",
    rating: 4.7,
    reviewCount: 189,
    pricePerNight: 199,
    currency: "INR",
    images: [hotelRoom2, hotelRoom1, hotelRoom3],
    amenities: ["WiFi", "Coffee Bar", "Art Gallery", "Rooftop Terrace", "Bike Rental"],
    category: "boutique",
    instantBook: true,
    freeCancellation: false,
    coordinates: { lat: 40.7128, lng: -74.006 },
    highlights: ["Local Art Collection", "Rooftop Bar", "Historic Building", "Artisan Breakfast"],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Non-refundable. Changes allowed up to 24 hours before check-in.",
    },
    host: {
      name: "James Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
      responseRate: 95,
      responseTime: "within 2 hours",
    },
    rooms: [
      {
        id: "r4",
        title: "Artist Loft",
        description: "Unique loft space with exposed brick and original artwork.",
        capacity: 2,
        beds: "1 Queen Bed",
        size: 35,
        pricePerNight: 199,
        amenities: ["City View", "Work Desk", "Espresso Machine", "Record Player"],
        images: [hotelRoom2],
        available: true,
      },
    ],
  },
  {
    id: "3",
    name: "Metro Business Hotel",
    slug: "metro-business-hotel",
    location: "Financial District",
    city: "Chicago",
    country: "USA",
    description: "Modern business hotel with state-of-the-art meeting facilities, high-speed connectivity, and convenient location near major corporate offices.",
    rating: 4.5,
    reviewCount: 456,
    pricePerNight: 159,
    currency: "INR",
    images: [hotelRoom3, hotelRoom1, hotelRoom2],
    amenities: ["WiFi", "Business Center", "Gym", "Meeting Rooms", "Airport Shuttle", "Dry Cleaning"],
    category: "business",
    instantBook: true,
    freeCancellation: true,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    highlights: ["24/7 Business Center", "Express Check-in", "Airport Shuttle", "Executive Lounge"],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
    },
    host: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      responseRate: 99,
      responseTime: "within 30 minutes",
    },
    rooms: [
      {
        id: "r5",
        title: "Executive Room",
        description: "Efficient workspace with ergonomic desk and high-speed internet.",
        capacity: 2,
        beds: "1 King Bed",
        size: 32,
        pricePerNight: 159,
        amenities: ["City View", "Work Desk", "Dual Monitors", "Mini Fridge"],
        images: [hotelRoom3],
        available: true,
      },
    ],
  },
  {
    id: "4",
    name: "Family Paradise Resort",
    slug: "family-paradise-resort",
    location: "Theme Park District",
    city: "Orlando",
    country: "USA",
    description: "The ultimate family destination with water parks, kids clubs, and entertainment for all ages. Adjacent to major theme parks.",
    rating: 4.6,
    reviewCount: 892,
    pricePerNight: 229,
    currency: "INR",
    images: [hotelRoom1, hotelRoom3, hotelRoom2],
    amenities: ["Water Park", "Kids Club", "Playground", "Game Room", "Multiple Pools", "Character Dining"],
    category: "family",
    instantBook: true,
    freeCancellation: true,
    coordinates: { lat: 28.3852, lng: -81.5639 },
    highlights: ["On-site Water Park", "Free Theme Park Shuttle", "Kids Eat Free", "Evening Entertainment"],
    policies: {
      checkIn: "4:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 72 hours before check-in",
    },
    host: {
      name: "The Wilson Family",
      avatar: "https://i.pravatar.cc/150?img=8",
      responseRate: 92,
      responseTime: "within 4 hours",
    },
    rooms: [
      {
        id: "r6",
        title: "Family Suite",
        description: "Spacious suite with separate kids area and bunk beds.",
        capacity: 6,
        beds: "1 King + 2 Bunk Beds",
        size: 75,
        pricePerNight: 229,
        amenities: ["Pool View", "Kids Area", "Gaming Console", "Mini Kitchen", "Laundry"],
        images: [hotelRoom1],
        available: true,
      },
    ],
  },
  {
    id: "5",
    name: "Budget Stay Inn",
    slug: "budget-stay-inn",
    location: "Near Airport",
    city: "Los Angeles",
    country: "USA",
    description: "Clean, comfortable, and affordable. Perfect for travelers who want a no-frills stay with all the essentials.",
    rating: 4.2,
    reviewCount: 1234,
    pricePerNight: 79,
    currency: "INR",
    images: [hotelRoom2, hotelRoom3, hotelRoom1],
    amenities: ["WiFi", "Parking", "24/7 Front Desk", "Vending Machines", "Laundry"],
    category: "budget",
    instantBook: true,
    freeCancellation: true,
    coordinates: { lat: 33.9425, lng: -118.408 },
    highlights: ["Free Parking", "24/7 Check-in", "Airport Nearby", "Pet Friendly"],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
    },
    host: {
      name: "Mike Brown",
      avatar: "https://i.pravatar.cc/150?img=12",
      responseRate: 88,
      responseTime: "within a day",
    },
    rooms: [
      {
        id: "r7",
        title: "Standard Room",
        description: "Comfortable room with all the essentials for a good night's sleep.",
        capacity: 2,
        beds: "1 Queen Bed",
        size: 22,
        pricePerNight: 79,
        amenities: ["TV", "AC", "WiFi", "Private Bathroom"],
        images: [hotelRoom2],
        available: true,
      },
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "rev1",
    hotelId: "1",
    userId: "u1",
    userName: "Emily R.",
    userAvatar: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    comment: "Absolutely stunning views and impeccable service. The spa was divine and the restaurant exceeded expectations. Will definitely return!",
    date: "2024-11-15",
    helpful: 24,
  },
  {
    id: "rev2",
    hotelId: "1",
    userId: "u2",
    userName: "Michael T.",
    userAvatar: "https://i.pravatar.cc/150?img=22",
    rating: 5,
    comment: "Perfect honeymoon destination. The private beach was so peaceful, and the staff made us feel special at every turn.",
    date: "2024-11-10",
    helpful: 18,
  },
  {
    id: "rev3",
    hotelId: "1",
    userId: "u3",
    userName: "Sarah L.",
    userAvatar: "https://i.pravatar.cc/150?img=25",
    rating: 4,
    comment: "Great location and beautiful rooms. Only minor issue was slow WiFi in the evening, but overall a wonderful stay.",
    date: "2024-11-05",
    helpful: 12,
  },
];

export const categories = [
  { id: "budget", name: "Budget", icon: "💰", description: "Great value stays" },
  { id: "boutique", name: "Boutique", icon: "🎨", description: "Unique character" },
  { id: "business", name: "Business", icon: "💼", description: "Work-ready spaces" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦", description: "Kid-friendly fun" },
  { id: "luxury", name: "Luxury", icon: "✨", description: "Premium experience" },
];

export const popularDestinations = [
  { city: "Miami", country: "USA", image: "🌴", hotelCount: 234 },
  { city: "New York", country: "USA", image: "🗽", hotelCount: 567 },
  { city: "Los Angeles", country: "USA", image: "🎬", hotelCount: 389 },
  { city: "Paris", country: "France", image: "🗼", hotelCount: 445 },
  { city: "Tokyo", country: "Japan", image: "🏯", hotelCount: 312 },
  { city: "London", country: "UK", image: "🎡", hotelCount: 498 },
];
