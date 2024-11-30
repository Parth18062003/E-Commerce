import { HeroSection } from "@/components/about/hero-section";
import { Timeline } from "@/components/about/timeline";
import { CoreValues } from "@/components/about/core-values";
import { TeamSection } from "@/components/about/team-section";
import { Stats } from "@/components/about/stats";
import { ContactCTA } from "@/components/about/contact-cta";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen">
      <HeroSection />
      <Timeline />
      <CoreValues />
      <Stats />
      <TeamSection />
      <ContactCTA />
    </main>
    <Footer />
    </>
  );
}