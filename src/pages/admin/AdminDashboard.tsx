import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, LogOut, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Property {
    id: number;
    name: string;
    location: string;
    price: number;
    users: {
        name: string;
        email: string;
    };
    created_at: string;
    images: string[];
}

const AdminDashboard = () => {
    const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            navigate("/admin");
            return;
        }
        await fetchPendingProperties(token);
    };

    const fetchPendingProperties = async (token: string) => {
        try {
            const response = await fetch('/api/admin/properties/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                handleLogout();
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();

            if (Array.isArray(data)) {
                setPendingProperties(data);
            } else {
                setPendingProperties([]);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast({
                title: "Error",
                description: "Failed to load pending properties",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        const token = localStorage.getItem("admin_token");
        try {
            const response = await fetch(`/api/admin/properties/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast({
                    title: "Approved",
                    description: "Property is now live on the website",
                });
                // Remove from list
                setPendingProperties(prev => prev.filter(p => p.id !== id));
            } else {
                throw new Error("Approval failed");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not approve property",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage property approvals</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : pendingProperties.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-border">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold">All Caught Up!</h2>
                        <p className="text-muted-foreground">No pending properties to review.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingProperties.map((property) => (
                            <Card key={property.id} className="overflow-hidden">
                                <CardContent className="p-0 flex flex-col md:flex-row gap-4">
                                    {/* Image Thumbnail */}
                                    <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-muted relative">
                                        {property.images && property.images[0] ? (
                                            <img
                                                src={property.images[0]}
                                                alt={property.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-center">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{property.name}</h3>
                                                <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                                    {property.location}
                                                </p>
                                            </div>
                                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Pending
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                            <div>
                                                <span className="text-muted-foreground">Price:</span>
                                                <span className="font-semibold ml-2">₹{property.price}/night</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Host:</span>
                                                <span className="font-semibold ml-2">{property.users?.name || 'Unknown'} ({property.users?.email})</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => handleApprove(property.id)} className="bg-green-600 hover:bg-green-700 text-white">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve & Publish
                                            </Button>
                                            {/* We could add reject functionality here later */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
