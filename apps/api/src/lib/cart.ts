import type { CartLine, CartViewLine } from "./types";

const CART_TTL_SECONDS = 60 * 60 * 24 * 30;
const MAX_QUANTITY = 99;

export function isValidCartId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{16,80}$/.test(value);
}

export function parseCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const quantities = new Map<string, number>();
  for (const item of value) {
    if (
      typeof item === "object" &&
      item !== null &&
      "productId" in item &&
      typeof item.productId === "string" &&
      /^[a-zA-Z0-9_-]{1,80}$/.test(item.productId) &&
      "quantity" in item &&
      Number.isInteger(item.quantity) &&
      Number(item.quantity) > 0 &&
      Number(item.quantity) <= MAX_QUANTITY
    ) {
      quantities.set(
        item.productId,
        Math.min(MAX_QUANTITY, (quantities.get(item.productId) ?? 0) + Number(item.quantity))
      );
    }
  }
  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

export function cartKey(cartId: string): string {
  return `cart:${cartId}`;
}

export async function readCart(kv: KVNamespace, cartId: string): Promise<CartLine[]> {
  const value = await kv.get<CartLine[]>(cartKey(cartId), "json");
  return parseCartLines(value);
}

export async function writeCart(kv: KVNamespace, cartId: string, lines: CartLine[]): Promise<void> {
  await kv.put(cartKey(cartId), JSON.stringify(lines), { expirationTtl: CART_TTL_SECONDS });
}

export async function getCartView(
  db: D1Database,
  lines: CartLine[]
): Promise<{ items: CartViewLine[]; total: number }> {
  if (lines.length === 0) return { items: [], total: 0 };
  const placeholders = lines.map(() => "?").join(",");
  const rows = await db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p JOIN categories c ON c.id = p.category_id
       WHERE p.is_active = 1 AND p.id IN (${placeholders})`
    )
    .bind(...lines.map((line) => line.productId))
    .all<CartViewLine["product"]>();
  const productById = new Map(rows.results.map((product) => [product.id, product]));
  const items = lines.flatMap((line) => {
    const product = productById.get(line.productId);
    if (!product) return [];
    return [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }];
  });
  return { items, total: items.reduce((sum, item) => sum + item.lineTotal, 0) };
}
