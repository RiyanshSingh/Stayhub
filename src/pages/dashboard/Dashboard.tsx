import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar, CreditCard, Heart, Bell, MessageSquare,
    User, Shield, Star, HelpCircle, Settings, FileText, UserCheck,
    LogOut, Menu, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Import sections
import {
    MyBookings, PaymentHistory, Wishlist, Notifications, Messages,
    ProfileDetails, SecuritySettings, MyReviews, HelpCenter, Preferences, SavedIDs, MyProperties
} from "./DashboardComponents";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get active tab from URL or default to "profile"
    const activeTab = searchParams.get("tab") || "profile";
    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    const menuItems = [
        { id: "bookings", label: "My Bookings", icon: Calendar, component: <MyBookings /> },
        { id: "my-properties", label: "My Properties", icon: Building2, component: <MyProperties /> },
        { id: "payments", label: "Payment History", icon: CreditCard, component: <PaymentHistory /> },
        { id: "wishlist", label: "Wishlist", icon: Heart, component: <Wishlist /> },
        { id: "notifications", label: "Notifications", icon: Bell, component: <Notifications /> },
        { id: "messages", label: "Messages", icon: MessageSquare, component: <Messages /> },
        { id: "profile", label: "Profile Details", icon: User, component: <ProfileDetails /> },
        { id: "security", label: "Security Settings", icon: Shield, component: <SecuritySettings /> },
        { id: "reviews", label: "My Reviews", icon: Star, component: <MyReviews /> },
        { id: "help", label: "Help Center", icon: HelpCircle, component: <HelpCenter /> },
        { id: "preferences", label: "Preferences", icon: Settings, component: <Preferences /> },
        { id: "ids", label: "Saved ID Documents", icon: UserCheck, component: <SavedIDs /> },
    ];

    const activeComponent = menuItems.find(item => item.id === activeTab)?.component;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-20 md:pt-24 pb-16 min-h-[calc(100vh-80px)]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden mb-4">
                            <Button variant="outline" className="w-full justify-between" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <span>Menu</span>
                                <Menu className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Sidebar */}
                        <aside className={cn(
                            "w-full md:w-64 flex-shrink-0 bg-card border border-border rounded-xl h-fit sticky top-24 transition-all duration-300",
                            !isMobileMenuOpen && "hidden md:block"
                        )}>
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center gap-3 mb-1">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-secondary" />
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold truncate">{user.name}</h3>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-2 space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            activeTab === item.id
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                                <div className="pt-2 mt-2 border-t border-border">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </button>
                                </div>
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-card border border-border rounded-xl p-6 md:p-8 min-h-[500px]"
                            >
                                {activeComponent}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
