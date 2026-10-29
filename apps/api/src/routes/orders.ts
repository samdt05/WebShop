import { Hono } from "hono";
import { getCartView, isValidCartId, readCart } from "../lib/cart";
import type { Bindings } from "../lib/types";

export const orders = new Hono<{ Bindings: Bindings }>();

orders.post("/", async (c) => {
  const body: unknown = await c.req.json().catch(() => null);
  if (typeof body !== "object" || body === null) return c.json({ error: "Dữ liệu đặt hàng không hợp lệ." }, 400);
  const input = body as Record<string, unknown>;
  const cartId = input.cartId;
  const customerName = typeof input.customerName === "string" ? input.customerName.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const address = typeof input.address === "string" ? input.address.trim() : "";
  if (typeof cartId !== "string" || !isValidCartId(cartId)) return c.json({ error: "Mã giỏ hàng không hợp lệ." }, 400);
  if (customerName.length < 2 || customerName.length > 100) return c.json({ error: "Tên cần từ 2 đến 100 ký tự." }, 400);
  if (!/^[0-9+().\-\s]{8,20}$/.test(phone)) return c.json({ error: "Số điện thoại không hợp lệ." }, 400);
  if (address.length < 8 || address.length > 300) return c.json({ error: "Địa chỉ cần từ 8 đến 300 ký tự." }, 400);

  const lines = await readCart(c.env.CART, cartId);
  const cart = await getCartView(c.env.DB, lines);
  if (cart.items.length === 0 || cart.items.length !== lines.length) {
    return c.json({ error: "Giỏ hàng đang trống hoặc có sản phẩm không còn khả dụng." }, 400);
  }
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) return c.json({ error: `${item.product.name} không đủ tồn kho.` }, 409);
  }

  const orderId = crypto.randomUUID();
  const statements = [
    c.env.DB.prepare(
      "INSERT INTO orders (id, customer_name, phone, address, total, status) VALUES (?, ?, ?, ?, ?, 'demo_received')"
    ).bind(orderId, customerName, phone, address, cart.total),
    ...cart.items.map((item) =>
      c.env.DB.prepare(
        "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(orderId, item.product.id, item.product.name, item.product.price, item.quantity, item.lineTotal)
    )
  ];
  await c.env.DB.batch(statements);
  await c.env.CART.delete(`cart:${cartId}`);
  return c.json({ orderId, total: cart.total, status: "demo_received" }, 201);
});
