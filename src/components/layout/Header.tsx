import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Building2, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

const Header = ({ variant = "solid" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for transparent header
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  const isTransparent = variant === "transparent" && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-card/95 backdrop-blur-xl shadow-card border-b border-border/50"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "text-xl font-bold hidden sm:block transition-colors",
                isTransparent ? "text-card" : "text-foreground"
              )}
            >
              StayHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/search"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isTransparent ? "text-card/90" : "text-muted-foreground"
              )}
            >
              Explore
            </Link>
            <Link
              to="/search?category=deals"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isTransparent ? "text-card/90" : "text-muted-foreground"
              )}
            >
              Deals
            </Link>
            <Link
              to="/owner"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isTransparent ? "text-card/90" : "text-muted-foreground"
              )}
            >
              List Your Property
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={isTransparent ? "glass" : "ghost"}
              size="icon"
              className="rounded-full"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant={isTransparent ? "hero" : "outline"}
              className="rounded-full gap-2"
            >
              <User className="w-4 h-4" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant={isTransparent ? "glass" : "ghost"}
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/search"
                className="flex items-center gap-3 py-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                Explore Hotels
              </Link>
              <Link
                to="/owner"
                className="flex items-center gap-3 py-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="w-5 h-5" />
                List Your Property
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 py-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Saved
              </Link>
              <div className="pt-4 border-t border-border">
                <Button className="w-full" size="lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
