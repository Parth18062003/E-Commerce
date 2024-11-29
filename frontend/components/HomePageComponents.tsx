import ProductSearch from "@/components/Algolia/ProductSearch";
import CategoryCards from "@/components/CategoryCards";
import { Footer } from "@/components/Footer";
import FullscreenVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductDisplay/ProductCarousel";
import { HorizontalScrollCarousel } from "@/components/ScrollCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";
import { useProduct } from "@/hooks/useProduct";
import { CTASection } from "./cta-section";
import { Carousel } from "./carousel/carousel";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { Button } from "./ui/button";
import { Alert, AlertBanner } from "./ui/banner";

const categories = [
  {
    title: "Womens",
    filter: "gender",
    imageUrl:
      "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_641,c_limit/cb28c551-b85b-479f-8fc3-40ad4e7c9ca4/nike-just-do-it.jpg",
  },
  {
    title: "Mens",
    filter: "gender",
    imageUrl:
      "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_714,c_limit/b7f9649b-81bf-4a98-a1b9-89850cfe4407/nike-just-do-it.png",
  },
  {
    title: "Unisex",
    filter: "gender",
    imageUrl:
      "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_714,c_limit/43950456-d2ec-4ae1-84bb-fa46ec470728/image.png",
  },
];

const alerts: Alert[] = [
  {
    id: "1",
    type: "info",
    title: "New Collection Drop",
    message: "The Spring 2024 collection is now available.",
    link: {
      text: "Shop Now",
      url: "/collections/spring-2024",
    },
    expiresAt: new Date("2025-04-01"),
  },
  {
    id: "2",
    type: "info",
    title: "Exclusive Early Access",
    message: "Get early access to the latest Nike releases before anyone else. Sign up today!",
    link: {
      text: "Sign Up",
      url: "/early-access",
    },
    expiresAt: new Date("2025-03-01"),
  },
  {
    id: "3",
    type: "info",
    title: "Holiday Sale Now Live",
    message: "Our biggest sale of the year is here! Save up to 40% on select items.",
    link: {
      text: "Shop Holiday Sale",
      url: "/holiday-sale",
    },
    expiresAt: new Date("2025-12-31"),
  },
  {
    id: "4",
    type: "info",
    title: "New Loyalty Program Launch",
    message: "Earn points with every purchase and unlock exclusive rewards with our new loyalty program.",
    link: {
      text: "Learn More",
      url: "/loyalty-program",
    },
    expiresAt: new Date("2025-09-30"),
  }
/*   {
    id: "2",
    type: "warning",
    title: "Limited Stock Alert",
    message: "Popular items are selling fast. Don't miss out!",
    link: {
      text: "View Trending",
      url: "/trending",
    },
  },
  {
    id: "3",
    type: "success",
    title: "Free Shipping",
    message: "Enjoy free shipping on all orders over $100",
    expiresAt: new Date("2024-03-31"),
  }, */
];

export async function HomePageComponents() {
  const date = new Date().toLocaleDateString("en-ca");
  const res = await fetch(
    `http://localhost:8082/api/v1/products/release-date/${date}`
  );
  const products = await res.json();
  const displayProducts = products.content.slice(0, 7);
  return (
    <>
      <Navbar />
      <AlertBanner alerts={alerts} />
      <div className="items-center justify-items-center min-h-screen p-8 pb-16 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
        <ProductSearch />
        <main className="w-full">
          <HeroBackground />
          <div className="flex items-end justify-start min-h-screen -translate-y-1/4 -translate-x-10">
            <HeroText />
          </div>
          <FullscreenVideo videoSrc="https://videos.pexels.com/video-files/4613367/4613367-sd_960_506_25fps.mp4" />
          <Carousel />
          <div className="relative">
            <Suspense fallback={<Loading />}>
              <h2 className="text-5xl font-bold text-black mb-2">
                New Arrivals
              </h2>
              <ProductCarousel products={displayProducts} />
            </Suspense>
          </div>

          <CategoryCards categories={categories} />
        </main>
      </div>
      <CTASection />
      <Footer />
    </>
  );
}
