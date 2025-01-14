"use client";

import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { fetchProductDetails } from '@/store/productSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils';

interface WishListItemProps {
    productId: string;
    onRemove: () => void;
}

const WishListItem: React.FC<WishListItemProps> = ({ productId, onRemove }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const productCache = useSelector((state: RootState) => state.product.cache);

    const product = productCache[productId.trim()];
    const loading = useSelector((state: RootState) => state.product.loading.fetchProductDetails);
    const error = useSelector((state: RootState) => state.product.error.fetchProductDetails);

    const [selectedColor, setSelectedColor] = useState<string>('');
    const [mainImages, setMainImages] = useState<string[]>([]);

    useEffect(() => {
        if (productId && !product) {
            dispatch(fetchProductDetails(productId.trim()));
        } else if (product) {
            const initialColor = product.colorOptions[0]; // Set the initial color option
            setSelectedColor(initialColor);

            // Loop through variants to find the correct images for the selected color
            if (product.variants) {
                const variantForColor = product.variants.find(variant =>
                    variant.color === initialColor
                );
                if (variantForColor && variantForColor.colorOptionImages) {
                    setMainImages(variantForColor.colorOptionImages || []);
                }
            }
        }
    }, [dispatch, productId, product]);

    if (loading) return <p className="text-center py-4">Loading product details...</p>;
    if (error) return <p className="text-center py-4 text-red-600">Error loading product: {error}</p>;
    if (!product) return <p className="text-center py-4">Product not found.</p>;

    const discountedPrice = product.price - (product.price * (product.discount / 100));

    const handleCardClick = () => {
        router.push(`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`);
    };

    return (
        <Card
            className="flex flex-col md:flex-row items-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
            onClick={handleCardClick}
        >
            {mainImages.length > 0 && (
                <Image
                    src={mainImages[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover mb-4 md:mb-0 md:mr-6 w-full md:w-48 h-48"
                />
            )}
            <div className="flex-grow w-full">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-bold text-zinc-800">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mb-4">
                    <p className="text-zinc-600 mb-2">{product.description}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-indigo-600">${discountedPrice.toFixed(2)}</p>
                        <p className="font-bold text-lg line-through text-zinc-400">${product.price.toFixed(2)}</p>
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                            {product.discount}% off
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="p-0 flex gap-4">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle Buy Now logic
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        Buy Now
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                        Remove
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};

export default WishListItem;