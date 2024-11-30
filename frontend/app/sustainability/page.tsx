import { HeroSection } from "@/components/sustainability/hero-section";
import { Initiatives } from "@/components/sustainability/initiatives";
import { ImpactMetrics } from "@/components/sustainability/impact-metrics";
import { MaterialsSection } from "@/components/sustainability/materials-section";
import { CircularEconomy } from "@/components/sustainability/circular-economy";
import { Certifications } from "@/components/sustainability/certifications";
import { Pledge } from "@/components/sustainability/pledge";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function SustainabilityPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <HeroSection />
      <Initiatives />
      <ImpactMetrics />
      <MaterialsSection />
      <CircularEconomy />
      <Certifications />
      <Pledge />
    </main>
    <Footer />
    </>
  );
}