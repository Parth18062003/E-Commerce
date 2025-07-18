import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex,
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!api) return;

    // Set the current slide based on the initialIndex
    api.scrollTo(initialIndex);
    
    // Update current on select event
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, initialIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 max-w-4xl border-0">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <Carousel setApi={setApi} className="w-full" opts={{
          loop: true,
          align: "center",
        }}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <Image
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="object-cover max-h-[80vh] w-full rounded-lg"
                    width={512}
                    height={512}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current + 1} of {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
