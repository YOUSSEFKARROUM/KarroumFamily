export interface Product {
  id: number;
  name: string;
  name_ar: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  description_ar: string;
  category: string;
  made_at: number;
  stock: number;
  isArtisanal: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionInfo?: NutritionInfo;
  allergens?: string[];
  preparationTime: number;
  shelfLife: number;
  isPopular?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  preferences: string[];
  orderHistory: number[];
  favoriteProducts: number[];
  dietaryRestrictions: string[];
}

export interface Recommendation {
  type: 'trending' | 'personalized' | 'similar' | 'seasonal' | 'bundle';
  products: Product[];
  reason: string;
  reason_ar: string;
  confidence: number;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  comment_ar?: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface DeliveryZone {
  name: string;
  name_ar: string;
  price: number;
  estimatedTime: string;
  available: boolean;
  coordinates?: [number, number];
}