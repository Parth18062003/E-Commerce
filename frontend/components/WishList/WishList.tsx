/* "use client";

import { fetchWishList, removeProductFromWishList } from '@/store/wishListSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import WishListItem from './WishListItem';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

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

    const handleGoBack = () => {
        router.back();
    };

    const productsInWishList = wishlist?.productIds || [];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-zinc-800">Your Wishlist</h2>
                    <Button
                        onClick={handleGoBack}
                        variant="outline"
                        className="flex items-center gap-2 text-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                {loading.fetch ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : productsInWishList.length > 0 ? (
                    <ul className="space-y-6">
                        {productsInWishList.map((productId) => (
                            <WishListItem
                                key={productId}
                                productId={productId}
                                onRemove={() => handleRemoveProduct(productId)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <Image
                                src="/images/empty-wishlist.svg" // Add a relevant illustration
                                alt="Empty Wishlist"
                                width={300}
                                height={300}
                                className="mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-zinc-800 mb-2">
                                Your Wishlist is Empty
                            </h3>
                            <p className="text-zinc-600 mb-6">
                                Start adding products to your wishlist to save them for later.
                            </p>
                            <Button
                                onClick={handleGoBack}
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Browse Products
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishList; */
"use client";
import {
  fetchWishList,
  removeProductFromWishList,
} from "@/store/wishListSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WishListItem from "./WishListItem";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { fetchProductsByIds, Product } from "@/store/productSlice";

const WishList: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { wishlist, loading: wishlistLoading } = useSelector(
    (state: RootState) => state.wishList
  );
  const { cache: productCache } = useSelector(
    (state: RootState) => state.product
  );
  const productsLoading = useSelector(
    (state: RootState) => state.product.loading.fetchProductsByIds
  );

  useEffect(() => {
    const loadData = async () => {
      const wishlistResult = await dispatch(fetchWishList(userId));
      if (fetchWishList.fulfilled.match(wishlistResult)) {
        const productIds = wishlistResult.payload?.productIds || [];
        if (productIds.length > 0) {
          await dispatch(fetchProductsByIds(productIds));
        }
      }
    };
    loadData();
  }, [dispatch, userId]);

  const handleRemoveProduct = async (productId: string) => {
    await dispatch(removeProductFromWishList({ userId, productId }));
  };

  const validProducts =
    wishlist?.productIds
      ?.map((id) => productCache[id.trim()])
      ?.filter((product): product is Product => !!product) || [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-zinc-800">Your Wishlist</h2>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2 text-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        </div>

        {validProducts.length > 0 ? (
          <ul className="space-y-6">
            {validProducts.map((product) => (
              <WishListItem
                key={product.id}
                product={product}
                onRemove={() => handleRemoveProduct(product.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Image
                src="https://images.pexels.com/photos/27950774/pexels-photo-27950774/free-photo-of-stray-cat.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Empty Wishlist"
                width={300}
                height={300}
                className="mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-zinc-800 mb-2">
                Your Wishlist is empty
              </h3>
              <p className="text-zinc-600 mb-6">
                Start adding products to your wishlist to save them for later.
              </p>
              <Button
                onClick={() => router.push("/products")}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Browse Products
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
