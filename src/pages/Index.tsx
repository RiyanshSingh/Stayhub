import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import TrendingHotels from "@/components/home/TrendingHotels";
import DestinationsSection from "@/components/home/DestinationsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />
      <main>
        <HeroSection />
        <CategorySection />
        <TrendingHotels />
        <DestinationsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
