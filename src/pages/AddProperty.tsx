import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, DollarSign, FileText, Check, Plus, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useProperty } from "@/context/PropertyContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Hotel } from "@/data/mockData";

const AddProperty = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { addProperty } = useProperty();
    const { isAuthenticated, user } = useAuth(); // Auth check
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auth redirection
    useEffect(() => {
        if (user === null && !localStorage.getItem("auth_token")) {
            navigate("/signin");
            toast({
                title: "Authentication Required",
                description: "Please sign in to list your property.",
                variant: "destructive"
            });
        }
    }, [user, navigate, toast]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        address: "",
        city: "",
        country: "",
        description: "",
        price: "",
        currency: "INR",
    });
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCurrencyChange = (value: string) => {
        setFormData(prev => ({ ...prev, currency: value }));
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        if (checked) {
            setSelectedAmenities(prev => [...prev, amenity]);
        } else {
            setSelectedAmenities(prev => prev.filter(item => item !== amenity));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(prev => {
            const newImages = [...prev];
            newImages.splice(indexToRemove, 1);
            return newImages;
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newProperty: any = {
            name: formData.name,
            location: formData.address,
            city: formData.city,
            country: formData.country,
            description: formData.description,
            price: Number(formData.price),
            currency: formData.currency,
            images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"],
            amenities: selectedAmenities,
            type: formData.type,
            category: "luxury", // simplified
        };

        try {
            await addProperty(newProperty);
            toast({
                title: "Property Listed Successfully!",
                description: "Your property is now live in the Explore section.",
            });
            navigate("/dashboard"); // Redirect to Dashboard My Properties
        } catch (error) {
            toast({
                title: "Error listing property",
                description: "Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const amenitiesList = [
        "WiFi", "Parking", "Pool", "Gym", "Spa", "Restaurant",
        "Room Service", "Bar", "Beach Access", "Air Conditioning"
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property</h1>
                            <p className="text-muted-foreground">Fill in the details below to start hosting on StayHub</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Property Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Property Name</Label>
                                        <Input id="name" placeholder="e.g. Ocean View Resort" required value={formData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Property Type</Label>
                                        <Input id="type" placeholder="e.g. Hotel, Villa, Apartment" required value={formData.type} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Location
                                </h2>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Input id="address" placeholder="123 Seaside Blvd, Miami, FL" required value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Miami" required value={formData.city} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" placeholder="USA" required value={formData.country} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Description
                                </h2>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Tell guests about your place</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the unique features, ambiance, and surroundings..."
                                        className="min-h-[120px]"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Pricing
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price per Night (₹)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                            <Input
                                                id="price"
                                                type="number"
                                                className="pl-8"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                                            <SelectTrigger id="currency">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR (₹)</SelectItem>
                                                <SelectItem value="USD">USD (₹)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                                <SelectItem value="AUD">AUD ($)</SelectItem>
                                                <SelectItem value="CAD">CAD ($)</SelectItem>
                                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" />
                                    Amenities
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {amenitiesList.map((amenity) => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={amenity}
                                                checked={selectedAmenities.includes(amenity)}
                                                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                                            />
                                            <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                                                {amenity}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    Photos
                                </h2>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div
                                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
                                    onClick={triggerFileInput}
                                >
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="font-medium">Click to upload photos</span>
                                        <span className="text-xs">or drag and drop</span>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                <img
                                                    src={image}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button size="xl" className="w-full rounded-xl" disabled={loading}>
                                    {loading ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            List Property
                                        </>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AddProperty;
