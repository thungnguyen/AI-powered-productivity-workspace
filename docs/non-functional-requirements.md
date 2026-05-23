# Yêu cầu Phi chức năng (Non-functional Requirements)

## NFR1: Hiệu suất (Performance)
- **NFR1.1**: Thời gian tải lần đầu của ứng dụng (TITI - Time to Interactive) phải dưới 2 giây trên kết nối 4G.
- **NFR1.2**: Thời gian phản hồi của các API CRUD Ghi chú cơ bản phải dưới 200ms ở môi trường Production.
- **NFR1.3**: Đồng bộ hóa dữ liệu ngầm (Background Sync) không được làm giật lag giao diện (UI phải chạy mượt ở 60fps).

## NFR2: Khả năng mở rộng (Scalability)
- **NFR2.1**: Kiến trúc Backend (ASP.NET Core) phải được thiết kế dạng Stateless (phi trạng thái) để dễ dàng scale ngang (Horizontal scaling) qua Docker/Kubernetes khi lượng truy cập tăng đột biến.
- **NFR2.2**: Database MySQL phải được chuẩn hóa và thiết lập Indexing đầy đủ để hỗ trợ tìm kiếm trên dữ liệu lớn.

## NFR3: Bảo mật (Security)
- **NFR3.1**: Sử dụng **JWT (JSON Web Tokens)** có hạn sử dụng ngắn kết hợp với Refresh Tokens cho cơ chế xác thực.
- **NFR3.2**: Mật khẩu phải được băm (Hash) bằng thuật toán mã hóa mạnh (như BCrypt) trước khi lưu vào cơ sở dữ liệu.
- **NFR3.3**: Mọi API gọi từ client phải đi qua kết nối bảo mật HTTPS (TLS 1.2+).

## NFR4: Tính khả dụng (Availability)
- **NFR4.1**: Hệ thống backend phải đảm bảo thời gian hoạt động (Uptime) ở mức 99.9%.
- **NFR4.2**: Ứng dụng Frontend (Flutter) phải có chế độ **Offline-first**, cho phép người dùng xem và tạo Ghi chú ngay cả khi mất mạng internet, và tự động đồng bộ khi có mạng lại.
