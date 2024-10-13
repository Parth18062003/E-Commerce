import { description } from "@/components/ActivityLogs/DailyActivityTrendsComponent";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel";
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
          <div className="">
            <h2 className="text-2xl font-bold text-black">New Arrivals</h2>
            <ProductCarousel products={products} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
