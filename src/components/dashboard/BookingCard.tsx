import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
    Calendar, MapPin, MoreVertical,
    CheckCircle, XCircle, Clock, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const BookingCard = ({ booking }: { booking: any }) => {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <div
            onClick={() => navigate(`/dashboard/bookings/${booking.id}`)}
            className="group relative bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-48 md:h-32 rounded-xl overflow-hidden shrink-0">
                    <img
                        src={booking.property_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?autopformat&fit=crop&w=800&q=60"}
                        alt={booking.property_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className={getStatusColor(booking.status)}>
                                    {booking.status}
                                </Badge>
                                <span className="text-xs text-gray-400">#{booking.id}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {booking.property_name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {booking.location || "Location unavailable"}
                            </div>
                        </div>

                        {/* Mobile Action Menu */}
                        <div className="md:hidden" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/bookings/${booking.id}`)}>
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-2 border-y border-gray-50">
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Check In</p>
                            <p className="font-medium text-sm flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                {format(new Date(booking.check_in), "MMM dd, yyyy")}
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Check Out</p>
                            <p className="font-medium text-sm flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                {format(new Date(booking.check_out), "MMM dd, yyyy")}
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                            <p className="font-bold text-sm text-primary">
                                ₹{booking.total_price.toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-0.5 hidden lg:block">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Action</p>
                            <p className="text-sm text-primary font-medium flex items-center">
                                View Details &rarr;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
