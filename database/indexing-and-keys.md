# Chiến lược Khóa và Index (Keys & Indexing Strategy)

Thiết kế kiến trúc Database cho ZenNote yêu cầu tốc độ truy xuất cực nhanh (giống Linear) ngay cả khi lượng dữ liệu phình to.

## 1. Chiến lược Khóa Ngoại (Foreign Key Strategy)
- Sử dụng Constraint Foreign Keys chặt chẽ ở Database level để đảm bảo **Toàn vẹn Dữ liệu (Data Integrity)**.
- `ON DELETE RESTRICT` mặc định cho các quan hệ quan trọng (Ví dụ: Không thể xóa Workspace nếu vẫn còn Task/Note bên trong).
- Việc xóa dữ liệu thực tế (Hard Delete) sẽ hiếm khi xảy ra do sử dụng Soft Delete (`is_deleted` = true).

## 2. Tối ưu hóa UUID cho Khóa Chính (Primary Keys)
Vì sử dụng UUID, việc Insert dữ liệu vào MySQL (dùng kiến trúc InnoDB Clustered Index B-Tree) sẽ gây phân mảnh bộ nhớ (Page fragmentation) nếu dùng UUID v4 ngẫu nhiên.
- **Giải pháp**: Sử dụng **UUID v7** (Time-sorted UUIDs) để đảm bảo UUID sinh ra tuần tự theo thời gian, giúp tăng tốc độ INSERT và phân trang (Pagination) mà không làm phân mảnh B-Tree. Nếu dùng MySQL 8.0+, có thể lưu trữ dưới dạng `BINARY(16)` thay vì `CHAR(36)` để tiết kiệm 50% dung lượng RAM/Index.

## 3. Chiến lược Indexing (Indexing Strategy)
- **Tenant Isolation Indexing (Workspace-based Index)**:
  Mọi query trong SaaS đều đi kèm điều kiện `WHERE workspace_id = ?`. Vì vậy, cần tạo **Composite Index** bắt đầu bằng `workspace_id`.
  - Bảng `tasks`: `INDEX idx_workspace_status (workspace_id, status)`
  - Bảng `tasks`: `INDEX idx_workspace_due_date (workspace_id, due_date)`
  - Bảng `notes`: `INDEX idx_workspace_updated_at (workspace_id, updated_at DESC)`

- **Partial / Filtered Indexes**:
  Tối ưu hóa các query bỏ qua dữ liệu Soft Deleted. (Lưu ý: MySQL không hỗ trợ Partial Index native như PostgreSQL, nên thay vào đó ta thêm cột `is_deleted` vào Composite Index).
  - Bảng `tasks`: `INDEX idx_workspace_is_deleted (workspace_id, is_deleted)`

- **Foreign Key Indexes**:
  Tất cả các cột có hậu tố `_id` mặc định phải được lập Index đơn (Single Index) để tăng tốc độ JOIN.

- **JSON Indexing (MySQL 8.0+)**:
  Bảng `activity_logs` lưu dữ liệu JSON. Nếu cần truy vấn lịch sử theo một trường cụ thể, có thể tạo **Generated Column** từ JSON và lập index trên cột ảo đó.
