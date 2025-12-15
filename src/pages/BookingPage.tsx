import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Star, MapPin, Shield, CreditCard, Calendar, Users, CheckCircle, Lock, Smartphone, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { Textarea } from "@/components/ui/textarea";

const BookingPage = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple' | 'upi' | 'banking'>('card');
    const [specialRequests, setSpecialRequests] = useState("");

    // Guest checkout state
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");

    // State from navigation
    const bookingData = location.state;

    useEffect(() => {
        if (!bookingData) {
            // If accessed directly without state, go back
            navigate(`/hotel/${slug}`);
        }
    }, [bookingData, navigate, slug]);

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");

    if (!bookingData) return null;

    const { safeHotel, checkIn, checkOut, guests, nights, totalPrice, cleaningFee, serviceFee, extraGuestFee } = bookingData;

    const handleConfirmPay = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {

            const token = localStorage.getItem("auth_token");
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Validate guest details
            if (!isAuthenticated) {
                if (!guestName || !guestEmail || !guestPhone) {
                    toast({
                        title: "Guest Details Required",
                        description: "Please fill in your contact information.",
                        variant: "destructive"
                    });
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    property_id: safeHotel?.id,
                    property_name: safeHotel?.name,
                    property_image: safeHotel?.images[0],
                    check_in: checkIn,
                    check_out: checkOut,
                    guests: guests,
                    total_price: totalPrice,
                    nights: nights,
                    payment_method: paymentMethod,
                    special_requests: specialRequests,
                    // Guest details
                    guest_name: guestName,
                    guest_email: guestEmail,
                    guest_phone: guestPhone
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Booking failed");
            }

            // Show success view instead of redirecting
            setBookingSuccess(true);
            window.scrollTo(0, 0);

        } catch (error: any) {
            console.error("Booking Error:", error);
            toast({
                title: "Payment Failed",
                description: error.message || "Could not process your payment. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4 pt-24">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                        <p className="text-muted-foreground text-lg">
                            You're all set! A confirmation email has been sent to {user?.email}.
                        </p>

                        <div className="bg-card border border-border rounded-xl p-6 text-left shadow-sm">
                            <div className="flex gap-4 mb-4">
                                <img src={safeHotel.images[0]} alt={safeHotel.name} className="w-20 h-20 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold">{safeHotel.name}</h3>
                                    <p className="text-sm text-muted-foreground">{safeHotel.city}, {safeHotel.country}</p>
                                </div>
                            </div>
                            <Separator className="mb-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Check-in</span>
                                    <span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Check-out</span>
                                    <span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Guests</span>
                                    <span className="font-medium">{guests}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-muted-foreground">Total Paid</span>
                                    <span className="font-bold">₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
                                Go to My Bookings
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" onClick={() => {
                                const query = safeHotel.coordinates
                                    ? `${safeHotel.coordinates.lat},${safeHotel.coordinates.lng}`
                                    : `${safeHotel.name}, ${safeHotel.city}`;
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                            }}>
                                <MapPin className="w-4 h-4 mr-2" />
                                Get Directions
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to property
                    </Button>

                    <h1 className="text-3xl font-bold mb-8">Confirm and pay</h1>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Column: Trip Details & Payment */}
                        <div className="space-y-8">

                            {/* Trip Details */}
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Your trip</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium">Dates</h3>
                                            <p className="text-muted-foreground">{new Date(checkIn).toLocaleDateString()} – {new Date(checkOut).toLocaleDateString()}</p>
                                        </div>
                                        <Button variant="link" className="h-auto p-0" onClick={() => navigate(-1)}>Edit</Button>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium">Guests</h3>
                                            <p className="text-muted-foreground">{guests} guest{guests > 1 ? 's' : ''}</p>
                                        </div>
                                        <Button variant="link" className="h-auto p-0" onClick={() => navigate(-1)}>Edit</Button>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="pt-4 border-t border-border mt-4">
                                        <h3 className="font-medium mb-3">Special Requests</h3>
                                        <Textarea
                                            placeholder="e.g. Late check-in, quiet room, extra pillows... (Optional)"
                                            className="resize-none"
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* Guest Details (only if not logged in) */}
                            {!isAuthenticated && (
                                <section className="py-2">
                                    <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                                placeholder="John Doe"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    type="tel"
                                                    placeholder="+91 99999 99999"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                                            We'll send your booking confirmation to this email. You can create an account later.
                                        </div>
                                    </div>
                                    <Separator className="mt-8" />
                                </section>
                            )}

                            {/* Payment Element */}
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Pay with</h2>

                                {/* Payment Method Selector */}
                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className="text-sm font-medium">Card</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <span className={`font-bold ${paymentMethod === 'paypal' ? 'text-primary' : 'text-muted-foreground'}`}>Pay<span className="italic">Pal</span></span>
                                        <span className="text-sm font-medium">PayPal</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className="text-sm font-medium">UPI</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('banking')}
                                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'banking' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <Landmark className={`w-6 h-6 ${paymentMethod === 'banking' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className="text-sm font-medium">Net Banking</span>
                                    </button>
                                </div>

                                {paymentMethod === 'card' && (
                                    <form onSubmit={handleConfirmPay} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="0000 0000 0000 0000"
                                                    className="pl-10"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Expiration</Label>
                                                <Input
                                                    placeholder="MM / YY"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>CVC</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="123"
                                                        className="pl-10"
                                                        value={cvc}
                                                        onChange={(e) => setCvc(e.target.value)}
                                                        maxLength={4}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Name on card</Label>
                                            <Input
                                                placeholder="Checking Account Name"
                                                value={nameOnCard}
                                                onChange={(e) => setNameOnCard(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <Separator className="my-6" />

                                        <h2 className="text-xl font-semibold mb-4">Start Booking</h2>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            By selecting the button below, you agree to the Host's House Rules, Ground rules for guests, and that StayHub can charge your payment method if you're responsible for damage.
                                        </p>

                                        <Button type="submit" size="xl" className="w-full text-lg h-14 rounded-xl" disabled={loading}>
                                            {loading ? "Processing..." : "Confirm and pay"}
                                        </Button>
                                    </form>
                                )}

                                {paymentMethod === 'upi' && (
                                    <form onSubmit={handleConfirmPay} className="space-y-4">
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border mb-4">
                                            <p className="text-sm text-muted-foreground mb-2">Supported apps</p>
                                            <div className="flex gap-4 opacity-70">
                                                <span className="font-bold">GPay</span>
                                                <span className="font-bold">PhonePe</span>
                                                <span className="font-bold">Paytm</span>
                                                <span className="font-bold">BHIM</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>UPI ID</Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="username@bank"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">A payment request will be sent to your UPI app.</p>
                                        </div>
                                        <Button type="submit" size="xl" className="w-full text-lg h-14 rounded-xl mt-6" disabled={loading}>
                                            {loading ? "Processing..." : "Pay with UPI"}
                                        </Button>
                                    </form>
                                )}

                                {paymentMethod === 'banking' && (
                                    <form onSubmit={handleConfirmPay} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Select Bank</Label>
                                            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                                <option value="">Select your bank</option>
                                                <option value="hdfc">HDFC Bank</option>
                                                <option value="sbi">State Bank of India</option>
                                                <option value="icici">ICICI Bank</option>
                                                <option value="axis">Axis Bank</option>
                                                <option value="kotak">Kotak Mahindra Bank</option>
                                            </select>
                                        </div>
                                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-sm">
                                            You will be redirected to your bank's secure login page to complete the payment.
                                        </div>
                                        <Button type="submit" size="xl" className="w-full text-lg h-14 rounded-xl mt-6" disabled={loading}>
                                            {loading ? "Processing..." : "Proceed to Payment"}
                                        </Button>
                                    </form>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="text-center p-8 border border-dashed border-border rounded-xl">
                                        <p className="text-muted-foreground mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                                        <Button size="xl" className="w-full text-lg h-14 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white" onClick={() => handleConfirmPay()} disabled={loading}>
                                            {loading ? "Processing..." : "Continue with PayPal"}
                                        </Button>
                                    </div>
                                )}

                                {paymentMethod === 'apple' && (
                                    <div className="text-center p-8 border border-dashed border-border rounded-xl">
                                        <p className="text-muted-foreground mb-4">Use Apple Pay for a fast and secure checkout.</p>
                                        <Button size="xl" className="w-full text-lg h-14 rounded-xl bg-black hover:bg-black/90 text-white" onClick={() => handleConfirmPay()} disabled={loading}>
                                            {loading ? "Processing..." : "Pay with Apple Pay"}
                                        </Button>
                                    </div>
                                )}

                            </section>
                        </div>

                        {/* Right Column: Hotel Summary */}
                        <div className="lg:pl-12">
                            <div className="bg-card border border-border rounded-2xl p-6 sticky top-32 shadow-sm">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                        <img src={safeHotel.images[0]} alt={safeHotel.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium mb-1">{safeHotel.type}</p>
                                        <h3 className="font-medium text-base line-clamp-2">{safeHotel.name}</h3>
                                        <div className="flex items-center gap-1 text-sm mt-1">
                                            <Star className="w-3 h-3 fill-primary text-primary" />
                                            <span className="font-medium">{safeHotel.rating}</span>
                                            <span className="text-muted-foreground">({safeHotel.reviewCount} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="py-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Price details</h3>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>₹{safeHotel.pricePerNight} x {nights} nights</span>
                                        <span>₹{safeHotel.pricePerNight * nights}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Cleaning fee</span>
                                        <span>₹{cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Service fee</span>
                                        <span>₹{serviceFee}</span>
                                    </div>
                                    {extraGuestFee > 0 && (
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Extra guest fee</span>
                                            <span>₹{extraGuestFee}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between font-bold text-lg pt-4">
                                    <span>Total (INR)</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingPage;
