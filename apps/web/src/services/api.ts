import type { CartData, Category, Product } from "../types/store";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Không thể kết nối máy chủ.";
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  categories: () => request<{ categories: Category[] }>("/categories"),
  products: (params = "") => request<{ products: Product[] }>(`/products${params ? `?${params}` : ""}`),
  product: (slug: string) => request<{ product: Product }>(`/products/${encodeURIComponent(slug)}`),
  cart: (cartId: string) => request<CartData>(`/cart/${encodeURIComponent(cartId)}`),
  saveCart: (cartId: string, items: { productId: string; quantity: number }[]) =>
    request<CartData>(`/cart/${encodeURIComponent(cartId)}`, {
      method: "PUT",
      body: JSON.stringify({ items })
    }),
  clearCart: (cartId: string) =>
    request<CartData>(`/cart/${encodeURIComponent(cartId)}`, { method: "DELETE" }),
  checkout: (payload: { cartId: string; customerName: string; phone: string; address: string }) =>
    request<{ orderId: string; total: number; status: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
