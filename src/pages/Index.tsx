import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      <main className="container mx-auto px-4">
        <HeroSection />
        <FeaturesGrid />
      </main>
    </div>
  );
};

export default Index;
