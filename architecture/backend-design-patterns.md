# Giải thích Quyết định Thiết kế (Design Patterns & Scaling)

## 1. Tại sao sử dụng CQRS (Command Query Responsibility Segregation)?
Trong ứng dụng Productivity như ZenNote, thao tác Đọc (Query) diễn ra nhiều gấp hàng trăm lần thao tác Ghi (Command) do người dùng liên tục mở ứng dụng để xem To-do list và Notes.
- **Tối ưu hiệu năng**: Tách biệt logic Đọc/Ghi cho phép ta tối ưu hóa Query (ví dụ: dùng Dapper để query thẳng ra DTO thay vì qua EF Core Tracking) và giữ nguyên EF Core cho phần Command để đảm bảo an toàn dữ liệu.
- **Single Responsibility**: Mỗi tính năng (Feature) chỉ làm 1 việc duy nhất (hoặc trả dữ liệu, hoặc sửa dữ liệu), giúp code dễ đọc, dễ test và giảm rủi ro thay đổi code này làm hỏng code kia.

## 2. Khi nào nên dùng Repository Pattern?
- Chỉ dùng Repository Pattern để bọc các thao tác **Ghi (Commands)** (Create/Update/Delete) và lấy ra Domain Entity.
- Nó đóng vai trò là cầu nối chuẩn hóa dữ liệu, giúp tầng Application không bị phụ thuộc chặt vào Entity Framework (EF).
- **Lưu ý quan trọng**: Không lạm dụng Repository cho việc **Đọc (Queries)** phức tạp (chứa hàng tá `Include()`, `Select()`). Đối với Queries, Handler có thể inject trực tiếp `IApplicationDbContext` (Dùng EF Core NoTracking) hoặc Dapper để truy vấn siêu tốc trả thẳng ra DTO.

## 3. Khi nào nên dùng Specification Pattern?
- Dùng khi cần tái sử dụng một logic truy vấn (Query logic) phức tạp ở nhiều nơi.
- **Ví dụ**: Logic "Lấy tất cả Tasks chưa hoàn thành, quá hạn và thuộc về Workspace X" có thể được gom vào một `OverdueWorkspaceTasksSpecification`. Pattern này giúp Repository giữ được sự sạch sẽ (chỉ chứa các hàm Get cơ bản) và đẩy logic filter vào tầng Domain/Application.

## 4. Làm thế nào để Backend mở rộng (Scale) trong tương lai?
Kiến trúc ASP.NET Core kết hợp với Clean Architecture đã sẵn sàng 100% để scale:
- **Stateless API**: API không lưu trạng thái (Session). Do đó, khi lượng truy cập tăng, ta chỉ cần deploy ứng dụng lên Docker Container và chạy nhiều bản sao (Replicas) trên Kubernetes (K8s). Traffic sẽ được điều phối qua Load Balancer.
- **Database Scaling**: SignalR đã có Redis Backplane để đồng bộ message giữa các container. Database đã thiết kế sẵn Tenant-ID (`workspace_id`), rất dễ cho việc Sharding (tách DB) sau này.
- **Microservices Ready**: Vì các module (Notes, Tasks, Auth) đã được chia theo thư mục (Feature-based), việc cắt một Feature ra thành một Microservice độc lập sau này là cực kỳ dễ dàng so với kiến trúc code nguyên khối (Monolith lộn xộn).
