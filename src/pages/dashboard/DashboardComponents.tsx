import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Heart, Bell, MessageSquare, User, Shield, Star, HelpCircle, Settings, FileText, UserCheck, Plus, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/context/PropertyContext";
import { useTheme } from "@/context/ThemeContext";
import HotelCard from "@/components/hotels/HotelCard";
import BookingCard from "@/components/dashboard/BookingCard";
import { downloadInvoice } from "@/utils/invoiceGenerator";
import { format } from "date-fns";




const SectionHeader = ({ title, description }: { title: string, description: string }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export const MyBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch('/api/bookings/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div>
            <SectionHeader title="My Bookings" description="View and manage your upcoming and past stays." />
            {bookings.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't made any reservations yet. Start exploring!</p>
                    <Button variant="outline" asChild>
                        <Link to="/search">Browse Hotels</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const PaymentHistory = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch('/api/bookings/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                }
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div>
            <SectionHeader title="Payment History" description="Check your past transactions and billing details." />
            {loading ? (
                <div>Loading transactions...</div>
            ) : payments.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">Your payment history will appear here once you make a booking.</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Description</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Transaction ID</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {format(new Date(payment.created_at), "MMM dd, yyyy")}
                                            <div className="text-xs text-muted-foreground">{format(new Date(payment.created_at), "hh:mm a")}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {payment.property_name}
                                            <div className="text-xs text-muted-foreground">{payment.nights} nights</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{payment.transaction_id || "N/A"}</td>
                                        <td className="px-6 py-4 font-bold">₹{payment.total_price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => downloadInvoice(payment)}>
                                                <Link to="#" onClick={(e) => e.preventDefault()}>Download</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Wishlist = () => {
    const { wishlist, loading } = useProperty(); // Use global context

    return (
        <div>
            <SectionHeader title="Wishlist" description="Properties you've saved for later." />
            {loading ? (
                <div>Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">Save properties you love to find them easily later.</p>
                    <Button variant="outline" asChild>
                        <Link to="/search">Explore Properties</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                </div>
            )}
        </div>
    );
};



export const Notifications = () => {
    const { session } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        // Mock notifications for now - will be replaced with Supabase table later
        setNotifications([
            { id: 1, title: "Welcome to StayHub!", message: "Your account has been created successfully.", is_read: 0, created_at: new Date().toISOString() },
        ]);
        setLoading(false);
    };

    const markAsRead = async (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Notifications" description="Stay updated with your activity." />
                {notifications.length > 0 && notifications.some(n => !n.is_read) && (
                    <Button variant="outline" size="sm" onClick={markAllRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">You're all caught up!</h3>
                        <p className="text-muted-foreground">No new notifications at the moment.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${notification.is_read
                                ? 'bg-card border-border'
                                : 'bg-primary/5 border-primary/20'
                                }`}
                        >
                            <div className={`p-2 rounded-full ${notification.is_read ? 'bg-secondary' : 'bg-primary/10 text-primary'}`}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className={`mt-1 text-sm ${notification.is_read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            {!notification.is_read && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => markAsRead(notification.id)}
                                    title="Mark as read"
                                >
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const Messages = () => (
    <div>
        <SectionHeader title="Messages" description="Chat with hosts and support." />
        <div className="bg-card border border-border rounded-xl p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages</h3>
            <p className="text-muted-foreground mb-4">You don't have any active conversations.</p>
            <Button variant="outline">Start Support Chat</Button>
        </div>
    </div>
);

// Imports needed: useState from 'react', useToast from hook.
// The file DashboardComponents.tsx exports multiple components.
// I will rewrite the ProfileDetails component fully.

export const ProfileDetails = () => {
    const { user, updateProfile } = useAuth();

    // Form State
    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState(user?.address || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");

    // UI State
    const [loading, setLoading] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState("");

    // Update local state when user context updates (e.g. after initial load)
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setAddress(user.address || "");
            setGender(user.gender || "");
            setAvatar(user.avatar || "");
        }
    }, [user]);

    const predefinedAvatars = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Callie",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit",
    ];

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        // Simple phone regex for validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (phone && !phoneRegex.test(phone)) newErrors.phone = "Invalid phone number format";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setSuccessMessage("");
        if (!validate()) return;

        setLoading(true);
        try {
            await updateProfile(name, phone, avatar, address, gender);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setErrors({ form: "Failed to update profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setAddress(user.address || "");
            setGender(user.gender || "");
            setAvatar(user.avatar || "");
            setErrors({});
            setSuccessMessage("");
        }
    };

    return (
        <div className="max-w-2xl">
            <SectionHeader title="Profile Details" description="Manage your personal information." />

            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-border/50">
                    <div className="relative group">
                        <img
                            src={avatar || user?.avatar}
                            alt={name}
                            className="w-24 h-24 rounded-full border-4 border-background shadow-sm object-cover"
                        />
                        <button
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-muted-foreground text-sm">{user?.email}</p>
                        <div className="mt-2 relative">
                            {showAvatarPicker && (
                                <div className="absolute top-2 left-0 md:left-auto mt-2 p-3 bg-popover border border-border rounded-xl shadow-xl z-20 grid grid-cols-4 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
                                    {predefinedAvatars.map((url) => (
                                        <button
                                            key={url}
                                            onClick={() => {
                                                setAvatar(url);
                                                setShowAvatarPicker(false);
                                            }}
                                            className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 ring-primary transition-all p-0.5"
                                        >
                                            <img src={url} alt="avatar" className="w-full h-full rounded-full" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="fullName"
                                className={`pl-9 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                className="pl-9 bg-muted/50"
                                value={email}
                                disabled
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender (Optional)</Label>
                        <select
                            id="gender"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Main St, City, Country"
                        />
                    </div>
                </div>

                {/* Feedback Messages */}
                {successMessage && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center">
                        <UserCheck className="w-4 h-4 mr-2" />
                        {successMessage}
                    </div>
                )}
                {errors.form && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        {errors.form}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                    <Button variant="ghost" onClick={handleDiscard} disabled={loading}>
                        Discard
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="min-w-[120px]">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const SecuritySettings = () => (
    <div className="max-w-xl">
        <SectionHeader title="Security Settings" description="Protect your account and data." />
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
            </div>
            <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
            </div>
            <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
            </div>
            <Button>Update Password</Button>

            <div className="pt-6 border-t border-border">
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <Button variant="outline"><Shield className="w-4 h-4 mr-2" /> Enable 2FA</Button>
            </div>
        </div>
    </div>
);

export const MyReviews = () => (
    <div>
        <SectionHeader title="My Reviews" description="Reviews you've written for stays." />
        <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews written</h3>
            <p className="text-muted-foreground mb-4">Share your experiences to help other travelers.</p>
        </div>
    </div>
);

export const HelpCenter = () => (
    <div>
        <SectionHeader title="Help Center" description="Get help with your account or bookings." />
        <div className="grid md:grid-cols-2 gap-4">
            {['Booking Issues', 'Account & Security', 'Payments & Refunds', 'Guide to StayHub'].map((topic) => (
                <div key={topic} className="p-6 border border-border rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                    <HelpCircle className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-medium">{topic}</h3>
                </div>
            ))}
        </div>
    </div>
);

export const Preferences = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div className="max-w-xl">
            <SectionHeader title="Preferences" description="Customize your experience." />
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive emails about your bookings.</p>
                    </div>
                    <div className="h-4 w-4 rounded border border-primary bg-primary" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred appearance.</p>
                    </div>
                    <div className="flex bg-muted rounded-lg p-1">
                        {['light', 'dark', 'system'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t as any)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${theme === t
                                    ? 'bg-background shadow-sm text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive offers and travel inspiration.</p>
                    </div>
                    <div className="h-4 w-4 rounded border border-border" />
                </div>
                <div className="space-y-2 pt-4">
                    <Label>Currency</Label>
                    <Input defaultValue="INR - Indian Rupee" />
                </div>
                <div className="space-y-2">
                    <Label>Language</Label>
                    <Input defaultValue="English (US)" />
                </div>
            </div>
        </div>
    );
};

export const SavedIDs = () => (
    <div className="max-w-2xl">
        <SectionHeader title="Saved IDs" description="Manage your government identification documents securely." />
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <p>ID verification feature coming soon.</p>
        </div>
    </div>
);

export const MyProperties = () => {
    const { userProperties, deleteProperty, loading } = useProperty();

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this property?")) {
            await deleteProperty(id);
        }
    };

    if (loading) return <div>Loading properties...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <SectionHeader title="My Properties" description="Manage your listed properties." />
                <Button asChild>
                    <Link to="/add-property">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                    </Link>
                </Button>
            </div>

            {userProperties.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                    <Button variant="outline" asChild>
                        <Link to="/add-property">Get Started</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {userProperties.map((property) => (
                        <div key={property.id} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-xl bg-card">
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{property.name}</h3>
                                    <p className="text-muted-foreground text-sm">{property.location}, {property.city}</p>
                                    <p className="font-medium mt-1">{property.currency} {property.pricePerNight} <span className="text-sm font-normal text-muted-foreground">/ night</span></p>
                                </div>
                                <div className="flex gap-2 mt-4 md:mt-0 self-end">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/hotel/${property.slug}`}>
                                            View
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/add-property?edit=${property.id}`}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(property.id)}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
