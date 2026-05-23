# Quản lý Trạng thái & Điều hướng (State Management & Routing)

## 1. Chiến lược Quản lý Trạng thái (State Management)
ZenNote lựa chọn **BLoC (Business Logic Component)** kết hợp với **Freezed** làm chuẩn quản lý trạng thái doanh nghiệp.

- **BLoC (bloc/flutter_bloc)**: Giúp tách biệt rõ ràng UI (Event) và State. Đặc biệt hữu ích khi xử lý các luồng dữ liệu phức tạp của Productivity app (ví dụ: tạo note -> lưu local -> sync api -> update UI).
- **Cubit**: Dùng cho các trạng thái đơn giản (như Toggle Dark/Light mode, mở/đóng sidebar) để giảm boilerplate code.
- **Freezed**: Tự động sinh code (Code generation) cho Immutable States và Union Types, đảm bảo việc update UI không bao giờ bị dính bug liên quan đến tham chiếu bộ nhớ (memory reference bugs).
- **Service Locator (get_it)**: Quản lý Dependency Injection cho toàn bộ ứng dụng (Inject UseCases vào BLoC, Inject Repositories vào UseCases).

## 2. Chiến lược Điều hướng (Routing Strategy)
Sử dụng **GoRouter** làm thư viện điều hướng chính vì ZenNote hỗ trợ đa nền tảng (Web/Desktop/Mobile).

- **Deep Linking**: GoRouter hỗ trợ Deep Linking mặc định cực tốt. Người dùng click vào link `zennote.com/workspace/1/note/123` sẽ mở thẳng note đó trên App.
- **Nested Navigation (ShellRoute)**: Sử dụng `ShellRoute` cho màn hình chính. Thanh Sidebar (Web/Desktop) hoặc Bottom Navigation Bar (Mobile) sẽ luôn cố định, chỉ phần thân trang thay đổi khi chuyển tab (Notes, Tasks, Settings).
- **Redirects & Guards**: Bảo vệ các màn hình bằng logic chuyển hướng tích hợp. Nếu chưa đăng nhập, tự động đá về màn hình `/login`. Cực kỳ mượt mà.
