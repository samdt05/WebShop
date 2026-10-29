# Triển khai Mộc Nhiên lên Cloudflare

Hướng dẫn này triển khai cả frontend React và API Hono dưới dạng **một Cloudflare Worker**. D1 lưu danh mục, sản phẩm và đơn hàng demo; KV lưu giỏ hàng. Deploy thông thường không chạy seed, migration hoặc lệnh xóa dữ liệu.

## 1. Kiến trúc

- Vite build frontend vào `apps/web/dist`.
- Wrangler đọc thư mục trên qua cấu hình `[assets]` trong `apps/api/wrangler.toml`.
- Cloudflare Static Assets phục vụ các file frontend; `not_found_handling = "single-page-application"` chuyển URL trang con về ứng dụng SPA.
- `run_worker_first = ["/api/*"]` đảm bảo request API luôn đi vào Hono. Các route `/api/*` không tồn tại trả JSON 404.
- D1 binding tên `DB`, database tên `store-db-moc-nhien-demo`, lưu sản phẩm, danh mục và đơn hàng.
- KV binding tên `CART` lưu giỏ hàng với key `cart:<cartId>` và TTL 30 ngày.
- Không có Worker frontend hoặc backend thứ hai.

## 2. Yêu cầu

- Node.js 20.19+ hoặc 22.12+, npm.
- Tài khoản Cloudflare có quyền tạo Workers, D1 và KV.
- Wrangler được cài theo dependency của dự án; không cần cài Wrangler global.

Mở PowerShell tại thư mục gốc dự án, cài dependency và xác nhận Wrangler:

```powershell
npm install
npx wrangler --version
```

## 3. Đăng nhập và kiểm tra tài khoản

```powershell
npx wrangler login
npx wrangler whoami
npx wrangler d1 list
npx wrangler kv namespace list
```

Đảm bảo tài khoản hiển thị là tài khoản bạn định dùng trước khi tạo hoặc sửa tài nguyên.

## 4. Tạo D1 và KV

Tạo database với tên cần dùng trong cấu hình:

```powershell
npx wrangler d1 create store-db-moc-nhien-demo
```

Tạo KV namespace production:

```powershell
npx wrangler kv namespace create CART
```

Wrangler in ra ID của từng tài nguyên. Không dùng namespace preview làm ID production. Nếu đã có tài nguyên cùng tên, kiểm tra lại bằng các lệnh `d1 list` và `kv namespace list` thay vì tạo thêm theo cảm tính.

## 5. Cập nhật ID và xác minh

Mở [apps/api/wrangler.toml](./apps/api/wrangler.toml). Dự án hiện đã được cấu hình với D1 `store-db-moc-nhien-demo` và namespace KV `CART` đã tạo cho tài khoản hiện tại. Nếu triển khai trên tài khoản khác, thay `database_id` và ID trong `[[kv_namespaces]]` bằng ID tài nguyên của tài khoản đó. Nếu tên database khác, cập nhật `database_name` cho khớp. Giữ binding `DB`, binding `CART` và tên Worker `moc-nhien-store`.

Xác minh tài nguyên trong đúng tài khoản:

```powershell
npx wrangler whoami
npx wrangler d1 list
npx wrangler kv namespace list
```

Đối chiếu ID trong danh sách với `wrangler.toml`, đặc biệt khi có nhiều tài khoản Cloudflare.

## 6. Khởi tạo D1 remote lần đầu

Chạy lệnh có chủ đích sau khi xác nhận ID và tài khoản:

```powershell
npm run db:init:remote -w apps/api
```

Script remote áp dụng migration `migrations/0001_initial.sql` bằng migration runner của Wrangler, sau đó chạy `seed.sql`. Seed tạo 4 danh mục và 16 sản phẩm demo mới; lệnh seed dùng `INSERT OR IGNORE` với ID/slug ổn định nên có thể chạy lại và không xóa dữ liệu hiện có. Trên database mới, migration tạo schema từ đầu. Trên database đã có migration này, Wrangler báo không còn migration cần áp dụng rồi seed tiếp tục.

## 7. An toàn dữ liệu, seed và migration

- Deploy chỉ build asset và phát hành Worker; không tự seed, reset hoặc thay đổi bảng.
- `db:init` và `db:init:remote` là thao tác chủ động riêng. Script remote chỉ chạy khi người dùng gọi; script sử dụng migration runner thay vì gửi toàn bộ schema qua lệnh D1 import.
- `seed.sql` không xóa dữ liệu; dữ liệu mẫu có thể được bổ sung vào database đã tồn tại nếu ID/slug chưa có.
- Với thay đổi schema sau này, thêm file SQL có số thứ tự mới trong `apps/api/migrations/`, kiểm tra SQL và backup phù hợp, sau đó áp dụng có chủ đích:

```powershell
npx wrangler d1 migrations apply DB --remote
```

- Khởi tạo schema remote lần đầu dùng `migrations/0001_initial.sql`; `schema.sql` dành cho D1 local. Deploy không tự chạy migration. Không chạy `DROP TABLE`, xóa database hoặc lệnh reset trên production như một bước deploy thông thường.
- Database local tách khỏi remote. Các lệnh `--local` không thay đổi D1 production.

## 8. Kiểm tra trước khi deploy

Từ thư mục gốc:

```powershell
npm run typecheck
npm run build
npm run deploy -w apps/api -- --dry-run
```

