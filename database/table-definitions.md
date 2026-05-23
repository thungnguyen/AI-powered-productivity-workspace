# Cấu trúc Bảng dữ liệu (Table Definitions)

Tất cả các bảng cốt lõi trong ZenNote đều tuân thủ nguyên tắc:
1. **Khóa chính (PK)**: Sử dụng UUID (chuẩn v4 hoặc v7).
2. **Audit Fields**: Bắt buộc có `created_at`, `updated_at`, `created_by`, `updated_by`.
3. **Soft Delete**: Bắt buộc có `is_deleted` và `deleted_at`.

## 1. Hệ thống User & Xác thực (Core Identity)
- **`users`**: `id`, `email`, `password_hash`, `display_name`, `avatar_url`, `is_active`, `last_login_at`, [Audit + SoftDelete]
- **`refresh_tokens`**: `id`, `user_id` (FK), `token`, `expires_at`, `is_revoked`, `replaced_by_token`, `created_at`
- **`workspaces`**: `id`, `name`, `description`, `owner_id` (FK: users), `logo_url`, [Audit + SoftDelete]
- **`workspace_members`**: `workspace_id` (FK), `user_id` (FK), `role` (ENUM: 'Owner', 'Admin', 'Member', 'Guest'), `joined_at`

## 2. Hệ thống Năng suất (Productivity Modules)
- **`notes`**: `id`, `workspace_id` (FK), `title`, `content_markdown`, `content_html`, `is_pinned`, `color_code`, [Audit + SoftDelete]
- **`tasks`**: `id`, `workspace_id` (FK), `note_id` (FK - Nullable), `parent_task_id` (FK - Nullable cho Subtasks), `title`, `description`, `status` (ENUM: 'Todo', 'InProgress', 'Done'), `priority` (INT: 1-4), `due_date`, `completed_at`, [Audit + SoftDelete]
- **`tags`**: `id`, `workspace_id` (FK), `name`, `color_code`, [Audit + SoftDelete]
- **`task_tags`**: `task_id` (FK), `tag_id` (FK)

## 3. Hệ thống Hỗ trợ (Supporting Modules)
- **`reminders`**: `id`, `task_id` (FK), `user_id` (FK), `remind_at` (DateTime), `is_sent` (Boolean), `reminder_type` (ENUM: 'Push', 'Email')
- **`notifications`**: `id`, `user_id` (FK), `title`, `message`, `type` (ENUM: 'System', 'Mention', 'Reminder'), `is_read`, `read_at`, `created_at`
- **`attachments`**: `id`, `workspace_id` (FK), `entity_type` (ENUM: 'Note', 'Task'), `entity_id` (UUID), `file_name`, `file_url`, `file_size`, `mime_type`, `uploaded_by`, `created_at`
- **`activity_logs`**: `id`, `workspace_id` (FK), `user_id` (FK), `action_type` (ENUM: 'Create', 'Update', 'Delete'), `entity_type` (ENUM: 'Task', 'Note', 'Workspace'), `entity_id` (UUID), `old_values` (JSON), `new_values` (JSON), `created_at`

*(Lưu ý: Bảng Subtasks được gộp vào bảng Tasks thông qua khóa ngoại đệ quy `parent_task_id` để tối ưu hóa thiết kế).*
