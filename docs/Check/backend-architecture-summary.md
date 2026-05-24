# Tổng quan Kiến trúc Backend ZenNote

Tài liệu này giải thích chi tiết toàn bộ phần nền tảng Backend mà chúng ta vừa xây dựng. Mục tiêu là giúp bạn hiểu rõ ý nghĩa của từng thư mục, từng tệp tin và cách chúng "nói chuyện" với nhau để tạo ra một hệ thống vững chắc, có khả năng mở rộng như các ứng dụng SaaS lớn.

---

## 1. Triết lý Thiết kế: Clean Architecture

Backend của ZenNote được thiết kế theo mô hình **Clean Architecture**. Ý tưởng cốt lõi của mô hình này là **Sự Phụ Thuộc (Dependency) luôn chỉ đi một chiều hướng vào trung tâm**. 

Dự án được chia thành 4 lớp (Layers) tương ứng với 4 Project trong Solution:

### 1.1. `ZenNote.Domain` (Trái tim hệ thống)
- **Mục đích**: Chứa các "Thực thể" (Entities) và các khái niệm cốt lõi của bài toán nghiệp vụ. 
- **Đặc điểm**: Đây là dự án độc lập hoàn toàn. Nó KHÔNG tham chiếu tới bất kỳ dự án hay thư viện bên ngoài nào (Không biết SQL là gì, không biết API là gì).
- **Những gì chúng ta đã làm**:
  - Tạo `EntityBase.cs`, `AuditableEntity.cs`: Chứa các trường ID, CreatedAt, UpdatedAt dùng chung.
  - Tạo `User.cs` và `Workspace.cs`: Đại diện cho người dùng và không gian làm việc.

### 1.2. `ZenNote.Application` (Bộ não điều phối)
- **Mục đích**: Chứa logic xử lý của ứng dụng (Use Cases). Tầng này sẽ nhận yêu cầu, kiểm tra dữ liệu, điều phối các quy trình, và trả ra kết quả.
- **Đặc điểm**: Chỉ phụ thuộc vào `Domain`. Nó định nghĩa ra các "Interfaces" (hợp đồng) mà các tầng bên ngoài phải tuân theo (ví dụ: `IApplicationDbContext`, `ICacheService`).
- **Những gì chúng ta đã làm**:
  - Khởi tạo **CQRS** (Command Query Responsibility Segregation) bằng thư viện `MediatR` (như file `LoginQuery.cs`). Tách biệt rõ "Đọc dữ liệu" (Query) và "Thay đổi dữ liệu" (Command).
  - Tích hợp **FluentValidation**: Tự động kiểm tra dữ liệu đầu vào.
  - Xây dựng **Result Pattern** (`Result.cs`, `Error.cs`): Thay vì hệ thống ném lỗi (throw Exception) tung tóe khi sai mật khẩu, ta sẽ trả về một `Result.Failure(Error)` để kiểm soát chặt chẽ.

### 1.3. `ZenNote.Infrastructure` (Chân tay của hệ thống)
- **Mục đích**: Triển khai các công nghệ cụ thể (Database, Redis, Gửi Email, JWT, SignalR). Tầng này "nhúng" tay vào hệ thống bên ngoài.
- **Đặc điểm**: Phụ thuộc vào `Application`. Nó code thực tế cho các Interfaces mà `Application` đã định nghĩa.
- **Những gì chúng ta đã làm**:
  - **Entity Framework Core**: Thiết lập `ApplicationDbContext` để kết nối MySQL.
  - **AuditableEntityInterceptor**: Tự động hóa việc ghi nhận thời gian `CreatedAt`/`UpdatedAt` trước khi lưu vào database.
  - **JwtTokenGenerator**: Chứa logic sinh token bảo mật thật sự.
  - **RedisCacheService**: Giao tiếp với Redis.

