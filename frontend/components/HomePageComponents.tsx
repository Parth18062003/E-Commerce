import ProductSearch from "@/components/Algolia/ProductSearch";
import CategoryCards from "@/components/CategoryCards";
import { Footer } from "@/components/Footer";
import FullscreenVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductDisplay/ProductCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";
import { CTASection } from "./CtaSection";
import { Carousel } from "./carousel/carousel";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { Alert, AlertBanner } from "./ui/banner";
import HeroImage from "./main-page/hero-image";
import CTA from "./CTA";
import HeroSection from "./HeroSection";
import { SportCarousel } from "./carousel/sport-carousel";

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
    message:
      "Get early access to the latest Nike releases before anyone else. Sign up today!",
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
    message:
      "Our biggest sale of the year is here! Save up to 40% on select items.",
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
    message:
      "Earn points with every purchase and unlock exclusive rewards with our new loyalty program.",
    link: {
      text: "Learn More",
      url: "/loyalty-program",
    },
    expiresAt: new Date("2025-09-30"),
  },
];

export async function HomePageComponents() {
  //const date = new Date().toLocaleDateString("en-ca");
  const date = "2024-03-01";
  const res = await fetch(
    `http://localhost:8082/api/v1/products/release-date/${date}`
  );
  const products = await res.json();
  const displayProducts = products.content.slice(0, 7);
  return (
    <>
      <Navbar />
      <ProductSearch />
      <div className="relative font-[family-name:var(--font-geist-sans)]">
        <main className="w-full">
          <HeroBackground />
          <HeroSection />
          <div className="relative bottom-0 lg:mx-20 flex items-end">
            <HeroText />
          </div>
          <Suspense fallback={<Loading />}>
          <div className="mt-10 p-5 lg:p-20">
            <FullscreenVideo videoSrc="/hero_video.mp4" />
          </div>
          </Suspense>
          <CTA
            mainHeading="Your New Look Awaits"
            bottomdescription="Stay ahead of the curve with our bold new releases and limited editions."
            buttonText="Explore Now"
          />
          <Suspense fallback={<Loading />}>
            <div className="py-12 px-8">
              <CategoryCards categories={categories} />
            </div>
            <div className="relative my-12 px-8 lg:px-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-black">
                New Arrivals
              </h2>
              <ProductCarousel products={displayProducts} />
            </div>
            <HeroImage />
            <CTA
              topdescription="Step Into the Future"
              mainHeading="Unleash Your Potential"
              bottomdescription="Explore the latest in performance gear and lifestyle collections."
              buttonText="Shop Now"
            />
            <SportCarousel />
            <Carousel />
          </Suspense>
        </main>
      </div>
      <Suspense fallback={<Loading />}>
        <CTASection />
        <Footer />
      </Suspense>
    </>
  );
}
