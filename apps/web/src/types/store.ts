export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: string;
  category_name: string;
  category_slug: string;
  image: string;
  stock: number;
  is_active: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface CartData {
  items: CartItem[];
  total: number;
}
