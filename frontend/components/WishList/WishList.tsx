"use client";

import { fetchWishList, removeProductFromWishList } from '@/store/wishListSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import WishListItem from './WishListItem';

const WishList: React.FC<{ userId: string }> = ({ userId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { wishlist, loading } = useSelector((state: RootState) => state.wishList);

    useEffect(() => {
        dispatch(fetchWishList(userId));
    }, [dispatch, userId]);

    const handleRemoveProduct = async (productId: string) => {
        await dispatch(removeProductFromWishList({ userId, productId }));
        // Optionally, you could re-fetch the wishlist here if you want to ensure consistency
        // dispatch(fetchWishList(userId)); 
    };

    if (loading.fetch) return <p>Loading...</p>;

    const productsInWishList = wishlist?.productIds || [];

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
            {productsInWishList.length > 0 ? (
                <ul className="space-y-4">
                    {productsInWishList.map((productId) => (
                        <WishListItem
                            key={productId} 
                            productId={productId} 
                            onRemove={() => handleRemoveProduct(productId)} 
                        />
                    ))}
                </ul>
            ) : (
                !loading.fetch && (
                    <div className="text-center">
                        <p className="text-lg">No products in your wishlist.</p>
                        <Button 
                            onClick={handleGoBack} 
                            className="mt-4"
                        >
                            Go Back to Products
                        </Button>
                    </div>
                )
            )}
        </div>
    );
};

export default WishList;
