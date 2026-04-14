export type ProductTier = "signature" | "premium" | "luckypack";

export interface StoreProduct {
  id: string;
  tier: ProductTier;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isPrintable: boolean;
  stock: number;
}

export interface InfluencerProfile {
  slug: string;
  name: string;
  profileImage?: string;
  introduction?: string;
  snsUrl?: string;
  platform?: string;
  followers: number;
  products: StoreProduct[];
  discountCodes: DiscountCode[];
}

export interface DiscountCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export interface DiscountResult {
  valid: boolean;
  message: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountedPrices?: Record<string, number>;
}

export interface CartItem {
  productId: string;
  quantity: number;
  printName?: string;
}
