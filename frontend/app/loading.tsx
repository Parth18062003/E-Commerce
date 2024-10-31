"use client"

import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      
      <DotLottieReact
      src="https://lottie.host/3035aa98-762e-481f-a03f-b085c7a0f96a/HnD9NokJMO.json"
      loop
      autoplay
      speed={0.5}
      className="w-20 h-20 md:w-80 md:h-80"
    />
      <h2 className="text-2xl md:text-4xl font-semibold text-zinc-700 dark:text-zinc-200 ml-4">
        Loading...</h2>
    </div>
  );
};

export default Loading;
