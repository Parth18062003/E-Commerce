import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean; // Type for isOpen
  onClose: () => void; // Type for onClose function
  images: string[]; // Array of image URLs
  initialIndex: number; // Index of the initially selected image
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images, initialIndex }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 max-w-4xl border-0"> {/* Add padding for space */}
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-full p-2 flex items-center justify-center"> {/* Added padding for spacing */}
                  <Image
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="object-cover max-h-[80vh] w-full rounded-lg" // Limit height to add space
                    width={512}
                    height={512}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
