import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Calendar, MapPin, Download, MessageSquare,
    AlertTriangle, Check, CreditCard, Clock, Star, HelpCircle
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { downloadInvoice } from "@/utils/invoiceGenerator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch(`/api/bookings/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setBooking(data);
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBooking();
    }, [id]);

    const handleCancelBooking = async () => {
        setIsCancelling(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/bookings/${id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (response.ok) {
                // Refresh booking data
                const updatedBooking = { ...booking, status: 'cancelled' };
                setBooking(updatedBooking);
                setShowCancelDialog(false);
            }
        } catch (error) {
            console.error("Error cancelling:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleDownloadInvoice = () => {
        downloadInvoice(booking);
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!booking) return <div className="p-8 text-center">Booking not found.</div>;

    const isPastCheckIn = new Date(booking.check_in) < new Date();
    const canCancel = booking.status === 'confirmed' && !isPastCheckIn;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" className="mb-4 pl-0" onClick={() => navigate("/dashboard?tab=bookings")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Bookings
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">Booking #{booking.id.toString().padStart(6, '0')}</h1>
                            <Badge variant={booking.status === 'confirmed' ? "default" : "secondary"} className="text-sm">
                                {booking.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Booked on {format(new Date(booking.created_at), "MMM dd, yyyy")}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Hotel
                        </Button>
                        <Button variant="outline" onClick={handleDownloadInvoice}>
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hotel Info */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={booking.property?.images?.[0] || booking.property_image}
                                    alt={booking.property_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">{booking.property_name}</h2>
                                <p className="text-muted-foreground flex items-center mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {booking.property?.location}, {booking.property?.city}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase">Check In</p>
                                        <p className="font-semibold">{format(new Date(booking.check_in), "EEE, MMM dd")}</p>
                                        <p className="text-sm text-muted-foreground">3:00 PM</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase">Check Out</p>
                                        <p className="font-semibold">{format(new Date(booking.check_out), "EEE, MMM dd")}</p>
                                        <p className="text-sm text-muted-foreground">11:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Timeline */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Booking Timeline</h3>
                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-2">
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white ring-2 ring-gray-100"></div>
                                <p className="font-medium text-sm">Booking Created</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(booking.created_at), "MMM dd, hh:mm a")}</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white ring-2 ring-gray-100"></div>
                                <p className="font-medium text-sm">Payment Confirmed</p>
                                <p className="text-xs text-muted-foreground">Transaction ID: {booking.transaction_id || "N/A"}</p>
                            </div>
                            {booking.status === 'cancelled' && (
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white ring-2 ring-gray-100"></div>
                                    <p className="font-medium text-sm text-red-600">Booking Cancelled</p>
                                    <p className="text-xs text-muted-foreground">Reason: {booking.cancellation_reason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Guest Information */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Guest Information</h3>
                        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="font-bold">G</span>
                                </div>
                                <div>
                                    <p className="font-medium">Primary Guest</p>
                                    <p className="text-sm text-muted-foreground">{booking.guests} Guests</p>
                                </div>
                            </div>
                            <Button variant="ghost" disabled>Edit</Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Breakdown */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
                        <div className="space-y-3 pb-4 border-b">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">₹{booking.total_price / booking.nights} × {booking.nights} nights</span>
                                <span>₹{booking.total_price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taxes & Fees</span>
                                <span>₹0.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold pt-4 text-lg">
                            <span>Total</span>
                            <span>₹{booking.total_price}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground flex gap-2">
                            <CreditCard className="w-4 h-4" /> Paid with {booking.payment_method || "Credit Card"}
                        </div>
                    </div>

                    {/* Actions */}
                    {canCancel && (
                        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
                            <h3 className="font-bold text-sm mb-2 uppercase text-muted-foreground">Booking Management</h3>
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={() => setShowCancelDialog(true)}
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Cancel Booking
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                                Free cancellation until {format(new Date(booking.check_in), "MMM dd")}.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your stay at {booking.property_name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Reason for cancellation</label>
                        <Textarea
                            placeholder="Please tell us why you are cancelling..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Booking</Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelBooking}
                            disabled={isCancelling || !cancelReason}
                        >
                            {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingDetails;
