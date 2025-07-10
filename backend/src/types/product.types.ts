export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductResponse {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductRequest {
  name: string;
  nameAr: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stock: number;
  categoryId: string;
  isFeatured?: boolean;
  preparationTime?: number;
  shelfLife?: number;
}