
import CategoryCards from "@/components/CategoryCards";
import { Footer } from "@/components/Footer";
import FullscreenVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel";
import ProductSearch from "@/components/ProductSearch";
import { HorizontalScrollCarousel } from "@/components/ScrollCarousel";
import HeroBackground from "@/components/ui/custom-grid";
import HeroText from "@/components/ui/hero-text";

const products = [
  {
    id: "1",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8722be57-c8e4-468a-9f81-bb7aa52043e7/WMNS+AIR+FORCE+1+%2707+LX.png",
    name: "AIR JORDAN 6 RETRO",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8722be57-c8e4-468a-9f81-bb7aa52043e7/WMNS+AIR+FORCE+1+%2707+LX.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "2",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    name: "name 2",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "3",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/6bd4d2d2-81ea-4319-8f2f-472740d2c7e6/W+AIR+FORCE+1%2707.png",
    name: "name 3",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "4",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/cd2a2802-13aa-41cf-865f-7d86889278cb/AIR+FORCE+1+LOW.png",
    name: "name 4",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "5",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8722be57-c8e4-468a-9f81-bb7aa52043e7/WMNS+AIR+FORCE+1+%2707+LX.png",
    name: "AIR JORDAN 6 RETRO",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "6",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    name: "name 2",
    brand: "Jordan",
    price: "$200",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: "7",
    imageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/6bd4d2d2-81ea-4319-8f2f-472740d2c7e6/W+AIR+FORCE+1%2707.png",
    name: "name 3 lorem ipsum dolor sit amet consectetur adipisicing elit",
    price: "$200",
    brand: "Jordan",
    hoverImageUrl:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit lorem ipsum ",
  },
];

const categories = [
  { title: "Women", imageUrl: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_641,c_limit/cb28c551-b85b-479f-8fc3-40ad4e7c9ca4/nike-just-do-it.jpg" },
  { title: "Men", imageUrl: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_714,c_limit/b7f9649b-81bf-4a98-a1b9-89850cfe4407/nike-just-do-it.png" },
  { title: "Kids", imageUrl: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_714,c_limit/43950456-d2ec-4ae1-84bb-fa46ec470728/image.png" },
];
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="w-full">
          <HeroBackground />
          <div className="flex items-end justify-start min-h-screen -translate-y-1/4 -translate-x-10">
            <HeroText />
          </div>
          <FullscreenVideo videoSrc="https://videos.pexels.com/video-files/4613367/4613367-sd_960_506_25fps.mp4" />
          <HorizontalScrollCarousel />
          <CategoryCards categories={categories}/>
          <div className="">
            <h2 className="text-2xl font-bold text-black">New Arrivals</h2>
            <ProductCarousel products={products} />
          </div>
          <div className="">
            <h2 className="text-2xl font-bold text-black">Trending</h2>
            <ProductCarousel products={products} />
          </div>
          <CategoryCards categories={categories}/>
        </main>
      </div>
      <Footer />
    </>
  );
}