"use client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils';
import Image from 'next/image';
import { Product } from '@/store/productSlice';
import { useEffect, useState } from 'react';

interface WishListItemProps {
  product: Product;
  onRemove: () => void;
}

const WishListItem: React.FC<WishListItemProps> = ({ product, onRemove }) => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImages, setMainImages] = useState<string[]>([]);

  useEffect(() => {
    if (product.colorOptions?.[0]) {
      setSelectedColor(product.colorOptions[0]);
      const variant = product.variants?.find(v => v.color === product.colorOptions[0]);
      setMainImages(variant?.colorOptionImages || []);
    }
  }, [product]);

  const discountedPrice = product.price * (1 - product.discount / 100);
  const hasImages = mainImages.length > 0;

  const handleCardClick = () => {
    router.push(`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`);
  };

  return (
    <Card 
      className="flex flex-col md:flex-row items-center p-6 border rounded-lg shadow-sm transition-transform duration-200 transform hover:scale-[1.02] bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      {hasImages ? (
        <Image
          src={mainImages[0]}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg object-cover mb-4 md:mb-0 md:mr-6 w-full md:w-48 h-48"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-lg mb-4 md:mb-0 md:mr-6 w-full md:w-48 h-48 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      
      <div className="flex-grow w-full">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-bold text-zinc-800">
            {product.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 mb-4">
          <p className="text-zinc-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-lg text-indigo-600">
              ${discountedPrice.toFixed(2)}
            </p>
            <p className="font-bold text-lg line-through text-zinc-400">
              ${product.price.toFixed(2)}
            </p>
            {product.discount > 0 && (
              <span className="bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-base font-medium">
                {product.discount}% off
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0 flex gap-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Buy Now clicked");
            }}
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-full px-6 py-2"
          >
            Buy Now
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition rounded-full px-6 py-2"
          >
            Remove
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default WishListItem;