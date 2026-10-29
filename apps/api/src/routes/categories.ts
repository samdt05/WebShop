import { Hono } from "hono";
import { listCategories } from "../services/catalog";
import type { Bindings } from "../lib/types";

export const categories = new Hono<{ Bindings: Bindings }>();

categories.get("/", async (c) => {
  return c.json({ categories: await listCategories(c.env.DB) });
});
