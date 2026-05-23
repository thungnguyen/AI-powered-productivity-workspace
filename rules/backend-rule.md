# Nguyên tắc Backend (Backend Rules)

Bộ quy tắc cho hệ thống ASP.NET Core Web API của ZenNote.

## 1. Cấu trúc và Luồng dữ liệu (Data Flow)
- API Request -> Controller/Endpoint -> MediatR Command/Query -> Handler -> Repository -> CSDL.
- **Không** viết Business Logic trong Controllers.
- **Không** cho phép tầng Presentation (API) gọi trực tiếp Infrastructure (DB Context).

## 2. Tiêu chuẩn API (RESTful API Standards)
- Sử dụng đúng HTTP Methods: `GET` (đọc), `POST` (tạo mới), `PUT` (cập nhật toàn bộ), `PATCH` (cập nhật một phần), `DELETE` (xóa).
- Định dạng Response JSON chuẩn, luôn có Wrapper thống nhất cho toàn bộ API, ví dụ:
  ```json
  {
    "data": { ... },
    "success": true,
    "message": null,
    "errors": null
  }
  ```
- Sử dụng HTTP Status Codes chính xác (200, 201, 204, 400, 401, 403, 404, 500).

## 3. Xử lý Lỗi (Error Handling)
- Sử dụng **Global Exception Handling** (Middleware hoặc IExceptionHandler) để bắt mọi ngoại lệ.
- Trả về mã lỗi thân thiện với người dùng (User-friendly message), không bao giờ trả về stack trace ra ngoài production.
- Phân loại Custom Exceptions: `NotFoundException`, `ValidationException`, `UnauthorizedException`,...

## 4. Validation
- Phải validate dữ liệu đầu vào. Sử dụng thư viện `FluentValidation`.
- Validation Pipeline: Cấu hình FluentValidation vào MediatR Pipeline Behavior để tự động validate request trước khi vào Handler.

## 5. Dependency Injection (DI)
- Tất cả services, repositories, và external integrations phải được đăng ký qua DI Container (`builder.Services`).
- Phân định rõ `AddTransient`, `AddScoped` (thường dùng nhất cho DB context/request), `AddSingleton` (caching, configuration).
