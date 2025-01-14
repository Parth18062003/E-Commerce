/* "use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CircleHelp, MinusIcon, PlusIcon, ShoppingBag, Trash2, X } from "lucide-react";
import { updateItemQuantity, removeItemFromCart, fetchCart, CartItem } from "@/store/cartSlice";
import { fetchProductsByIds, setProductsCache } from "@/store/productSlice";
import Image from "next/image";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { createSlug } from "@/lib/utils";
import { formatCurrency } from "../utils/formatCurrency";
import WishListButton from "../WishList/WishListButton";

export interface CartItemProps {
  item: CartItem;
  quantities: { [key: string]: number };
  handleQuantityChange: (productId: string, variantSku: string, size: string, quantity: number) => void;
  handleRemoveItem: (productId: string, variantSku: string, size: string) => void;
}

// Types for CartSummary Props
export interface CartSummaryProps {
  total: number;
  taxes: number;
  grandTotal: number;
}

// Types for Quantities State
export interface QuantitiesState {
  [key: string]: number;
}

// CartItem Component
const CartItemComponent: React.FC<CartItemProps> = ({ item, quantities, handleQuantityChange, handleRemoveItem }) => {
  const product = useSelector((state: RootState) => state.product.cache[item.productId]); // Access product by ID
  if (!product) return null;

  const variant = product.variants.find((v) => v.sku === item.variantSku);
  if (!variant) return null;

  const discountedPrice = variant.price - (variant.price * (variant.discount || 0)) / 100;

  return (
    <Card key={`${item.productId}-${item.variantSku}-${item.size}`} className="mb-6 border-0 border-b-2 border-zinc-400 shadow-none bg-transparent rounded-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`}>
                <Image
                  src={variant.colorOptionImages[0] || "/placeholder.png"}
                  alt={product.name}
                  width={256}
                  height={256}
                  className="w-44 h-44 object-cover"
                />
              </Link>
              <div className="flex justify-center items-center gap-4 my-4">
                <div className="border border-zinc-400 rounded-full space-x-2 flex justify-center items-center px-4 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentQuantity = quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity;
                      if (currentQuantity === 1) {
                        handleRemoveItem(item.productId, item.variantSku, item.size);
                      } else {
                        handleQuantityChange(item.productId, item.variantSku, item.size, currentQuantity - 1);
                      }
                    }}
                  >
                    {quantities[`${item.productId}-${item.variantSku}-${item.size}`] === 1 ? (
                      <Trash2 className="h-4 w-4" />
                    ) : (
                      <MinusIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <span>{quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.productId, item.variantSku, item.size, (quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity) + 1)
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <WishListButton productId={item.productId} />
              </div>
            </div>
            <div className="-translate-y-20">
              <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`} className="text-xl font-semibold">
                {product.name}
              </Link>
              <p className="text-lg text-zinc-600">{variant.color}</p>
              <p className="text-lg text-zinc-600">Size {item.size}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center">
            {variant.discount ? (
              <div className="flex items-center gap-2">
                <p className="text-lg text-zinc-600 line-through">{formatCurrency(variant.price)}</p>
                <span className="text-sm bg-indigo-500 text-white px-3 py-1 rounded-full">{variant.discount}% OFF</span>
              </div>
            ) : null}
            <p className="text-xl font-semibold text-indigo-600">
              <span className="font-thin text-muted-foreground text-lg">MRP:</span> {formatCurrency(discountedPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <X
              className="h-8 w-8 z-10 hover:cursor-pointer"
              aria-label="Remove item"
              onClick={() => handleRemoveItem(item.productId, item.variantSku, item.size)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CartSummary Component
const CartSummary: React.FC<CartSummaryProps> = ({ total, taxes, grandTotal }) => {
  const router = useRouter();

  return (
    <Card className="border-0 shadow-none bg-transparent rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Subtotal</span>
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="w-5 h-5 text-gray-500 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="absolute z-10 p-4 bg-white shadow-md rounded-md text-sm text-gray-700 max-w-xs">
                  The subtotal reflects the total price of your order, including duties and taxes, before any applicable discounts. It does not include delivery costs and international transaction fees.
                </PopoverContent>
              </Popover>
            </div>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Estimated Delivery & Handling</span>
            <span>{formatCurrency(0.12 * total)}</span>
          </div>
          <div className="flex justify-between font-bold my-4 py-3 border-t border-b">
            <span>Total</span>
            <span>{formatCurrency(grandTotal + 0.12 * total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-full p-6 text-lg" onClick={() => router.push("/checkout")}>
          Member Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Cart Component
const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const products = useSelector((state: RootState) => state.product.cache);
  const userId = useSelector((state: RootState) => state.auth.user?.id || "user-id");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cartLoading = useSelector((state: RootState) => state.cart.loading.fetch);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const cartData = await dispatch(fetchCart(userId)).unwrap();
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          setIsLoading(false);
          return;
        }

        const productIds = Array.from(new Set(cartData.items.map((item) => item.productId)));
        const fetchedProducts = await dispatch(fetchProductsByIds(productIds)).unwrap();

        // Ensure fetchedProducts is an array
        const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts : Object.values(fetchedProducts);

        dispatch(setProductsCache({ cacheKey: "cart", products: productsArray }));
      } catch (err) {
        console.error("Failed to fetch cart or products:", err);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [dispatch, userId]);

  useEffect(() => {
    if (cart) {
      const initialQuantities = cart.items.reduce((acc, item) => {
        acc[`${item.productId}-${item.variantSku}-${item.size}`] = item.quantity;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleQuantityChange = async (productId: string, variantSku: string, size: string, quantity: number) => {
    try {
      await dispatch(updateItemQuantity({ userId, productId, variantSku, size, quantity })).unwrap();
      toast.success("Quantity updated successfully!");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (productId: string, variantSku: string, size: string) => {
    try {
      await dispatch(removeItemFromCart({ userId, productId, variantSku, size })).unwrap();
      toast.success("Item removed successfully!");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item.");
    }
  };

  const calculateTotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const product = products[item.productId]; // Access product by ID
      if (product) {
        const variant = product.variants.find((v) => v.sku === item.variantSku);
        if (variant) {
          const discountedPrice = variant.price - (variant.price * (variant.discount || 0)) / 100;
          return total + discountedPrice * item.quantity;
        }
      }
      return total;
    }, 0);
  }, [cart, products]);

  const calculateTaxes = (total: number) => total * 0.1;
  const taxes = calculateTaxes(calculateTotal);
  const grandTotal = calculateTotal + taxes;

  if (isLoading || cartLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-400" />
        <h2 className="text-zinc-800 text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-zinc-600 mb-6">Add some items to your cart to get started.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="flex mx-auto p-6 justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemComponent
              key={`${item.productId}-${item.variantSku}-${item.size}`}
              item={item}
              quantities={quantities}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
        </div>
        <CartSummary total={calculateTotal} taxes={taxes} grandTotal={grandTotal} />
      </div>
    </div>
  );
};

export default Cart; */
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CircleHelp, MinusIcon, PlusIcon, ShoppingBag, Trash2, X } from "lucide-react";
import { updateItemQuantity, removeItemFromCart, fetchCart, CartItem } from "@/store/cartSlice";
import { fetchProductsByIds } from "@/store/productSlice";
import Image from "next/image";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { createSlug } from "@/lib/utils";
import { formatCurrency } from "../utils/formatCurrency";
import WishListButton from "../WishList/WishListButton";

