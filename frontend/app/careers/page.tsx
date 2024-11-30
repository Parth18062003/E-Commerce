import { HeroSection } from "@/components/careers/hero-section";
import { Benefits } from "@/components/careers/benefits";
import { JobListings } from "@/components/careers/job-listings";
import { CultureSection } from "@/components/careers/culture-section";
import { ApplicationForm } from "@/components/careers/application-form";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <Benefits />
        <JobListings />
        <CultureSection />
        <ApplicationForm />
        <Footer />
      </main>
    </>
  );
}
