# Luồng Người dùng (User Flows)

## 1. Luồng Đăng nhập (Onboarding & Login)
1. Người dùng mở ứng dụng ZenNote (Mobile/Web).
2. Hiển thị màn hình Splash và giới thiệu (nếu là lần đầu).
3. Người dùng chọn "Continue with Google" hoặc nhập Email/Password.
4. Hệ thống gọi API xác thực -> Trả về JWT Token.
5. Người dùng được điều hướng vào màn hình `Home` (Dashboard chính).

## 2. Luồng Tạo Ghi chú Nhanh (Quick Note)
1. Tại màn hình Home, người dùng ấn nút `+` (FAB trên mobile hoặc shortcut `C` trên Web).
2. Một modal/trang soạn thảo trống hiện ra.
3. Người dùng nhập tiêu đề và nội dung.
4. Hệ thống tự động lưu nháp (Auto-save) sau mỗi 2 giây ngừng gõ.
5. Người dùng ấn `Back` hoặc `Done`. Ghi chú hiển thị ở đầu danh sách "Recent Notes".

## 3. Luồng Giao việc từ Ghi chú (Task Extraction)
1. Người dùng đang ở trong màn hình soạn thảo Ghi chú "Họp dự án A".
2. Người dùng gõ cú pháp tạo Task (vd: `- [ ] Viết tài liệu API`).
3. Dưới nền (Background), hệ thống bóc tách dòng text này thành một Object `Task` lưu vào Database, liên kết (Foreign Key) với Ghi chú hiện tại.
4. Người dùng mở tab `My Tasks` trên thanh điều hướng.
5. Task "Viết tài liệu API" xuất hiện ở danh sách Inbox/Today.
6. Khi người dùng check (hoàn thành) task ở màn hình này, file Ghi chú gốc cũng tự động cập nhật trạng thái tick (đồng bộ 2 chiều).
