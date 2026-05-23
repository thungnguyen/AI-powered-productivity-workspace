# Chiến lược Mở rộng (Scaling) & Tích hợp AI (AI Readiness)

Để ZenNote đáp ứng tiêu chuẩn "Startup-grade", hệ thống DB phải được chuẩn bị sẵn sàng cho mức tải lớn và kỷ nguyên AI.

## 1. Cân nhắc Mở rộng trong Tương lai (Future Scaling Considerations)

### A. Tách biệt Đọc/Ghi (Read/Write Replicas)
- Sử dụng mô hình **CQRS** ở tầng Backend, ta có thể dễ dàng map cấu trúc Database thành **1 Master (Primary) cho luồng Ghi** (INSERT, UPDATE, DELETE) và **N Replicas (Secondary) cho luồng Đọc** (SELECT). MySQL Replication xử lý đồng bộ này.

### B. Cơ chế Phân mảnh (Database Sharding)
- Bằng cách thiết kế `workspace_id` xuất hiện trên MỌI BẢNG gốc, chúng ta đã biến Database thành cấu trúc Tenant-ready. 
- Khi một Workspace đạt kích thước dữ liệu quá khủng (Enterprise client), hoặc khi tổng số user vượt 1 triệu, ta có thể Shard Database theo `workspace_id`. (Toàn bộ dữ liệu của Workspace A sẽ nằm ở Server 1, Workspace B nằm ở Server 2).

### C. Cơ chế Lưu trữ Đóng băng (Cold Storage / Archiving)
- Các dữ liệu có `is_deleted = true` trên 90 ngày hoặc `activity_logs` cũ hơn 6 tháng có thể được tự động chuyển từ MySQL sang Amazon S3 / Snowflake để giảm chi phí lưu trữ ổ cứng SSD và giữ cho bảng dữ liệu gọn nhẹ.

## 2. Mức độ Sẵn sàng Tích hợp AI (AI Integration Readiness)

### A. Vector Embeddings
- Trong giai đoạn 2 (AI Roadmap), tính năng Semantic Search (Tìm kiếm ngữ nghĩa) sẽ cần lưu trữ **Vector Embeddings** của nội dung Ghi chú và Task.
- **Chiến lược**: Thay vì nhồi nhét vào bảng MySQL hiện tại gây chậm hệ thống, chúng ta sẽ bổ sung một Database chuyên dụng cho AI như **Pinecone**, **Milvus** hoặc **Qdrant**. Các bảng `notes` và `tasks` trong MySQL sẽ đóng vai trò Source of Truth (dữ liệu gốc), với cột `id` (UUID) được đồng bộ làm ID bên Vector DB.

### B. Xử lý Dữ liệu Phi cấu trúc
- Việc bổ sung trường `content_markdown` (Văn bản thô) thay vì chỉ lưu JSON hay HTML giúp các mô hình LLM (như GPT-4, Claude) dễ dàng đọc hiểu ngữ cảnh của Note để tóm tắt hoặc sinh text mà không cần tiền xử lý phức tạp (pre-processing parsing).

### C. AI Activity Tracing
- Bảng `activity_logs` sử dụng cột định dạng `JSON` cho `old_values` và `new_values`. AI Agent có thể đọc chuỗi JSON này để học "thói quen" của user (Ví dụ: Thường xuyên đổi trạng thái task từ Todo sang InProgress vào 9h sáng thứ Hai) để thực hiện tính năng "Smart Prioritization".
