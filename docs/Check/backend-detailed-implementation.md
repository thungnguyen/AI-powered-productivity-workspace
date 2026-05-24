# Chi tiết Triển khai Mã nguồn Các Tầng Backend

Tài liệu này liệt kê "đến tận chân răng" những tệp tin mã nguồn (C#) mà chúng ta đã lập trình ở từng tầng, chức năng cụ thể của chúng là gì, và tại sao đoạn code đó lại quan trọng.

---

## 1. Tầng Domain (`ZenNote.Domain`)
Tầng này KHÔNG cài đặt bất kỳ thư viện NuGet nào ngoài code thuần C#.

### Core / Common
- **`IAuditableEntity.cs`** & **`ISoftDeletable.cs`**: Định nghĩa khuôn mẫu. Mọi thực thể trong hệ thống nếu có các cờ theo dõi như "Ai tạo, tạo khi nào" hay "Xóa mềm" thì phải implement các interface này.
- **`EntityBase.cs`**: Lớp chứa duy nhất thuộc tính `Id` (kiểu Guid). Mọi bảng dữ liệu đều kế thừa nó để có khóa chính nhất quán.
- **`AuditableEntity.cs`**: Kế thừa `EntityBase` và implement sẵn cả 2 interfaces bên trên. Nhờ vậy, thực thể User/Workspace chỉ cần kế thừa lớp này là có đủ Audit/Soft Delete.
- **`ValueObject.cs`**: Một class tiêu chuẩn của Domain-Driven Design (DDD). Hỗ trợ so sánh 2 object bằng giá trị các thuộc tính của chúng thay vì so sánh địa chỉ bộ nhớ (như kiểu chuỗi hay số vậy).
- **`DomainEvent.cs`**: Để phát ra các sự kiện trong nội bộ (ví dụ: `UserCreatedEvent`) ghi nhận chính xác thời gian xảy ra (`OccurredOn`).

### Entities
- **`User.cs`** & **`Workspace.cs`**: Hai thực thể đại diện cho cấu trúc database đã phân tích. Ánh xạ các cột cơ bản như `Email`, `PasswordHash`, `LogoUrl` và định nghĩa Navigation Properties (`OwnedWorkspaces`) để thiết lập mối quan hệ 1-N (1 người dùng có nhiều workspace).

---

## 2. Tầng Application (`ZenNote.Application`)
Cài đặt thư viện: `MediatR`, `FluentValidation` và tham chiếu đến EF Core `DbSet`.

### Xử lý Lỗi & Result Pattern (Mẫu Kết quả)
- **`Result.cs` & `Error.cs`**: Đây là cách hiện đại để thay thế việc `throw Exception`. Thay vì quăng lỗi bừa bãi, các hàm xử lý logic sẽ trả về `Result.Success(data)` hoặc `Result.Failure(error)`. Code bên ngoài dễ dàng kiểm tra biến `IsSuccess` để xử lý tiếp, giảm thiểu crash hệ thống.
- **`Exceptions/...`**: Các file ngoại lệ tùy chỉnh như `NotFoundException`, `ValidationException`, `UnauthorizedException`. Dành riêng cho những lỗi thực sự cần ngắt quy trình (ví dụ: data truyền lên từ client sai hoàn toàn).

### MediatR Behaviors (Đường ống kiểm duyệt)
- **`LoggingPipelineBehavior.cs`**: Một middleware cấp Application. Cứ mỗi khi API gọi MediatR truyền lệnh đi, file này tự động bấm giờ, log tên lệnh, và log xem mất bao nhiêu `ms` để thực thi xong.
- **`ValidationPipelineBehavior.cs`**: Tự động lấy tất cả các Fluent Validator trong hệ thống. Nếu Request gửi đến có lỗi validation, nó ngay lập tức quăng `ValidationException` để dừng lại, chặn không cho Handler phía sau chạy.

### Cấu hình Logic Nghiệp vụ (CQRS)
- **`LoginQuery.cs`**: File này cực kỳ độc đáo, nó chứa 3 thành phần trong 1:
  1. `LoginQuery` (Record): Gói dữ liệu truyền vào (`Email`, `Password`).
  2. `LoginQueryValidator`: Kiểm tra dữ liệu (vd: Email phải chuẩn, Pass phải > 6 ký tự).
  3. `LoginQueryHandler`: Chứa logic xử lý thật: Nó nhận `Email/Pass`, so khớp điều kiện. Nếu đúng, nó gọi `_jwtTokenGenerator` để tạo token và gói vào `Result.Success` trả về.

---

## 3. Tầng Infrastructure (`ZenNote.Infrastructure`)
Chứa toàn bộ các thư viện kết nối ra ngoài: `Pomelo.EntityFrameworkCore.MySql`, `StackExchangeRedis`, `IdentityModel.Tokens.Jwt`, `SignalR`.

### Database (Entity Framework Core)
- **`AuditableEntityInterceptor.cs`**: Một "màng lọc" trước khi lưu vào database (`SaveChanges`). Nó rà soát tất cả các object đang thay đổi. Nếu thấy lệnh INSERT, nó tự động điền ngày tạo hiện tại. Nếu thấy lệnh DELETE, nó đổi thành UPDATE cờ `IsDeleted = true`. Lập trình viên không bao giờ phải viết lệnh điền ngày tháng thủ công.
- **`UserConfiguration.cs`** & **`WorkspaceConfiguration.cs`**: Khai báo rằng Email là duy nhất (Unique Index), độ dài tối đa của cột. Đặc biệt nhất là lệnh `builder.HasQueryFilter(x => !x.IsDeleted)` - lệnh này khiến mọi câu lệnh truy vấn `.ToList()` hay `.FirstOrDefault()` tự động loại bỏ các record đã xóa mềm.
- **`ApplicationDbContext.cs`**: Nơi nhét Interceptor và Configurations vào lõi của EF Core.

### Các Dịch Vụ Hạ Tầng (Services)
- **`RedisCacheService.cs`**: Implement các hàm Get/Set data dùng chuỗi JSON và đẩy thẳng vào Redis lưu trữ.
- **`JwtTokenGenerator.cs`**: Dùng thuật toán `HmacSha256`, lấy khóa bí mật (SecretKey) từ `appsettings.json`, gắn các thông tin (Claims) như UserId, Email vào, sinh ra một chuỗi JWT dài ngoằng để cấp cho client.
- **`CurrentUserService.cs`**: Móc vào `HttpContext` của ASP.NET để trích xuất ra ID của người dùng hiện tại đang bấm nút gửi API.
- **`NotificationHub.cs`** & **`SignalRService.cs`**: Thiết lập WebSocket, cung cấp kênh thời gian thực. Bất cứ khi nào cần đẩy thông báo đẩy (Push notification), chỉ cần gọi `_hubContext.Clients.User().SendAsync()`.

---

## 4. Tầng API (`ZenNote.Api`)
Lớp này hứng Request và cấu hình mọi thứ trong hệ thống lại với nhau.

### Middleware (Bộ lọc Request HTTP)
- **`RequestLoggingMiddleware.cs`**: Chặn mọi request HTTP vừa vào cổng, in ra log (VD: `[HTTP POST] /api/v1/auth/login started...`), tính toán thời gian phản hồi.
- **`ExceptionHandlingMiddleware.cs`**: Mạng lưới an toàn cuối cùng. Bất kỳ tầng nào phía dưới quăng Exception mà chưa ai bắt, nó sẽ bắt. Nó chuyển `ValidationException` thành lỗi 400 kèm mảng chi tiết nguyên nhân, biến lỗi `Unauthorized` thành 401... Trả về một JSON đồng nhất như bạn đã mô tả trong kiến trúc.

### Controllers
- **`ApiControllerBase.cs`**: Định nghĩa một hàm trung tâm tên là `HandleResult()`. Nếu đưa vào một `Result` thành công, nó trả ra `Ok()`. Nếu truyền `Result.Failure`, nó trả về `BadRequest()` kèm mã lỗi. Nó tự động nạp `MediatR` lười (Lazy Initialization).
- **`AuthController.cs`**: Controller "siêu gầy" (Thin Controller), chỉ dài đúng vài dòng. Nó nhận request, ném cho Mediator xử lý, và return kết quả qua `HandleResult`.

### Trái tim Khởi động: `Program.cs`
Nơi lắp ráp toàn bộ hệ thống:
1. Gắn **Serilog** để ghi log ra màn hình console và in vào file `logs/zennote_log-xxx.txt`.
2. Đăng ký DB kết nối tới Container **MySQL** trong Docker.
3. Cài đặt **Authentication JWT**, khai báo luật xác minh chuỗi token của client có hợp lệ không. Nó cũng có cấu hình để SignalR lấy được token thông qua QueryString (vì WebSockets ko truyền được Header).
4. Thiết lập giao diện **Swagger** để bạn có thể truy cập lên trình duyệt gọi thử API, nó còn cung cấp một ô "Authorize" để bạn dán Token vào chạy test.
5. Kích hoạt **Cors**, **Controllers** và **Hubs**.
