"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  ArrowRight,
  ChartBarDecreasing,
  ChartPie,
  ChevronDown,
  House,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export const DropdownTabs = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<null | "l" | "r">(null);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2"
    >
      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected && <Content dir={dir} selected={selected} />}
      </AnimatePresence>
    </div>
  );
};

const Tab = ({
  children,
  tab,
  handleSetSelected,
  selected,
}: {
  children: ReactNode;
  tab: number;
  handleSetSelected: (val: number | null) => void;
  selected: number | null;
}) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors text-zinc-950 dark:text-white ${
        selected === tab ? " bg-zinc-200 dark:bg-zinc-800 " : ""
      }`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`transition-transform ${
          selected === tab ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

const Content = ({
  selected,
  dir,
}: {
  selected: number | null;
  dir: null | "l" | "r";
}) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className="absolute left-0 top-[calc(100%_+_24px)] w-96 rounded-lg border border-zinc-400 bg-gradient-to-b from-zinc-200 dark:from-zinc-900 via-zinc-200 dark:via-zinc-900 to-zinc-100 dark:to-zinc-800 transition-all duration-300 backdrop-blur-xl p-4"
    >
      <Bridge />
      <Nub selected={selected} />

      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <t.Component />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

const Nub = ({ selected }: { selected: number | null }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-zinc-400 bg-zinc-200 dark:bg-zinc-900"
    />
  );
};

const Products = () => {
  return (
    <div>
      <div className="flex gap-4 text-zinc-700 dark:text-zinc-400">
        <div>
          <h3 className="mb-2 text-sm font-medium">Startup</h3>
          <Link href="/" className="mb-1 block text-sm ">
            Bookkeeping
          </Link>
          <Link href="/" className="block text-sm ">
            Invoicing
          </Link>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Scaleup</h3>
          <Link href="/" className="mb-1 block text-sm ">
            Live Coaching
          </Link>
          <Link href="/" className="mb-1 block text-sm ">
            Reviews
          </Link>
          <Link href="/" className="block text-sm ">
            Tax/VAT
          </Link>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Enterprise</h3>
          <Link href="/" className="mb-1 block text-sm ">
            White glove
          </Link>
          <Link href="/" className="mb-1 block text-sm ">
            SOX Compliance
          </Link>
          <Link href="/" className="block text-sm ">
            Staffing
          </Link>
          <Link href="/" className="block text-sm ">
            More
          </Link>
        </div>
      </div>

      <button className="ml-auto mt-4 flex items-center gap-1 text-sm text-indigo-500 dark:text-indigo-300">
        <span>View more</span>
        <ArrowRight />
      </button>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="grid grid-cols-3 gap-4 divide-x divide-zinc-700 text-zinc-700 dark:text-zinc-400">
      <Link
        href="/"
        className="flex w-full flex-col items-center justify-center py-2 transition-colors hover:text-zinc-50"
      >
        <House className="mb-2 text-xl text-indigo-500 dark:text-indigo-300" />
        <span className="text-xs">Startup</span>
      </Link>
      <Link
        href="/"
        className="flex w-full flex-col items-center justify-center py-2  transition-colors hover:text-zinc-50"
      >
        <ChartBarDecreasing className="mb-2 text-xl text-indigo-500 dark:text-indigo-300" />
        <span className="text-xs">Scaleup</span>
      </Link>
      <Link
        href="/"
        className="flex w-full flex-col items-center justify-center py-2  transition-colors hover:text-zinc-50"
      >
        <ChartPie className="mb-2 text-xl text-indigo-500 dark:text-indigo-300" />
        <span className="text-xs">Enterprise</span>
      </Link>
    </div>
  );
};

const Blog = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-400">
        <Link href="/">
          <img
            className="mb-2 h-14 w-full rounded object-cover"
            src="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_700,c_limit/56e7677b-c5b6-4b84-9f09-5db7740fb885/image.png"
            alt="Placeholder image"
          />
          <h4 className="mb-0.5 text-sm font-medium">Lorem ipsum dolor</h4>
          <p className="text-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo
            quidem eos.
          </p>
        </Link>
        <Link href="/">
          <img
            className="mb-2 h-14 w-full rounded object-cover"
            src="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_700,c_limit/56e7677b-c5b6-4b84-9f09-5db7740fb885/image.png"
            alt="Placeholder image"
          />
          <h4 className="mb-0.5 text-sm font-medium">Lorem ipsum dolor</h4>
          <p className="text-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo
            quidem eos.
          </p>
        </Link>
      </div>
      <button className="ml-auto mt-4 flex items-center gap-1 text-sm text-indigo-500 dark:text-indigo-300">
        <span>View more</span>
        <ArrowRight />
      </button>
    </div>
  );
};

const TABS = [
  {
    title: "Products",
    Component: Products,
  },
  {
    title: "Pricing",
    Component: Pricing,
  },
  {
    title: "Blog",
    Component: Blog,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));
