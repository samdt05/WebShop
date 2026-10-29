import { Hono } from "hono";
import { cart } from "./routes/cart";
import { categories } from "./routes/categories";
import { orders } from "./routes/orders";
import { products } from "./routes/products";
import type { Bindings } from "./lib/types";
import { securityHeaders } from "./middleware/securityHeaders";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", securityHeaders);
app.get("/api/health", (c) => c.json({ status: "ok", service: "moc-nhien-store" }));
app.route("/api/products", products);
app.route("/api/categories", categories);
app.route("/api/cart", cart);
app.route("/api/orders", orders);
app.notFound((c) => c.json({ error: "Không tìm thấy API." }, 404));
app.onError((error, c) => {
  console.error("API request failed:", error);
  return c.json({ error: "Đã xảy ra lỗi máy chủ. Vui lòng thử lại." }, 500);
});

export default {
  fetch(request: Request, env: Bindings, executionContext: ExecutionContext): Response | Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname !== "/api" && !pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }
    return app.fetch(request, env, executionContext);
  }
};
