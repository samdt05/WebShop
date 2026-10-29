export interface Bindings {
  DB: D1Database;
  CART: KVNamespace;
  ASSETS: Fetcher;
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

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartViewLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}
