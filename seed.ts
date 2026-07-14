// Chạy: npx tsx prisma/seed.ts
// Mục đích: tạo tài khoản ADMIN đầu tiên + dữ liệu mặc định để hệ thống chạy được ngay.

import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Tạo admin đầu tiên — ĐỔI EMAIL/MẬT KHẨU NÀY TRƯỚC KHI DEPLOY THẬT
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@avadental.vn';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Quản trị viên',
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`✔ Admin: ${admin.email} (mật khẩu tạm: đổi ngay sau khi đăng nhập lần đầu)`);

  // 2. Category mặc định
  const categories = [
    { name: 'Kiến thức Implant', slug: 'kien-thuc-implant' },
    { name: 'Niềng răng', slug: 'nieng-rang' },
    { name: 'Bọc răng sứ', slug: 'boc-rang-su' },
    { name: 'Khuyến mãi', slug: 'khuyen-mai' },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`✔ Đã tạo ${categories.length} category mặc định`);

  // 3. Settings mặc định
  const settings: Record<string, string> = {
    hotline: '028.2206.6666',
    zalo: '0388.888.272',
    address: '283/91 Cách Mạng Tháng 8, Phường 12, Quận 10, Tp.HCM',
    working_hours: 'Thứ 2 - Chủ Nhật: 08:00-12:00, 13:00-17:00',
    license_number: '04405/SYT-GPHĐ',
    ga4_id: '',
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`✔ Đã tạo ${Object.keys(settings).length} settings mặc định`);

  // 4. Trang chủ rỗng (để Page Builder có chỗ bắt đầu)
  await prisma.page.upsert({
    where: { slug: '' },
    update: {},
    create: {
      slug: '',
      title: 'Trang chủ',
      layoutJson: { blocks: [] },
      status: 'DRAFT',
      updatedById: admin.id,
    },
  });
  console.log('✔ Đã tạo Page trang chủ (rỗng, chờ dựng qua Page Builder)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
