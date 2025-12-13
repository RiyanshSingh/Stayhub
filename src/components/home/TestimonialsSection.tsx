import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Travel Enthusiast",
        image: "https://i.pravatar.cc/150?img=1",
        content: "StayHub made our family vacation absolutely seamless. The booking process was incredibly easy, and the property we found was even better than the photos!",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "Digital Nomad",
        image: "https://i.pravatar.cc/150?img=3",
        content: "I use StayHub for all my business trips. The reliable WiFi filter and 'Work Friendly' category save me so much time finding the right place.",
        rating: 5
    },
    {
        name: "Emily Davis",
        role: "Weekend Explorer",
        image: "https://i.pravatar.cc/150?img=5",
        content: "The variety of unique stays on this platform is unmatched. I've stayed in treehouses, lofts, and beachfront villas. Highly recommended!",
        rating: 4
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 md:py-24 bg-secondary/10">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Loved by Travelers</h2>
                    <p className="text-muted-foreground">
                        Don't just take our word for it. Here's what our community has to say about their StayHub experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 relative"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-foreground/80 mb-6 italic">"{review.content}"</p>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={review.image} alt={review.name} />
                                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold text-sm">{review.name}</h4>
                                    <p className="text-xs text-muted-foreground">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
