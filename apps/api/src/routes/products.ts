import { Hono } from "hono";
import { findProductBySlug, listProducts } from "../services/catalog";
import type { Bindings } from "../lib/types";

export const products = new Hono<{ Bindings: Bindings }>();

products.get("/", async (c) => {
  const search = (c.req.query("q") ?? "").trim().slice(0, 100);
  const category = c.req.query("category") ?? "";
  const featured = c.req.query("featured") === "true";
  const result = await listProducts(c.env.DB, { search, category, featured });
  return c.json({ products: result });
});

products.get("/:slug", async (c) => {
  const product = await findProductBySlug(c.env.DB, c.req.param("slug"));
  if (!product) return c.json({ error: "Không tìm thấy sản phẩm." }, 404);
  return c.json({ product });
});
