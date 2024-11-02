import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToWishList, removeProductFromWishList, fetchWishList } from '@/store/wishListSlice';
import { AppDispatch } from '@/store/store';
import LoginDialog from './LoginDialog';

interface WishListButtonProps {
    productId: string; // Accepts only the product ID
}

const WishListButton: React.FC<WishListButtonProps> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    
    // Accessing the user and login state from the auth slice
    const { user } = useSelector((state: any) => state.auth);
    const isLoggedIn = !!user; // Check if user object is not null
    const userId = user?.id; // Get user ID if logged in

    // Access the wishlist from the Redux store
    const wishList = useSelector((state: any) => state.wishList.wishlist);
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Fetch the wishlist when user is logged in
    useEffect(() => {
        if (isLoggedIn && userId) {
            dispatch(fetchWishList(userId));
        }
    }, [isLoggedIn, userId, dispatch]);

    // Update local state based on Redux state
    useEffect(() => {
        if (wishList) {
            setIsInWishlist(wishList.productIds.includes(productId));
        }
    }, [wishList, productId]);

    const handleClick = async () => {
        if (!isLoggedIn) {
            setShowLoginDialog(true);
            return;
        }

        try {
            if (isInWishlist) {
                await dispatch(removeProductFromWishList({ userId, productId }));
            } else {
                await dispatch(addProductToWishList({ userId, productId }));
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        }
    };

    const handleCloseDialog = () => {
        setShowLoginDialog(false);
    };

    return (
        <>
            <button 
                onClick={handleClick} 
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <Heart fill={isInWishlist ? "#6366f1" : "none"} className='text-indigo-500'/>
            </button>
            {showLoginDialog && <LoginDialog onClose={handleCloseDialog} />}
        </>
    );
};

export default WishListButton;
