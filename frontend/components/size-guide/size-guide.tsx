"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Ruler, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SizeGuideData, SizeTable } from "./size-table";

const sizeGuideData: SizeGuideData = {
  shoes: {
    men: [
      { id: "1", uk: "6", us: "7", eu: "40", cm: "25" },
      { id: "2", uk: "7", us: "8", eu: "41", cm: "26" },
      { id: "3", uk: "8", us: "9", eu: "42", cm: "27" },
      { id: "4", uk: "9", us: "10", eu: "43", cm: "28" },
      { id: "5", uk: "10", us: "11", eu: "44", cm: "29" },
      { id: "6", uk: "11", us: "12", eu: "45", cm: "30" },
      { id: "7", uk: "12", us: "13", eu: "46", cm: "31" },
    ],
    women: [
      { id: "8", uk: "3", us: "5", eu: "36", cm: "22" },
      { id: "9", uk: "4", us: "6", eu: "37", cm: "23" },
      { id: "10", uk: "5", us: "7", eu: "38", cm: "24" },
      { id: "11", uk: "6", us: "8", eu: "39", cm: "25" },
      { id: "12", uk: "7", us: "9", eu: "40", cm: "26" },
      { id: "13", uk: "8", us: "10", eu: "41", cm: "27" },
    ],
  },
  apparel: {
    men: [
      { id: "14", uk: "XS", us: "XS", eu: "44", cm: "86-91" },
      { id: "15", uk: "S", us: "S", eu: "46", cm: "91-97" },
      { id: "16", uk: "M", us: "M", eu: "48", cm: "97-102" },
      { id: "17", uk: "L", us: "L", eu: "50", cm: "102-107" },
      { id: "18", uk: "XL", us: "XL", eu: "52", cm: "107-112" },
      { id: "19", uk: "XXL", us: "XXL", eu: "54", cm: "112-117" },
    ],
    women: [
      { id: "20", uk: "XS", us: "XS", eu: "34", cm: "76-81" },
      { id: "21", uk: "S", us: "S", eu: "36", cm: "81-86" },
      { id: "22", uk: "M", us: "M", eu: "38", cm: "86-91" },
      { id: "23", uk: "L", us: "L", eu: "40", cm: "91-97" },
      { id: "24", uk: "XL", us: "XL", eu: "42", cm: "97-102" },
      { id: "25", uk: "XXL", us: "XXL", eu: "44", cm: "102-107" },
    ],
  },
};

export function SizeGuide() {
  const [category, setCategory] = useState<"shoes" | "apparel">("shoes");
  const [gender, setGender] = useState<"men" | "women">("men");

  return (
    <>
    <div className="p-6 bg-background rounded-lg shadow-lg max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Size Guide
      </motion.h2>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={category === "shoes" ? "default" : "outline"}
          onClick={() => setCategory("shoes")}
          className="gap-2"
        >
          <Ruler className="w-4 h-4" />
          Shoes
        </Button>
        <Button
          variant={category === "apparel" ? "default" : "outline"}
          onClick={() => setCategory("apparel")}
          className="gap-2"
        >
          <Shirt className="w-4 h-4" />
          Apparel
        </Button>
      </div>

      <Tabs defaultValue="men" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="men" onClick={() => setGender("men")}>
            Men
          </TabsTrigger>
          <TabsTrigger value="women" onClick={() => setGender("women")}>
            Women
          </TabsTrigger>
        </TabsList>
        <TabsContent value="men" className="mt-0">
          <SizeTable data={sizeGuideData[category].men} type={category} />
        </TabsContent>
        <TabsContent value="women" className="mt-0">
          <SizeTable data={sizeGuideData[category].women} type={category} />
        </TabsContent>
      </Tabs>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground mt-6 text-center"
      >
        Measurements are provided as a guide only. For the best fit, we
        recommend trying items on.
      </motion.p>
    </div>

    </>
  );
}
