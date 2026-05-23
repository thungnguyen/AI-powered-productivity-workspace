# Phạm vi MVP (MVP Scope)

Phiên bản Minimum Viable Product (MVP) của ZenNote sẽ chỉ tập trung vào các tính năng lõi để chứng minh khả năng "kết nối liền mạch giữa Ghi chú và Công việc" với tốc độ cực nhanh.

## In-Scope (Nằm trong phạm vi MVP)
1. **Xác thực người dùng (Auth)**: Đăng nhập/Đăng ký qua Email và Google (OAuth2).
2. **Không gian làm việc (Workspaces)**: Mỗi user có 1 workspace cá nhân mặc định.
3. **Ghi chú (Notes)**:
   - Trình soạn thảo Rich Text hỗ trợ cú pháp Markdown (giống Notion/Obsidian).
   - Tổ chức theo cấu trúc cây thư mục (Folders & Sub-folders).
4. **Quản lý Công việc (Tasks)**:
   - Có thể tạo check-list ngay bên trong 1 Ghi chú.
   - Trích xuất tự động các check-list đó ra màn hình "My Tasks" trung tâm.
   - Đặt deadline cơ bản cho Task.
5. **Đồng bộ hóa (Sync)**: Dữ liệu được lưu ở local (SQLite) trên app Flutter và đồng bộ ngầm (Background sync) lên MySQL thông qua API.

## Out-of-Scope (Chưa phát triển trong MVP)
- Làm việc nhóm (Collaboration / Real-time editing).
- Tích hợp AI (Auto-tagging, Summarize) - Sẽ nằm ở phase 2.
- Nhắc nhở qua Push Notification phức tạp (chỉ có in-app UI).
- Ứng dụng Desktop Native (MVP ưu tiên Web và Mobile trước).