// Types
export interface CartItemProps {
  item: CartItem;
  quantities: { [key: string]: number };
  handleQuantityChange: (productId: string, variantSku: string, size: string, quantity: number) => void;
  handleRemoveItem: (productId: string, variantSku: string, size: string) => void;
}

export interface CartSummaryProps {
  total: number;
  taxes: number;
  grandTotal: number;
}

export interface QuantitiesState {
  [key: string]: number;
}

// CartItemComponent
const CartItemComponent: React.FC<CartItemProps> = ({ item, quantities, handleQuantityChange, handleRemoveItem }) => {
  const product = useSelector((state: RootState) => state.product.cache[item.productId]);

  // Skip rendering if product is not found
  if (!product) {
    console.warn(`Product not found for ID: ${item.productId}`);
    return null;
  }

  const variant = product.variants.find((v) => v.sku === item.variantSku);
  if (!variant) {
    console.warn(`Variant not found for SKU: ${item.variantSku} in product: ${item.productId}`);
    return null;
  }

  const discountedPrice = variant.price - (variant.price * (variant.discount || 0)) / 100;

  return (
    <Card key={`${item.productId}-${item.variantSku}-${item.size}`} className="mb-6 border-0 border-b-2 border-zinc-400 shadow-none bg-transparent rounded-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`}>
                <Image src={variant.colorOptionImages[0] || "/placeholder.png"} alt={product.name} width={256} height={256} className="w-44 h-44 object-cover" />
              </Link>
              <div className="flex justify-center items-center gap-4 my-4">
                <div className="border border-zinc-400 rounded-full space-x-2 flex justify-center items-center px-4 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentQuantity = quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity;
                      if (currentQuantity === 1) {
                        handleRemoveItem(item.productId, item.variantSku, item.size);
                      } else {
                        handleQuantityChange(item.productId, item.variantSku, item.size, currentQuantity - 1);
                      }
                    }}
                  >
                    {quantities[`${item.productId}-${item.variantSku}-${item.size}`] === 1 ? <Trash2 className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
                  </Button>
                  <span>{quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(item.productId, item.variantSku, item.size, (quantities[`${item.productId}-${item.variantSku}-${item.size}`] || item.quantity) + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <WishListButton productId={item.productId} />
              </div>
            </div>
            <div className="-translate-y-20">
              <Link href={`/products/${createSlug(product.name)}/${product.id}/${createSlug(product.sku)}`} className="text-xl font-semibold">
                {product.name}
              </Link>
              <p className="text-lg text-zinc-600">{variant.color}</p>
              <p className="text-lg text-zinc-600">Size {item.size}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center">
            {variant.discount ? (
              <div className="flex items-center gap-2">
                <p className="text-lg text-zinc-600 line-through">{formatCurrency(variant.price)}</p>
                <span className="text-sm bg-indigo-500 text-white px-3 py-1 rounded-full">{variant.discount}% OFF</span>
              </div>
            ) : null}
            <p className="text-xl font-semibold text-indigo-600">
              <span className="font-thin text-muted-foreground text-lg">MRP:</span> {formatCurrency(discountedPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-8 w-8 z-10 hover:cursor-pointer" aria-label="Remove item" onClick={() => handleRemoveItem(item.productId, item.variantSku, item.size)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CartSummaryComponent
const CartSummary: React.FC<CartSummaryProps> = ({ total, taxes, grandTotal }) => {
  const router = useRouter();
  return (
    <Card className="border-0 shadow-none bg-transparent rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Subtotal</span>
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="w-5 h-5 text-gray-500 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="absolute z-10 p-4 bg-white shadow-md rounded-md text-sm text-gray-700 max-w-xs">
                  The subtotal reflects the total price of your order, including duties and taxes, before any applicable discounts. It does not include delivery costs and international transaction fees.
                </PopoverContent>
              </Popover>
            </div>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Estimated Delivery & Handling</span>
            <span>{formatCurrency(0.12 * total)}</span>
          </div>
          <div className="flex justify-between font-bold my-4 py-3 border-t border-b">
            <span>Total</span>
            <span>{formatCurrency(grandTotal + 0.12 * total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-full p-6 text-lg" onClick={() => router.push("/checkout")}>
          Member Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Cart Component
const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const products = useSelector((state: RootState) => state.product.cache);
  const userId = useSelector((state: RootState) => state.auth.user?.id || "user-id");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart and products on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        // Fetch cart and products in parallel
        const cartData = await dispatch(fetchCart(userId)).unwrap();
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          setIsLoading(false);
          return;
        }
  
        // Fetch products by IDs
        const productIds = Array.from(new Set(cartData.items.map((item) => item.productId)));
        await dispatch(fetchProductsByIds(productIds)).unwrap();
      } catch (err) {
        console.error("Failed to fetch cart or products:", err);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, userId]);

  // Initialize quantities from cart
  useEffect(() => {
    if (cart) {
      const initialQuantities = cart.items.reduce((acc, item) => {
        acc[`${item.productId}-${item.variantSku}-${item.size}`] = item.quantity;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  // Handle quantity change
// In Cart.tsx
const handleQuantityChange = useCallback(
  async (productId: string, variantSku: string, size: string, quantity: number) => {
    try {
      // Create a new object for quantities
      const newQuantities = { ...quantities, [`${productId}-${variantSku}-${size}`]: quantity };
      setQuantities(newQuantities);

      await dispatch(updateItemQuantity({ userId, productId, variantSku, size, quantity })).unwrap();
      toast.success("Quantity updated successfully!");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity.");
    }
  },
  [dispatch, userId, quantities]
);

  // Handle item removal
  const handleRemoveItem = useCallback(
    async (productId: string, variantSku: string, size: string) => {
      try {
        await dispatch(removeItemFromCart({ userId, productId, variantSku, size })).unwrap();
        toast.success("Item removed successfully!");
      } catch (error) {
        console.error("Failed to remove item:", error);
        toast.error("Failed to remove item.");
      }
    },
    [dispatch, userId]
  );

  // Calculate total, taxes, and grand total
  const { total, taxes, grandTotal } = useMemo(() => {
    if (!cart) return { total: 0, taxes: 0, grandTotal: 0 };
    const total = cart.items.reduce((sum, item) => {
      const product = products[item.productId];
      if (product) {
        const variant = product.variants.find((v) => v.sku === item.variantSku);
        if (variant) {
          const discountedPrice = variant.price - (variant.price * (variant.discount || 0)) / 100;
          return sum + discountedPrice * item.quantity;
        }
      }
      return sum;
    }, 0);
    const taxes = total * 0.1;
    const grandTotal = total + taxes;
    return { total, taxes, grandTotal };
  }, [cart, products]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-400" />
        <h2 className="text-zinc-800 text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-zinc-600 mb-6">Add some items to your cart to get started.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  // Render cart
  return (
    <div className="flex mx-auto p-6 justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemComponent
              key={`${item.productId}-${item.variantSku}-${item.size}`}
              item={item}
              quantities={quantities}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
        </div>
        <CartSummary total={total} taxes={taxes} grandTotal={grandTotal} />
      </div>
    </div>
  );
};

export default Cart;