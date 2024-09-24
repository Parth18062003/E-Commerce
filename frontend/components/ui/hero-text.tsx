"use client";

import { useTheme } from "next-themes";
import React, { useEffect } from "react";

const HeroText = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  useEffect(() => {
    const spans = document.querySelectorAll(
      ".hover-text span"
    ) as NodeListOf<HTMLSpanElement>;

    spans.forEach((span) => {
      span.addEventListener("mouseenter", function (this: typeof span) {
        this.style.fontWeight = "900";
        this.style.color = isDarkMode ? "rgb(238, 242, 255)" : "rgb(129 140 248)";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "500";
          leftNeighbor.style.color = isDarkMode ? "rgb(199, 210, 254)" : "rgb(165 180 252)";
        }
        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "500";
          rightNeighbor.style.color = isDarkMode ? "rgb(199, 210, 254)" : "rgb(165 180 252)";
        }
      });

      span.addEventListener("mouseleave", function (this: typeof span) {
        this.style.fontWeight = "100";
        this.style.color = isDarkMode ? "rgb(165, 180, 252)" : "rgb(129 140 248)";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "100";
          leftNeighbor.style.color = isDarkMode ? "rgb(165, 180, 252)" : "rgb(129 140 248)";
        }

        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "100";
          rightNeighbor.style.color = isDarkMode ? "rgb(165, 180, 252)" : "rgb(129 140 248)";
        }
      });
    });
  }, []);

  return (
    <h1 className="hover-text text-center text-9xl md:text-[15rem] lg:text-[25rem] font-thin text-indigo-400 dark:text-indigo-300 uppercase select-none">
      <Text>Hype</Text>
    </h1>
  );
};

const Text = ({ children }: { children: string }) => {
  return (
    <>
      {children.split("").map((child, idx) => (
        <span
          style={{
            transition: "0.35s font-weight, 0.35s color",
          }}
          key={idx}
        >
          {child}
        </span>
      ))}
    </>
  );
};

export default HeroText;