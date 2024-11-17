package com.hypehouse.product_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;


@SpringBootApplication(scanBasePackages = {"com.hypehouse"})
public class ProductServiceApplication {

	private static final Logger logger = Logger.getLogger(ProductServiceApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
		logger.info("Product Service Application Started");
	}
}

/*
{
  "name": "Jordan Spizike Low Paris Saint-Germain",
  "description": "Jordan and Paris Saint-Germain have teamed up again, this time to update the Jordan Spizike Low. Taking elements from 5 classic Jordans, these low-top kicks remix heritage brand details to create one iconic sneaker. Add in some PSG flair and you get a win worth celebrating.",
  "category": "Footwear",
  "brand": "Nike",
  "sku": "HF8827-100",
  "isActive": true,
  "tags": [
    "sneakers",
    "sport",
    "casual",
    "mens",
    "paris-saint-germain"
  ],
  "rating": 4.8,
  "reviewCount": 42,
  "discount": 0,
  "isFeatured": false,
  "dimensions": "28x19x8",
  "weight": "0.89 kg",
  "colorOptions": [
    "Wolf Grey",
    "Paris Saint-Germain"
  ],
  "variants": [
    {
      "color": "Wolf Grey",
      "price": 15995.00,
      "salePrice": 13995.00,
      "stockQuantity": 852,
      "sizes": [
        {
          "size": "7",
          "stockQuantity": 50,
          "sku": "HF8827-100-7"
        },
        {
          "size": "7.5",
          "stockQuantity": 45,
          "sku": "HF8827-100-7.5"
        },
        {
          "size": "8",
          "stockQuantity": 60,
          "sku": "HF8827-100-8"
        },
        {
          "size": "8.5",
          "stockQuantity": 55,
          "sku": "HF8827-100-8.5"
        },
        {
          "size": "9",
          "stockQuantity": 60,
          "sku": "HF8827-100-9"
        },
        {
          "size": "9.5",
          "stockQuantity": 60,
          "sku": "HF8827-100-9.5"
        },
        {
          "size": "10",
          "stockQuantity": 50,
          "sku": "HF8827-100-10"
        }
      ],
      "colorOptionImages": [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1e861cd8-915b-4c4a-a1dd-f5b6a0122963/JORDAN+SPIZIKE+LOW+PSG.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/4f471bdb-d77b-4e1a-86fa-f0063454e0de/JORDAN+SPIZIKE+LOW+PSG.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/49932f6f-952f-4cd2-a28b-ec13b0d02f9b/JORDAN+SPIZIKE+LOW+PSG.png"
      ],
      "productImages": [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/806ad829-403e-4564-aae2-b2e6996f0cb1/JORDAN+SPIZIKE+LOW+PSG.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/34a8bc36-c93b-47b2-b354-9214c8ca601f/JORDAN+SPIZIKE+LOW+PSG.png"
      ],
      "material": "Leather, Synthetic",
      "releaseDate": "2023-08-15",
      "manufacturer": "Nike",
      "productURL": "https://www.nike.com/t/jordan-spizike-low-paris-saint-germain"
    },
    {
      "color": "Paris Saint-Germain",
      "price": 16995.00,
      "salePrice": 14995.00,
      "stockQuantity": 450,
      "sizes": [
        {
          "size": "7",
          "stockQuantity": 40,
          "sku": "HF8827-101-7"
        },
        {
          "size": "7.5",
          "stockQuantity": 35,
          "sku": "HF8827-101-7.5"
        },
        {
          "size": "8",
          "stockQuantity": 55,
          "sku": "HF8827-101-8"
        },
        {
          "size": "8.5",
          "stockQuantity": 50,
          "sku": "HF8827-101-8.5"
        },
        {
          "size": "9",
          "stockQuantity": 60,
          "sku": "HF8827-101-9"
        },
        {
          "size": "9.5",
          "stockQuantity": 55,
          "sku": "HF8827-101-9.5"
        },
        {
          "size": "10",
          "stockQuantity": 45,
          "sku": "HF8827-101-10"
        }
      ],
      "colorOptionImages": [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/806ad829-403e-4564-aae2-b2e6996f0cb1/JORDAN+SPIZIKE+LOW+PSG.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/34a8bc36-c93b-47b2-b354-9214c8ca601f/JORDAN+SPIZIKE+LOW+PSG.png"
      ],
      "productImages": [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/806ad829-403e-4564-aae2-b2e6996f0cb1/JORDAN+SPIZIKE+LOW+PSG.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/34a8bc36-c93b-47b2-b354-9214c8ca601f/JORDAN+SPIZIKE+LOW+PSG.png"
      ],
      "material": "Leather, Synthetic",
      "releaseDate": "2023-08-15",
      "manufacturer": "Nike",
      "productURL": "https://www.nike.com/t/jordan-spizike-low-paris-saint-germain"
    }
  ],
  "reviews": [
    {
      "user": "John Doe",
      "rating": 5,
      "comment": "Amazing sneakers! Very comfortable and stylish.",
      "date": "2023-10-15"
    },
    {
      "user": "Jane Smith",
      "rating": 4,
      "comment": "Great design, but they run slightly small for my size.",
      "date": "2023-09-28"
    }
  ],
  "relatedProducts": [
    {
      "name": "Jordan Spizike High Paris Edition",
      "sku": "HF8827-101",
      "price": 17995.00,
      "imageURL": "https://example.com/related-product.jpg"
    },
    {
      "name": "Nike Air Max 90 Paris Saint-Germain",
      "sku": "AM90-PSG",
      "price": 13995.00,
      "imageURL": "https://example.com/related-product2.jpg"
    }
  ]
}
 */