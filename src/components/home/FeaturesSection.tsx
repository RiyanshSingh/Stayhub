import { Shield, Clock, Tag, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <Shield className="w-10 h-10 text-primary" />,
        title: "Secure Booking",
        description: "Your payments and personal information are always protected with industry-standard security."
    },
    {
        icon: <Clock className="w-10 h-10 text-primary" />,
        title: "Fast & Easy",
        description: "Book your perfect stay in just a few clicks. Instant confirmation, no hassle."
    },
    {
        icon: <Tag className="w-10 h-10 text-primary" />,
        title: "Best Prices",
        description: "We guarantee the best rates. Found a lower price? We'll match it."
    },
    {
        icon: <Globe className="w-10 h-10 text-primary" />,
        title: "Global Reach",
        description: "Explore unique stays in over 190 countries and secure your spot anywhere."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose StayHub?</h2>
                    <p className="text-muted-foreground">
                        We simplify your travel experience with features designed for peace of mind and ease of use.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
