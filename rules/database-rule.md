# Nguyên tắc CSDL (Database Rules)

Bộ quy tắc thiết kế và truy xuất cơ sở dữ liệu cho MySQL và Redis trong dự án ZenNote.

## 1. Tiêu chuẩn MySQL (Relational Database)
- **Entity Framework Core**: Bắt buộc sử dụng cách tiếp cận Code-First. Mọi thay đổi schema phải thông qua EF Core Migrations.
- **Auditing**: Tất cả các bảng dữ liệu (trừ các bảng phụ join n-n) phải có các trường audit: `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`.
- **Soft Delete**: Áp dụng cờ (flag) `IsDeleted` thay vì xóa vật lý dữ liệu (hard delete). Cấu hình Global Query Filter trong EF Core để bỏ qua các bản ghi đã xóa.
- **Khóa chính**: Khuyến khích sử dụng UUID (GUID) cho khóa chính của các bảng phân tán, hoặc `BIGINT AUTO_INCREMENT` cho các bảng cần hiệu suất index cao.

## 2. Tiêu chuẩn Naming Schema (Quy ước đặt tên DB)
- **Bảng (Table)**: Sử dụng danh từ số nhiều (ví dụ: `Users`, `Workspaces`, `Tasks`).
- **Cột (Column)**: Sử dụng PascalCase (trong code C#) được EF Core ánh xạ tự động. Nếu map trực tiếp, tuân thủ snake_case tùy cấu hình, nhưng cần nhất quán.
- **Khóa ngoại (Foreign Key)**: Đặt tên theo cú pháp `[TênBảngĐơn][Id]`, ví dụ: `WorkspaceId`.

## 3. Tiêu chuẩn Redis (Caching & SignalR Backplane)
- **Namespace/Key Naming**: Mọi key trong Redis phải có tiền tố ứng dụng và phân loại, định dạng: `ZenNote:{Enviroment}:{Module}:{Key}` (Ví dụ: `ZenNote:Prod:Users:12345`).
- **TTL (Time To Live)**: Mọi dữ liệu cache bắt buộc phải được set thời gian hết hạn (Expiration Time) để tránh đầy bộ nhớ.
- **Cache Invalidation**: Khi có thao tác Ghi (Create/Update/Delete) trên CSDL chính, dữ liệu trong Redis tương ứng phải được xóa bỏ hoặc làm mới ngay lập tức.
