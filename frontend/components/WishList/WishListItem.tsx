"use client";

import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from '@/store/store'; 
import { useEffect, useState } from 'react';
import { fetchProductDetails } from '@/store/productSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>Error loading product: {error}</p>;
    if (!product) return <p>Product not found.</p>;

    const discountedPrice = product.price - (product.price * (product.discount / 100));

    const handleCardClick = () => {
        router.push(`/products/${product.name}/${product.id}`);
    };

    return (
        <Card className="flex flex-col md:flex-row items-center p-4 border rounded-lg shadow-md bg-zinc-100 text-zinc-800 cursor-pointer"
        onClick={handleCardClick}
        >
            {mainImages.length > 0 && (
                <Image 
                    src={mainImages[0]} 
                    alt={product.name} 
                    width={200} 
                    height={100} 
                    className="rounded-md object-cover mb-4 md:mb-0 md:mr-4 md:w-1/3"
                />
            )}
            <div className="flex-grow">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-600">{product.description}</p>
                    <p className="font-bold text-lg line-through text-zinc-500">${product.price.toFixed(2)}</p>
                    <p className='font-bold text-lg text-indigo-600'>${discountedPrice.toFixed(2)}</p>
                </CardContent>
                <div className='flex gap-6 justify-start mx-5'>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition mb-2">Buy Now</Button>
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
                </div>
            </div>
        </Card>
    );
};

export default WishListItem;
