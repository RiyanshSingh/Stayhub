import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">StayHub</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Find the perfect room — from cosy stays to business-ready hotels. Book fast. Stay safe.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="/about" className="hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-background transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-background transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-background transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="/help" className="hover:text-background transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="hover:text-background transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-background transition-colors">
                  Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="font-semibold mb-4">Hosting</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="/owner" className="hover:text-background transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/owner/resources" className="hover:text-background transition-colors">
                  Host Resources
                </Link>
              </li>
              <li>
                <Link to="/owner/community" className="hover:text-background transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/owner/responsible" className="hover:text-background transition-colors">
                  Responsible Hosting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>© 2024 StayHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-background transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-background transition-colors">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:text-background transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
