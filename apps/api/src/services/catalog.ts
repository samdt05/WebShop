import type { Product } from "../lib/types";

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

const productFields = `
  p.id, p.name, p.slug, p.short_description, p.description, p.price,
  p.original_price, p.category_id, c.name AS category_name,
  c.slug AS category_slug, p.image, p.stock, p.is_active, p.created_at
`;

export async function listProducts(
  db: D1Database,
  options: { search: string; category: string; featured: boolean }
): Promise<Product[]> {
  const conditions = ["p.is_active = 1"];
  const params: (string | number)[] = [];
  if (options.search) {
    conditions.push("(p.name LIKE ? OR p.short_description LIKE ?)");
    params.push(`%${options.search}%`, `%${options.search}%`);
  }
  if (options.category) {
    conditions.push("c.slug = ?");
    params.push(options.category);
  }
  const where = conditions.join(" AND ");
  const sql = `SELECT ${productFields}
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE ${where}
    ORDER BY ${options.featured ? "p.stock DESC, " : ""}p.created_at DESC, p.name ASC
    LIMIT 100`;
  const result = await db.prepare(sql).bind(...params).all<Product>();
  return result.results;
}

export async function findProductBySlug(db: D1Database, slug: string): Promise<Product | null> {
  return db
    .prepare(
      `SELECT ${productFields}
       FROM products p JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_active = 1`
    )
    .bind(slug)
    .first<Product>();
}

export async function listCategories(db: D1Database): Promise<CatalogCategory[]> {
  const result = await db
    .prepare(
      `SELECT c.id, c.name, c.slug, c.description, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
       GROUP BY c.id
       ORDER BY c.sort_order ASC`
    )
    .all<CatalogCategory>();
  return result.results;
}
