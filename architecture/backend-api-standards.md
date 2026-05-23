# Tiêu chuẩn API, Bắt lỗi & Ghi log (API, Exception & Logging Standards)

## 1. Tiêu chuẩn API (API Standards)
- **Routing**: URL luôn phải là danh từ số nhiều, lowercase, phân cách bằng dấu gạch ngang. Ví dụ: `GET /api/v1/workspaces/{id}/tasks`.
- **Versioning**: Bắt buộc có versioning ngay từ đầu (vd: `v1`).
- **Response Wrapper**: Mọi API trả về JSON phải có cấu trúc chuẩn hóa:
  ```json
  {
    "data": { ... },
    "success": true,
    "message": "Fetched successfully",
    "errors": []
  }
  ```

## 2. Chiến lược Bắt lỗi (Exception Handling Strategy)
- Không bao giờ dùng `try-catch` lặp lại ở mọi Controller hay Handler (gây code rác).
- Sử dụng **Global Exception Handling Middleware** (hoặc `IExceptionHandler` trong .NET 8).
- Cách Middleware hoạt động:
  1. Nếu là `ValidationException` -> Trả về mã HTTP 400 (Bad Request) cùng danh sách lỗi chi tiết từ FluentValidation.
  2. Nếu là `NotFoundException` -> Trả về mã HTTP 404 (Not Found).
  3. Nếu là `UnauthorizedException` -> Trả về mã HTTP 401.
  4. Bất kỳ Exception nào khác chưa catch -> Ghi log (Serilog) thành mức `Error` hoặc `Fatal`, và trả về HTTP 500 kèm tin nhắn chung "Internal Server Error" (Giấu stack trace).

## 3. Chiến lược Ghi log (Logging Strategy)
- Sử dụng **Serilog** kết hợp với **Seq** (hoặc ELK Stack/Datadog cho Production).
- **Enrichment**: Tự động gán `CorrelationId` (hoặc `RequestId`) vào mỗi request để dễ dàng trace luồng gọi API từ đầu đến cuối.
- Ghi log theo các cấp độ:
  - `Information`: Cho các luồng thao tác thành công quan trọng (vd: User đăng ký thành công).
  - `Warning`: Các hành vi đáng ngờ (vd: Sai mật khẩu quá 5 lần).
  - `Error`: Khi có Exception văng ra hoặc external API gọi bị lỗi.
- **MediatR Logging Behavior**: Áp dụng IPipelineBehavior để tự động ghi log thời gian thực thi (Performance) của tất cả Command/Query. Nếu Query chạy chậm quá 500ms, ghi log cảnh báo (Warning).
