# Giai đoạn 0 — Nền tảng: hướng dẫn chạy

## Các bước setup

```bash
# 1. Copy các file này vào project Next.js (hoặc tạo mới)
npx create-next-app@latest ava-dental --typescript --tailwind --app
cd ava-dental
# copy toàn bộ src/, prisma/, docker-compose.yml, .env.example vào đây

# 2. Cài dependencies (đã liệt kê trong package.json)
npm install

# 3. Copy .env.example -> .env và chỉnh sửa (đặc biệt AUTH_SECRET)
cp .env.example .env
# Tạo AUTH_SECRET ngẫu nhiên:
openssl rand -base64 32

# 4. Khởi động Postgres + Redis local
docker compose up -d

# 5. Migrate DB
npx prisma migrate dev --name init

# 6. Seed dữ liệu (tạo admin, category, settings mặc định)
npm run db:seed

# 7. Chạy dev server
npm run dev
```

## Đã hoàn thành trong Giai đoạn 0

- ✅ Prisma schema đầy đủ: `User/Role`, `Page`, `Post`, `PostVersion` (versioning), `Category`, `Tag`, `SeoMeta`, `Redirect`, `Media`, `Setting`, `AuditLog`
- ✅ RBAC nền tảng (`access-control.ts`) — 3 role: ADMIN / EDITOR / REVIEWER
- ✅ Auth.js với Credentials provider, JWT session có kèm role
- ✅ Middleware bảo vệ toàn bộ `/admin/*` ở tầng edge (chưa đăng nhập → redirect)
- ✅ `sanitize.ts` — chặn XSS cho nội dung bài viết
- ✅ Docker Compose cho Postgres + Redis local dev
- ✅ Seed script tạo admin + dữ liệu mặc định

## Việc cần làm ngay sau khi chạy xong

1. Đăng nhập bằng `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` trong `.env`
2. **Đổi mật khẩu admin ngay** (chức năng đổi mật khẩu sẽ làm ở Giai đoạn 1 cùng UI quản lý user)
3. Kiểm tra bảng `Setting` trong `prisma studio` (`npm run db:studio`) đã có hotline/địa chỉ mặc định

## Chưa làm ở Giai đoạn 0 (sẽ làm ở Giai đoạn 1)

- UI đăng nhập (`/admin-login/page.tsx`)
- UI quản lý user, đổi mật khẩu
- Module media (upload thật lên R2)
- Module content-versioning (tạo snapshot tự động khi save)

---
Xác nhận chạy được ở máy bạn trước khi mình viết tiếp Giai đoạn 1 nhé.
