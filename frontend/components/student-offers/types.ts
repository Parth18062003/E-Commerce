export type OfferCategory = 'food' | 'tech' | 'entertainment' | 'fashion' | 'travel' | 'education' | "sneakers" | "sportswear" | "accessories" | "electronics" | "beauty" | "books" | "music" | "games" | "health" | "fitness" | "services" | "other" | "apparel";

export interface StudentOffer {
  id: string;
  companyName: string;
  logo: string;
  category: OfferCategory;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  description: string;
  expiryDate?: string;
  promoCode?: string;
  popularity: number;
  termsUrl: string;
}

export interface University {
  id: string;
  name: string;
  domains: string[];
  country: string;
}

export interface VerificationStatus {
  isVerified: boolean;
  university?: University;
  email?: string;
  expiryDate?: string;
}