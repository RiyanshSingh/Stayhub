import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const OwnerLanding = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Maximize Revenue",
      description: "Smart pricing tools and demand insights to optimize your earnings",
    },
    {
      icon: Users,
      title: "Reach Millions",
      description: "Connect with travelers from 120+ countries worldwide",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with guaranteed payouts",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Quick sign-up with identity verification for trust and safety",
    },
    {
      number: "02",
      title: "List Your Property",
      description: "Add photos, descriptions, room types, and set your pricing",
    },
    {
      number: "03",
      title: "Start Hosting",
      description: "Receive bookings, manage guests, and grow your business",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                For Property Owners
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Turn your property into a{" "}
                <span className="text-primary">thriving business</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 15,000+ hotel owners who trust StayHub to connect with millions
                of travelers. Easy setup, powerful tools, dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" size="xl" className="rounded-xl" asChild>
                  <Link to="/add-property">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="rounded-xl">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15K+", label: "Active Hotels" },
              { value: "$50M+", label: "Paid to Hosts" },
              { value: "2.5M+", label: "Happy Guests" },
              { value: "4.8", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why hosts love StayHub
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed as a hotel owner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple onboarding process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-border" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="accent" size="xl" className="rounded-xl" asChild>
              <Link to="/add-property">
                Start Listing Your Property
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="text-5xl mb-6">💬</div>
              <blockquote className="text-xl md:text-2xl text-primary-foreground mb-6 leading-relaxed">
                "StayHub transformed my small boutique hotel into a thriving business.
                The booking tools are intuitive, and the support team is incredible.
                My occupancy rate increased by 40% in just 6 months!"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="Maria Santos"
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold text-primary-foreground">
                    Maria Santos
                  </div>
                  <div className="text-sm text-primary-foreground/70">
                    Ocean View Resort, Miami
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to grow your hotel business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful hotel owners. No upfront costs, no commitments.
            </p>
            <Button variant="accent" size="xl" className="rounded-xl" asChild>
              <Link to="/add-property">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Badge component for this page
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium ${className}`}>
    {children}
  </span>
);

export default OwnerLanding;
