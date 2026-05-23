# Giao diện, Component & Phản hồi (Theme, Components & Responsive)

UI của ZenNote được định vị là "Premium", tốc độ (Linear) và mượt mà (Apple).

## 1. Kiến trúc Theme & Tối màu (Dark Mode)
- Khai báo một hệ thống **Design Token** bằng `ThemeExtension` trong Flutter thay vì gán màu cứng. 
- Mọi widget đều phải gọi màu thông qua `Theme.of(context).extension<AppColors>()`. Điều này giúp việc chuyển đổi giữa Dark Mode và Light Mode diễn ra mượt mà và tự động 100%.
- Sử dụng các font chữ hiện đại, rõ ràng như `Inter` hoặc `SF Pro`.

## 2. Hệ thống Widget Tái sử dụng (Reusable Widget System)
Tạo thư viện UI riêng (`shared/widgets`) mang tiền tố `Zen`:
- `ZenButton`: Nút bấm có sẵn trạng thái loading, disabled, hover effects.
- `ZenTextField`: Ô nhập liệu theo chuẩn thiết kế (có bo góc, shadow viền khi focus).
- `ZenCard`: Component chứa nội dung, có hiệu ứng nổi (elevation) khi trỏ chuột vào.
-> Không lập trình viên nào được phép dùng thẳng `ElevatedButton` hay `TextField` mặc định mà không bọc qua chuẩn UI của ZenNote.

## 3. Chiến lược Đa nền tảng (Responsive Strategy)
- Sử dụng **LayoutBuilder** và **MediaQuery** kết hợp extension tự viết `.isMobile`, `.isTablet`, `.isDesktop`.
- **Mobile First**: Thiết kế dạng màn hình dọc, Menu hamburger, Bottom Sheet.
- **Desktop/Tablet**: Khi màn hình mở rộng > 800px, Bottom Navigation sẽ tự động biến thành Left Sidebar cố định. Màn hình Note sẽ hiển thị dạng Split-view (Danh sách bên trái, chi tiết bên phải).
- **Safe Area**: Mọi màn hình phải được wrap bởi `SafeArea` để không lẹm vào tai thỏ (notch) trên mobile.

## 4. Chiến lược Hoạt ảnh (Animation Strategy)
- Bắt buộc phải có **Micro-animations**: Mọi thao tác (hover, click, checked task) đều cần một phản hồi UI nhỏ. Sử dụng `AnimatedContainer`, `AnimatedScale`, `AnimatedOpacity` mặc định của Flutter.
- Hiệu ứng chuyển trang: Sử dụng `CupertinoPageTransitions` (Trượt ngang) trên Mobile và `FadeTransition` trên Desktop/Web.
