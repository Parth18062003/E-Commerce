"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export const HorizontalScrollCarousel = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }: { card: CardType }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden rounded-2xl shadow-xl"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="relative inset-0 translate-y-10 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-4xl font-black uppercase text-zinc-700 text-center italic">
          {card.title}
        </p>
      </div>
    </div>
  );
};

type CardType = {
  url: string;
  title: string;
  id: number;
};

const cards: CardType[] = [
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8722be57-c8e4-468a-9f81-bb7aa52043e7/WMNS+AIR+FORCE+1+%2707+LX.png",
    title: "AIR JORDAN 6 RETRO",
    id: 1,
  },
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21d38052-598b-44f6-a857-123c9f72b015/AIR+FORCE+1+%2707.png",
    title: "Title 2",
    id: 2,
  },
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/6bd4d2d2-81ea-4319-8f2f-472740d2c7e6/W+AIR+FORCE+1%2707.png",
    title: "Title 3",
    id: 3,
  },
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/cd2a2802-13aa-41cf-865f-7d86889278cb/AIR+FORCE+1+LOW.png",
    title: "Title 4",
    id: 4,
  },
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/804e41b0-fddb-4f59-a5dc-d60dd0a90858/FORCE+1+LOW+EASYON+%28PS%29.png",
    title: "Title 5",
    id: 5,
  },
  {
    url: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/cc540e66-3b4e-4e64-a537-cf089a7ca84e/AIR+FORCE+1+%2707.png",
    title: "Title 6",
    id: 6,
  },
  {
    url: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/20547d52-3e1b-4c3d-b917-f0d7e0eb8bdf/custom-nike-air-force-1-low-by-you-shoes.png",
    title: "Title 7",
    id: 7,
  },
];
