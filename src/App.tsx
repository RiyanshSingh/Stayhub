import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Destinations from "./pages/Destinations";
import Wishlist from "./pages/Wishlist";
import SearchPage from "./pages/SearchPage";
import HotelDetail from "./pages/HotelDetail";
import OwnerLanding from "./pages/OwnerLanding";
import AddProperty from "./pages/AddProperty";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import BookingDetails from "./pages/dashboard/BookingDetails";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";
import { PropertyProvider } from "./context/PropertyContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <PropertyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <ChatWidget />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/hotel/:slug" element={<HotelDetail />} />
                <Route path="/book/:slug" element={<BookingPage />} />
                <Route path="/owner" element={<OwnerLanding />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/bookings/:id" element={<BookingDetails />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Footer Pages */}
                <Route path="/about" element={<StaticPage />} />
                <Route path="/careers" element={<StaticPage />} />
                <Route path="/press" element={<StaticPage />} />
                <Route path="/blog" element={<StaticPage />} />

                <Route path="/help" element={<StaticPage />} />
                <Route path="/contact" element={<StaticPage />} />
                <Route path="/cancellation" element={<StaticPage />} />
                <Route path="/safety" element={<StaticPage />} />

                <Route path="/owner/resources" element={<StaticPage />} />
                <Route path="/owner/community" element={<StaticPage />} />
                <Route path="/owner/responsible" element={<StaticPage />} />

                <Route path="/privacy" element={<StaticPage />} />
                <Route path="/terms" element={<StaticPage />} />
                <Route path="/sitemap" element={<StaticPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Analytics />
              <SpeedInsights />
            </BrowserRouter>
          </TooltipProvider>
        </PropertyProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
