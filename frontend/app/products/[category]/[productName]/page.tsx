import ProductDetails from "@/components/ProductDetails";
import React from "react";

const products = [
  { 
    images: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b62ad0c4-ae84-4e35-9ec4-361c5973107f/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5e7aade8-4998-4b85-91f1-a78d2536d495/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/f398d697-74bd-45ff-9fad-148b3bb8039c/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1f7fa498-7dd5-4383-9684-57b6dd73edd4/AIR+JORDAN+LEGACY+312+LOW.png"
    ],
    color: "#ff0000" // Example color
  },
  { 
    images: [
      "	https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/701103b1-605a-4d12-bb9d-de16d4c5987f/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/851a04fc-c122-416c-a0e0-e0e6bc2abd26/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e848a8c3-d0e4-41a1-b587-d240f44b1647/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/35400b2a-7726-46f9-8446-e854e45c0262/AIR+JORDAN+LEGACY+312+LOW.png"
    ],
    color: "#00ff00" 
  },
  { 
    images: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c0ca3307-6c4f-4691-93f0-1a4ccb75555a/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/3aa5f82b-905e-44a4-8f69-4e312cf40b82/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/567561ca-f737-4fdb-b4e6-a51b288fca9b/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e6f9fd9e-698f-4109-80d8-b46650bac1ef/AIR+JORDAN+LEGACY+312+LOW.png"
    ],
    color: "#0000ff" 
  },
  { 
    images: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/13e5e642-0f11-4969-99e7-e11cfced8d1c/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/083a206c-98a4-400c-8448-dca574bd4013/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/23ed1168-66fd-4d50-885d-fbfcc8a6ba66/AIR+JORDAN+LEGACY+312+LOW.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c30b1ca3-360b-4eb1-8653-882b5f909acc/AIR+JORDAN+LEGACY+312+LOW.png"
    ],
    color: "#ffff00" 
  },
]; // Array of product objects

const ProductInfoPage = () => {
  return (
    <div className="flex-grow min-h-screen">
      <ProductDetails products={products} />
    </div>
  );
};

export default ProductInfoPage;
