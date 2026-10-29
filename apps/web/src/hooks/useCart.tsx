import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartData, Product } from "../types/store";
import { api } from "../services/api";

interface CartContextValue extends CartData {
  cartId: string;
  loading: boolean;
  error: string;
  add: (product: Product, quantity?: number) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  dismissError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const emptyCart: CartData = { items: [], total: 0 };

function getCartId(): string {
  const key = "moc-nhien-cart-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId] = useState(getCartId);
  const [data, setData] = useState<CartData>(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setData(await api.cart(cartId));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (next: { productId: string; quantity: number }[]) => {
      try {
        setData(await api.saveCart(cartId, next));
        setError("");
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Không thể cập nhật giỏ hàng.");
        throw reason;
      }
    },
    [cartId]
  );

  const add = useCallback(
    (product: Product, quantity = 1) => {
      const current = new Map(data.items.map((item) => [item.product.id, item.quantity]));
      current.set(product.id, (current.get(product.id) ?? 0) + quantity);
      return save(Array.from(current, ([productId, count]) => ({ productId, quantity: count })));
    },
    [data.items, save]
  );
  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      save(
        data.items
          .map(({ product, quantity: count }) => ({
            productId: product.id,
            quantity: product.id === productId ? quantity : count
          }))
          .filter((item) => item.quantity > 0)
      ),
    [data.items, save]
  );
  const remove = useCallback(
    (productId: string) =>
      save(data.items.filter((item) => item.product.id !== productId).map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      }))),
    [data.items, save]
  );
  const clear = useCallback(async () => {
    try {
      setData(await api.clearCart(cartId));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xóa giỏ hàng.");
      throw reason;
    }
  }, [cartId]);

  const value = useMemo(
    () => ({ ...data, cartId, loading, error, add, setQuantity, remove, clear, refresh, dismissError: () => setError("") }),
    [data, cartId, loading, error, add, setQuantity, remove, clear, refresh]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart phải được dùng bên trong CartProvider.");
  return value;
}
