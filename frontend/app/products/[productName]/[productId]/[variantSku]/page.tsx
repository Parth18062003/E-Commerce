/* import ProductDetails from "@/components/ProductDisplay/ProductDetails";
import React from "react";

// Using async function to fetch product data on the server side
const ProductInfoPage = async ({ params }: { params: { productId: string } }) => {
  const { productId } = params;

  // Fetch product data from API
  const productRes = await fetch(`http://localhost:8082/api/v1/products/${productId}`);
  const productData = await productRes.json();

  // Fetch ratings data from API
  const ratingsRes = await fetch(`http://localhost:8082/api/v1/ratings/products/${productId}`);
  const ratingsData = await ratingsRes.json();
  // Pass the data to the ProductDetails component
  const averageRating = await fetch(`http://localhost:8082/api/v1/ratings/products/${productId}/average`);
  const averageRatingData = await averageRating.json();
  return (
    <div className="grow min-h-screen">
      <ProductDetails product={productData} rating={ratingsData} averageRatingData={averageRatingData}/>
    </div>
  );
};

export default ProductInfoPage;
 */
import ProductDetails from "@/components/ProductDisplay/ProductDetails";
import React from "react";

const ProductInfoPage = () => {
  return (
    <div className="grow min-h-screen">
      <ProductDetails />
    </div>
  );
};

export default ProductInfoPage;