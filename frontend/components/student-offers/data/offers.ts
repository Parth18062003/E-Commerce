import { StudentOffer } from "../types";

export const studentOffers: StudentOffer[] = [
  {
    id: "1",
    companyName: "Apple",
    logo: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1fd217ed-772d-4491-a54e-63026e6abcc9/ZOOM+FLY+6.png",
    category: "tech",
    discountValue: 10,
    discountType: "percentage",
    description: "Save on Mac or iPad with education pricing",
    expiryDate: "2024-12-31",
    promoCode: "STUDENT10",
    popularity: 95,
    termsUrl: "/terms/apple"
  },
  {
    id: "2",
    companyName: "Spotify",
    logo: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4d59bbbb-9c20-44fe-b0eb-7cdbe7e029b5/W+NIKE+V2K+RUN.png",
    category: "entertainment",
    discountValue: 50,
    discountType: "percentage",
    description: "Premium Student Plan - Half Price",
    popularity: 90,
    termsUrl: "/terms/spotify"
  },
  // Add more offers as needed
];