"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ReviewImagesProps {
  images: string[];
}

export function ReviewImages({ images }: ReviewImagesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="flex gap-2 mt-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-20 h-20 cursor-pointer rounded-md overflow-hidden"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Review image ${index + 1}`}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <div className="relative w-full h-[60vh]">
              <Image
                src={selectedImage}
                alt="Review image full size"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}