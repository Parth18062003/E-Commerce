import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  stockQuantity: number;
  sku: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  colorOptions: string[]; // Array of color names
  colorOptionImages: {
    [key: string]: string[]; // Mapping of color names to an array of image URLs
  };
  discount?: number;
  dimensions?: string;
  weight?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the initial color and the corresponding initial image URL
  const initialColor =
    product.colorOptions.length > 0 ? product.colorOptions[0] : null;
  const initialImage =
    initialColor && initialColor in product.colorOptionImages
      ? product.colorOptionImages[initialColor][0] || ""
      : "";

  const [mainImage, setMainImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products/${product.name}/${product.id}`}>
      <Card
        className="max-w-3xl shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="overflow-hidden p-0">
          <div className="relative w-full h-96">
            <Image
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
              src={mainImage || "/placeholder-image-url.jpg"} // Placeholder image if mainImage is empty
              alt={product.name}
              height={512}
              width={512}
              priority
            />
          </div>
        </CardHeader>
        <CardContent className="h-32">
          {isHovered && product.colorOptions.length > 0 && (
            <div className="my-2 flex space-x-2 overflow-hidden">
              {product.colorOptions.map((color) => (
                <div
                  key={color} // Use color name as key
                  className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden border-2 border-gray-300"
                  onMouseEnter={() => {
                    const images = product.colorOptionImages[color];
                    if (images && images.length > 0) {
                      setMainImage(images[0]); // Set the first image of the selected color
                    }
                  }}
                  onMouseLeave={() => {
                    setMainImage(initialImage); // Reset to initial image
                  }}
                >
                  <Image
                    src={
                      product.colorOptionImages[color]?.[0] ||
                      "/placeholder-image-url.jpg"
                    } // Use placeholder if not available
                    alt={color}
                    className="object-cover"
                    width={256}
                    height={256}
                  />
                </div>
              ))}
            </div>
          )}
          <h2
            className={`font-bold text-lg mb-2 ${
              product.colorOptions.length ? "mt-1" : ""
            }`}
          >
            {product.name}
          </h2>
          <p className="text-gray-700">{product.brand}</p>
          <p className="line-clamp-1 text-gray-700">{product.description}</p>
          {!isHovered && (
            <>
              <p className="text-gray-700">
                {product.discount  && product.discount > 0 ? (
                  <>
                    <span>
                      $
                      {(
                        product.price -
                        product.price * (product.discount / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="mx-2 text-indigo-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${product.price.toFixed(2)}</span>
                )}
              </p>
              <p className="text-gray-700">
                {product.colorOptions && product.colorOptions.length > 0 && (
                  <span>{product.colorOptions.join(", ")}</span>
                )}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter>{/* Additional footer content can go here */}</CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;