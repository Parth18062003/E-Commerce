import React from "react";

const HeroBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed max-h-full inset-0 -z-0 grid w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4" >
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="relative h-full w-full">
          <div
            style={
              {
                "--background": "#ffffff",
                "--color": "rgba(0, 0, 0, 0.2)",
                "--height": "5px",
                "--width": "1px",
                "--fade-stop": "90%",
                "--offset": "150px",
                "--color-dark": "rgba(255, 255, 255, 0.3)",
              } as React.CSSProperties
            }
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
          ></div>

          <div
            style={
              {
                "--background": "#ffffff",
                "--color": "rgba(0, 0, 0, 0.2)",
                "--height": "5px",
                "--width": "1px",
                "--fade-stop": "90%",
                "--offset": "150px",
                "--color-dark": "rgba(255, 255, 255, 0.3)",
              } as React.CSSProperties
            }
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-auto right-0"
          ></div>
          <div className="relative h-full w-full bg-gradient-to-b from-zinc-50 dark:from-transparent via-zinc-200 dark:via-zinc-800 to-zinc-50"></div>
        </div>
      ))}
    </div>
  );
};

export default HeroBackground;
