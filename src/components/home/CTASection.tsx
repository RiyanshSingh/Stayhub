import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const benefits = [
    "Reach millions of travelers worldwide",
    "Easy onboarding and listing setup",
    "Secure payments and protection",
    "24/7 host support",
  ];

  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-card/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/10 text-card/90 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              For Property Owners
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Turn your property into a{" "}
              <span className="text-accent">revenue stream</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of hotel owners who trust StayHub to connect with travelers. 
              Easy setup, powerful tools, and dedicated support.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 text-primary-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </ul>

            <Button
              variant="accent"
              size="xl"
              asChild
              className="rounded-xl"
            >
              <Link to="/owner">
                Add Your Hotel
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <div className="relative">
              {/* Mock dashboard preview */}
              <div className="bg-card rounded-2xl shadow-xl p-6 transform rotate-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Owner Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Manage your properties</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 bg-muted rounded-full w-full" />
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">89%</div>
                      <div className="text-xs text-muted-foreground">Occupancy</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-accent">$12K</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-success">4.9</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative card */}
              <div className="absolute -bottom-6 -left-6 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg p-4 transform -rotate-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">New Booking!</div>
                    <div className="text-xs text-muted-foreground">Ocean Suite • 3 nights</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
