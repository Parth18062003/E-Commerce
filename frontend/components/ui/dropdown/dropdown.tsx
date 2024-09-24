"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const DirectionContext = createContext<{
  direction: "rtl" | "ltr" | null;
  setAnimationDirection: (tab: number | null) => void;
} | null>(null);

const CurrentTabContext = createContext<{
  currentTab: number | null;
} | null>(null);

export const Dropdown: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTab, setCurrentTab] = useState<null | number>(null);
  const [direction, setDirection] = useState<"rtl" | "ltr" | null>(null);

  const setAnimationDirection = (tab: number | null) => {
    if (typeof currentTab === "number" && typeof tab === "number") {
      setDirection(currentTab > tab ? "rtl" : "ltr");
    } else if (tab === null) {
      setDirection(null);
    }
    setCurrentTab(tab);
  };

  return (
    <DirectionContext.Provider value={{ direction, setAnimationDirection }}>
      <CurrentTabContext.Provider value={{ currentTab }}>
        <span
          onMouseLeave={() => setAnimationDirection(null)}
          className="relative flex h-fit gap-2"
        >
          {children}
        </span>
      </CurrentTabContext.Provider>
    </DirectionContext.Provider>
  );
};

export const TriggerWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentTab } = useContext(CurrentTabContext)!;
  const { setAnimationDirection } = useContext(DirectionContext)!;

  return (
    <>
      {React.Children.map(children, (e, i) => (
        <button
          id={`shift-tab-link-${i + 1}`}
          onMouseEnter={() => setAnimationDirection(i + 1)}
          onClick={() => setAnimationDirection(i + 1)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors dark:text-white ${
            currentTab === i + 1
              ? "bg-zinc-200 dark:bg-zinc-800 [&>svg]:rotate-180"
              : ""
          }`}
        >
          {e}
        </button>
      ))}
    </>
  );
};

export const Trigger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <>
      <span className={cn("", className)}>{children}</span>
      <ChevronDown />
    </>
  );
};

export const Tabs: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { currentTab } = useContext(CurrentTabContext)!;
  const { direction } = useContext(DirectionContext)!;

  return (
    <motion.div
      id="overlay-content-link"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={currentTab ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      className="absolute left-0 top-[calc(100%_+_24px)] w-auto"
    >
      <div
        className={cn(
          "rounded-lg border border-zinc-400 bg-gradient-to-b from-zinc-200 dark:from-zinc-900 via-zinc-200 dark:via-zinc-900 to-zinc-100 dark:to-zinc-800 transition-all duration-300 backdrop-blur-xl",
          className
        )}
      >
        <Bridge />
        <NubLink current={currentTab} />
        {React.Children.map(children, (e, i) => (
          <div className="overflow-hidden" key={i}>
            <AnimatePresence>
              {currentTab !== null && (
                <motion.div exit={{ opacity: 0 }}>
                  {currentTab === i + 1 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: direction === "ltr" ? 100 : direction === "rtl" ? -100 : 0,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {e}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

const NubLink = ({ current }: { current: number | null }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [current]);

  const moveNub = () => {
    if (current) {
      const hoveredTab = document.getElementById(`shift-tab-link-${current}`);
      const overlayContent = document.getElementById("overlay-content-link");

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
      className="absolute top-0 h-4 w-4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-zinc-400 bg-zinc-200 dark:bg-zinc-900"
    />
  );
};

export const Tab: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("h-full w-[500px]", className)}>{children}</div>;
};
