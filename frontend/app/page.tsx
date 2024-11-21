import CategoryCards from "@/components/CategoryCards";
import { Footer } from "@/components/Footer";
import FullscreenVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel";
import ProductSearch from "@/components/ProductSearch";
import { HorizontalScrollCarousel } from "@/components/ScrollCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";

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

const currentDate = new Date();
const customDateString = `${currentDate.getFullYear()}-${(
  currentDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ProductSearch />
        <main className="w-full">
          <HeroBackground />
          <div className="flex items-end justify-start min-h-screen -translate-y-1/4 -translate-x-10">
            <HeroText />
          </div>
          <FullscreenVideo videoSrc="https://videos.pexels.com/video-files/4613367/4613367-sd_960_506_25fps.mp4" />
          <HorizontalScrollCarousel />
          <CategoryCards categories={categories} />
          <div className="">
            <h2 className="text-2xl font-bold text-black">New Arrivals</h2>
            {/*<ProductCarousel  />*/}
          </div>
          <div className="">
            <h2 className="text-2xl font-bold text-black">Trending</h2>
            {/*<ProductCarousel  />*/}
          </div>
          <CategoryCards categories={categories} />
        </main>
      </div>
      <Footer />
    </>
  );
}
