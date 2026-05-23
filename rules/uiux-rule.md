# Nguyên tắc UI/UX (UI/UX Rules)

Bộ quy tắc chuẩn thiết kế và giao diện người dùng cho ZenNote (đặc biệt áp dụng cho Flutter frontend).

## 1. Responsive & Adaptive Design
- **Mobile First**: Thiết kế mặc định ưu tiên trải nghiệm trên màn hình di động, sau đó scale up cho Tablet/Web.
- **Safe Areas**: Luôn bọc toàn bộ màn hình chính bằng `SafeArea` để tránh tai thỏ (notch) và thanh điều hướng hệ thống.
- **Layout Builder**: Sử dụng `LayoutBuilder` hoặc `MediaQuery` để xử lý giao diện co giãn theo kích thước màn hình thay vì fix cứng kích thước (pixel).

## 2. Theming và Design System
- Hỗ trợ cả **Light Mode** và **Dark Mode** ngay từ đầu.
- Tất cả màu sắc (`colors`), kiểu chữ (`typography`), kích thước viền (`radius`), đổ bóng (`shadows`) phải được định nghĩa trong `ThemeData`. Tuyệt đối không dùng mã hex color phân tán trong code UI.
- Thống nhất các token thiết kế (Ví dụ: `padding.small`, `spacing.medium`, `fontSize.heading1`).

## 3. Micro-animations và Trạng thái phản hồi
- Bất cứ tương tác nào của người dùng (chạm nút, vuốt, kéo) đều phải có phản hồi thị giác (Ripple effect, scale animation, hover effect).
- Khi hệ thống tải dữ liệu, phải sử dụng Skeleton Loading (Shimmer) hoặc vòng quay loading đồng nhất, không để màn hình trắng chờ.
- Thông báo kết quả (thành công/thất bại) bằng SnackBar hoặc Dialog tiêu chuẩn.
