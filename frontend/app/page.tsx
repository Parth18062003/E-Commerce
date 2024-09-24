import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { HorizontalScrollCarousel } from "@/components/ScrollCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-zinc-50 dark:bg-zinc-950 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="">
          <HeroBackground />
          <div className="flex items-end justify-start min-h-screen -translate-y-1/4 -translate-x-10">
            <HeroText />
          </div>
          <HorizontalScrollCarousel />
        </main>
      </div>
      <Footer />
    </>
  );
}
