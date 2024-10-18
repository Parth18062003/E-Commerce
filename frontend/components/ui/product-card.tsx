import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    brand: string;
    color: string;
    imageUrl: string;
    colorOptions?: {
      colorName: string;
      imageUrl: string; // Image URL for color preview
    }[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.imageUrl);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  return (
    <Link href={`/products/${product.name}/${product.id}`}>
    <Card
      className="max-w-3xl shadow-lg"
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
    >
      <CardHeader className="overflow-hidden p-0">
        <div className="relative w-full h-96">
          <Image
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-t-xl"
            src={mainImage}
            alt={product.name}
            height={512}
            width={512}
            loading="eager"
          />
        </div>
      </CardHeader>
      <CardContent className="h-32">
        {" "}
        {/* Fixed height for content */}
        {/* Render color options only when hovered */}
        {isHovered &&
          product.colorOptions &&
          product.colorOptions.length > 0 && (
            <div className="my-2 flex space-x-2 overflow-hidden">
              {product.colorOptions.map((color) => (
                <div
                  key={color.colorName}
                  className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden border-2 border-gray-300"
                  onMouseEnter={() => setMainImage(color.imageUrl)} // Change main image on hover
                  onMouseLeave={() => setMainImage(product.imageUrl)} // Reset to default on leave
                >
                  <Image
                    src={color.imageUrl}
                    alt={color.colorName}
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
            product.colorOptions && product.colorOptions.length > 0
              ? "mt-2"
              : ""
          }`}
        >
          {product.name}
        </h2>
        <p className="text-gray-700">{product.brand}</p>
        {!isHovered && (
          <>
            {" "}
            <p className="text-gray-700">{product.color}</p>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
          </>
        )}
      </CardContent>
      <CardFooter>
        {/* Additional footer content can go here, like an "Add to Cart" button */}
      </CardFooter>
    </Card>
    </Link>
  );
};

export default ProductCard;