Lệnh cuối đóng gói Worker mà không upload. Có thể dùng script tương đương `npm run dry-run -w apps/api`. Đọc output và xử lý cảnh báo/lỗi trước khi deploy thật. Cấu hình assets trỏ đến `../web/dist`, vì vậy chạy build frontend trước dry-run/deploy.

## 9. Deploy production

Khi đã xác nhận tài khoản, ID D1/KV, dữ liệu và dry-run:

```powershell
npm run deploy
```

Root script build frontend trước, sau đó gọi `wrangler deploy` từ workspace API. URL Worker thực tế sẽ được Wrangler in trong kết quả; dùng chính URL đó để kiểm tra, không điền URL mẫu.

## 10. Kiểm tra website, API và ảnh

Mở URL vừa được deploy. Kiểm tra một số request:

```powershell
curl.exe https://<URL-WORKER-THUC-TE>/api/health
curl.exe https://<URL-WORKER-THUC-TE>/api/categories
curl.exe https://<URL-WORKER-THUC-TE>/api/products
curl.exe -I https://<URL-WORKER-THUC-TE>/images/coc-gom.svg
```

Thay `<URL-WORKER-THUC-TE>` bằng hostname Wrangler vừa báo. Không đưa dấu ngoặc nhọn vào lệnh. Kiểm tra trực tiếp trang chủ, lọc danh mục, tìm kiếm, mở chi tiết, thêm/xóa/sửa số lượng giỏ và gửi đơn demo. Mở trực tiếp một URL chi tiết sản phẩm để xác nhận SPA fallback.

Toàn bộ hình sản phẩm là SVG cục bộ trong `apps/web/public/images/`; không phụ thuộc dịch vụ ảnh bên ngoài. Component ảnh có ảnh dự phòng cục bộ `placeholder.svg`.

## 11. Chạy local

Trong thư mục gốc, khởi tạo D1 local và build assets một lần:

```powershell
npm install
npm run db:init -w apps/api
npm run build
```

Mở hai terminal tại thư mục gốc:

Terminal 1:

```powershell
npm run dev -w apps/api
```

Terminal 2:

```powershell
npm run dev -w apps/web
```

Mở địa chỉ Vite (mặc định `http://localhost:5173`). Vite proxy `/api/*` về Wrangler local tại `http://127.0.0.1:8787`. D1/KV local nằm dưới `apps/api/.wrangler/`. Sau khi sửa frontend chạy lại build nếu muốn thử qua Wrangler; Vite dev tự cập nhật frontend trên trình duyệt.

## 12. Cập nhật phiên bản

1. Cập nhật mã nguồn và thêm migration mới nếu cấu trúc D1 cần thay đổi.
2. Chạy `npm run typecheck`, `npm run build` và dry-run.
3. Nếu có migration, review nội dung và áp dụng riêng lên D1 đúng môi trường; không trông chờ deploy tự chạy migration.
4. Deploy bằng `npm run deploy`.
5. Kiểm tra URL Worker, health API, dữ liệu và chức năng chính.

## 13. Sự cố thường gặp

- **Còn placeholder ID:** tạo tài nguyên và cập nhật cả hai ID trong `apps/api/wrangler.toml`.
- **Sai tài khoản Cloudflare:** chạy `npx wrangler whoami`, đăng nhập lại bằng `npx wrangler login`, rồi đối chiếu ID.
- **Không tìm thấy D1/KV:** kiểm tra tên database trong `database_name`, binding, ID thật và quyền truy cập tài khoản.
- **Không tìm thấy bảng:** chạy `npm run db:init:remote -w apps/api` sau khi xác nhận đây là database mong muốn.
- **Dry-run báo thiếu assets:** chạy `npm run build` trước; kiểm tra `apps/web/dist`.
- **API hoạt động nhưng trang con 404:** xác nhận asset config có `not_found_handling = "single-page-application"` và Worker đã deploy từ cấu hình hiện tại.
- **Trang local không lấy được API:** chạy Wrangler ở cổng 8787; để Vite chạy ở terminal riêng và kiểm tra proxy trong `apps/web/vite.config.ts`.
- **Ảnh vỡ:** kiểm tra file SVG có trong `apps/web/public/images/`, URL `/images/<tên>.svg` và kết quả build static assets.
- **Giỏ hàng mất sau thời gian dài:** KV có TTL 30 ngày; giỏ đã hết hạn được xem là trống. Dữ liệu D1 không bị ảnh hưởng.

## 14. Rollback và khôi phục

Workers hỗ trợ xem các phiên bản deployment và chuyển traffic về phiên bản Worker trước thông qua Cloudflare Dashboard/Workers Versions, tùy trạng thái và tính năng tài khoản. Có thể dùng `npx wrangler deployments list` để xem lịch sử; kiểm tra cú pháp `npx wrangler rollback --help` trong phiên bản Wrangler đang cài và dùng đúng version/deployment ID được Cloudflare hiển thị. Rollback Worker không tự khôi phục schema hoặc dữ liệu D1/KV.

Trước migration rủi ro, lưu bản backup D1 theo phương thức Cloudflare hỗ trợ cho tài khoản/plan, và đánh giá khả năng tương thích ngược của code. Khôi phục D1 từ backup và rollback Worker là hai thao tác riêng. Không xóa database hoặc KV để xử lý lỗi triển khai.
