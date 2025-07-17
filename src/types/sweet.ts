export interface Sweet {
  id: string;
  name: string;
  category: 'chocolate' | 'candy' | 'pastry' | 'gummy' | 'lollipop';
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

export type SweetCategory = Sweet['category'];

export interface PurchaseRequest {
  sweetId: string;
  quantity: number;
}

export interface RestockRequest {
  sweetId: string;
  quantity: number;
}

export interface SearchFilters {
  name?: string;
  category?: SweetCategory;
  minPrice?: number;
  maxPrice?: number;
}