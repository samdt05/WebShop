# Mộc Nhiên — cửa hàng demo

Website thương mại điện tử minh họa được xây dựng mới với React, Vite, TypeScript, Hono và Cloudflare Workers. Frontend và API được phát hành cùng một Worker; D1 lưu danh mục, sản phẩm và đơn hàng demo, KV lưu giỏ hàng theo mã ngẫu nhiên. Font Be Vietnam Pro được đóng gói cùng frontend, hỗ trợ dấu tiếng Việt và không cần tải font từ dịch vụ ngoài.

## Chạy nhanh

Yêu cầu Node.js 20.19+ hoặc 22.12+ và npm.

```bash
npm install
npm run db:init -w apps/api
npm run build
```

Sau đó mở hai terminal:

```bash
npm run dev -w apps/api
```

```bash
npm run dev -w apps/web
```

Mở URL Vite hiển thị trong terminal (thường là `http://localhost:5173`). Vite chuyển tiếp `/api/*` đến Wrangler tại `http://127.0.0.1:8787`. Dữ liệu D1 và KV local được Wrangler lưu trong `apps/api/.wrangler/`.

## Scripts

| Lệnh | Mục đích |
| --- | --- |
| `npm install` | Cài dependency cho các workspace |
| `npm run typecheck` | Kiểm tra TypeScript web và API |
| `npm run build` | Kiểm tra/build frontend vào `apps/web/dist` |
| `npm run deploy` | Build frontend rồi deploy Worker |
| `npm run db:init -w apps/api` | Tạo schema và seed vào D1 local |
| `npm run db:init:remote -w apps/api` | Chủ động tạo schema và seed vào D1 remote |
| `npm run deploy -w apps/api -- --dry-run` | Đóng gói thử Worker mà không deploy |

Chi tiết khởi tạo Cloudflare, môi trường local, cập nhật migration và khôi phục được ghi trong [DEPLOY.md](./DEPLOY.md).

## Phạm vi demo

- Tìm kiếm, lọc danh mục, trang chi tiết sản phẩm và ảnh SVG nội bộ.
- Giỏ hàng dùng KV, số lượng và giá được xác thực/tính lại từ D1.
- Form tạo đơn demo lưu thông tin khách hàng và các dòng đơn trong D1.
- Chưa có cổng thanh toán, vận chuyển, đăng nhập hay trang quản trị. Website thông báo rõ đơn hàng chỉ để minh họa; không gửi giao dịch thực.

## API

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products?q=...&category=...`
- `GET /api/products/:slug`
- `GET /api/cart/:cartId`
- `PUT /api/cart/:cartId` với `{ "items": [{ "productId": "...", "quantity": 1 }] }`
- `DELETE /api/cart/:cartId`
- `POST /api/orders` với `cartId`, `customerName`, `phone`, `address`