### 1.4. `ZenNote.Api` (Lớp giao tiếp - Cửa ngõ)
- **Mục đích**: Cung cấp các endpoints (URL) để Frontend gọi tới (giao tiếp qua HTTP/JSON).
- **Đặc điểm**: Cửa ngõ ngoài cùng. Phụ thuộc vào cả `Application` và `Infrastructure`.
- **Những gì chúng ta đã làm**:
  - Tạo **Controllers** (`AuthController.cs`): Chỉ nhận Request, gọi MediatR xử lý, trả về JSON. KHÔNG chứa logic nghiệp vụ.
  - **Middlewares**: `ExceptionHandlingMiddleware` (Bắt mọi lỗi của hệ thống, format ra JSON thay vì màn hình sập hệ thống), `RequestLoggingMiddleware` (Ghi lại nhật ký người dùng gọi API gì, mất bao lâu).
  - **Swagger**: Tạo trang tài liệu API trực quan.

---

## 2. Sự tương tác và Luồng dữ liệu (Data Flow)

Để hiểu rõ cách 4 tầng này tương tác, hãy tưởng tượng luồng đi của một Request cơ bản: **"User bấm nút Đăng nhập"**.

1. **Frontend (Flutter)** gửi Request HTTP POST `/api/v1/auth/login` kèm `{"email": "...", "password": "..."}`.
2. **API Layer (`AuthController`)** tiếp nhận. Nó không tự đi kiểm tra DB. Nó tạo ra một thông điệp là `LoginQuery` và "quăng" nó cho `MediatR` (Người chuyển phát thư).
   ```csharp
   var result = await Mediator.Send(new LoginQuery(email, password));
   ```
3. **MediatR (Pipeline Behaviors)**: Trước khi giao thư cho người xử lý, nó đi qua các chốt chặn (Behaviors) ở `Application Layer`:
   - Chốt chặn 1 (`LoggingPipelineBehavior`): Bấm đồng hồ tính giờ request.
   - Chốt chặn 2 (`ValidationPipelineBehavior`): Dùng `LoginQueryValidator` kiểm tra xem email có đúng định dạng không, mật khẩu có > 6 ký tự không. Nếu lỗi, từ chối luôn, ném ra `ValidationException`.
4. **Application Layer (`LoginQueryHandler`)**: Nếu qua được chốt chặn, MediatR tìm đúng Handler để giải quyết.
   - Handler sẽ lấy `Email` & `Password` ra.
   - Nó yêu cầu `IApplicationDbContext` (Interface) tìm User trong DB.
   - Nếu tìm thấy và đúng, nó gọi `IJwtTokenGenerator` (Interface) sinh Token.
   - Handler đóng gói Token vào `Result.Success(token)` và trả ngược lại.
5. **API Layer (`AuthController`)**: Nhận được `Result`, chuyển nó thành Response HTTP chuẩn (Mã 200 OK với JSON).
6. **Middleware (`ExceptionHandlingMiddleware`)**: Giả sử ở bước 3 bị lỗi `ValidationException`, Middleware này sẽ bắt lỗi và trả về HTTP 400 BadRequest kèm theo danh sách chi tiết các trường bị lỗi. Không bao giờ lộ StackTrace của server ra ngoài.

---

## 3. Lý do chúng ta thiết kế như vậy?

Mặc dù việc thiết lập có vẻ phức tạp và tạo nhiều file, nhưng đây là cấu trúc "Startup-grade / Enterprise-grade" mang lại lợi ích khổng lồ:

- **Bảo trì siêu dễ**: Khi một quy trình nghiệp vụ hỏng, bạn chỉ cần mở file `...Handler.cs` ra sửa, Controller và Database không hề bị ảnh hưởng.
- **Rất dễ Test**: Vì `Application` gọi tới `Infrastructure` thông qua Interface (ví dụ `IJwtTokenGenerator`), khi viết Unit Test, bạn có thể tạo ra các "Fake Generator" dễ dàng.
- **Mở rộng Database**: Nếu sau này dự án lớn lên, chuyển từ MySQL sang PostgreSQL hoặc SQL Server, bạn CHỈ CẦN sửa ở dự án `ZenNote.Infrastructure`, 3 tầng còn lại không cần động tới 1 dòng code nào.
- **Kiểm soát Lỗi & Response Tuyệt đối**: Controller siêu mỏng, không có try/catch rác rưởi. Tất cả đã có Middleware và Result Pattern lo.
- **Phù hợp với AI Agent**: Cấu trúc file rõ ràng, trách nhiệm đơn lẻ giúp AI (như tôi) đọc, hiểu và tự động sinh code bổ sung tính năng mới sau này với độ chính xác tuyệt đối mà không phá hỏng code cũ.
