import { Hono } from "hono";
import { cartKey, getCartView, isValidCartId, parseCartLines, readCart, writeCart } from "../lib/cart";
import type { Bindings, Product } from "../lib/types";

export const cart = new Hono<{ Bindings: Bindings }>();

cart.use("/:cartId", async (c, next) => {
  if (!isValidCartId(c.req.param("cartId"))) return c.json({ error: "Mã giỏ hàng không hợp lệ." }, 400);
  await next();
});

cart.get("/:cartId", async (c) => {
  const cartId = c.req.param("cartId");
  const data = await getCartView(c.env.DB, await readCart(c.env.CART, cartId));
  return c.json(data);
});

cart.put("/:cartId", async (c) => {
  const body: unknown = await c.req.json().catch(() => null);
  if (typeof body !== "object" || body === null || !("items" in body)) {
    return c.json({ error: "Dữ liệu giỏ hàng không hợp lệ." }, 400);
  }
  const lines = parseCartLines(body.items);
  const requested = Array.isArray(body.items) ? body.items : [];
  if (lines.length !== requested.length) return c.json({ error: "Sản phẩm hoặc số lượng không hợp lệ." }, 400);
  if (lines.length > 50) return c.json({ error: "Giỏ hàng vượt quá số sản phẩm cho phép." }, 400);
  const validProducts = lines.length
    ? await c.env.DB.prepare(
        `SELECT id, stock FROM products WHERE is_active = 1 AND id IN (${lines.map(() => "?").join(",")})`
      )
        .bind(...lines.map((line) => line.productId))
        .all<Pick<Product, "id" | "stock">>()
    : { results: [] };
  const inventory = new Map(validProducts.results.map((product) => [product.id, product.stock]));
  for (const line of lines) {
    const stock = inventory.get(line.productId);
    if (stock === undefined) return c.json({ error: "Một sản phẩm không còn được bán." }, 400);
    if (line.quantity > stock) return c.json({ error: "Số lượng vượt quá tồn kho." }, 409);
  }
  const cartId = c.req.param("cartId");
  await writeCart(c.env.CART, cartId, lines);
  return c.json(await getCartView(c.env.DB, lines));
});

cart.delete("/:cartId", async (c) => {
  await c.env.CART.delete(cartKey(c.req.param("cartId")));
  return c.json({ items: [], total: 0 });
});
