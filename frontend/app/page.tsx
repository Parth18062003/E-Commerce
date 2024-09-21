import ImageContainer from "@/components/ShaderCanvas";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="">Hello World</h1>
        <ImageContainer imageUrl="https://assets.codepen.io/9051928/retro.jpg"/>
        
      </main>  
    </div>
  );
}
