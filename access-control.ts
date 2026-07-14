// Nền tảng phân quyền — dùng lại ở mọi Server Action và middleware admin.
// Giai đoạn 1 sẽ mở rộng thêm (workflow duyệt bài chi tiết); đây là phần lõi bắt buộc có từ đầu.

import { Role } from '@prisma/client';

export type Permission =
  | 'post.create'
  | 'post.edit'
  | 'post.publish'
  | 'post.delete'
  | 'page.edit'
  | 'page.publish'
  | 'media.upload'
  | 'media.delete'
  | 'user.manage'
  | 'settings.manage';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'post.create', 'post.edit', 'post.publish', 'post.delete',
    'page.edit', 'page.publish',
    'media.upload', 'media.delete',
    'user.manage', 'settings.manage',
  ],
  EDITOR: [
    'post.create', 'post.edit',
    'page.edit',
    'media.upload',
  ],
  REVIEWER: [
    'post.edit', 'post.publish',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Dùng trong Server Action: throw lỗi rõ ràng nếu không đủ quyền.
 * Luôn gọi hàm này ở ĐẦU mỗi Server Action nhạy cảm (publish, xóa, sửa settings...).
 */
export function assertPermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Không có quyền thực hiện hành động này (${permission}).`);
  }
}
