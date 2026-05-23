# Yêu cầu Chức năng (Functional Requirements)

## FR1: Quản lý Người dùng (User Management)
- **FR1.1**: Hệ thống phải cho phép người dùng tạo tài khoản mới bằng Email/Password hoặc thông qua OAuth (Google).
- **FR1.2**: Hệ thống phải hỗ trợ khôi phục mật khẩu (Forgot Password) qua Email.
- **FR1.3**: Người dùng có thể cập nhật thông tin cá nhân (Avatar, Tên hiển thị).

## FR2: Quản lý Ghi chú (Notes Management)
- **FR2.1**: Hệ thống cung cấp trình soạn thảo Rich Text hỗ trợ Markdown.
- **FR2.2**: Người dùng có thể tạo, đọc, cập nhật, và xóa (CRUD) Ghi chú.
- **FR2.3**: Người dùng có thể phân cấp Ghi chú thông qua hệ thống Thư mục (Folders) không giới hạn độ sâu.
- **FR2.4**: Hệ thống phải tự động lưu (Auto-save) nội dung đang soạn thảo.

## FR3: Quản lý Công việc (Task Management)
- **FR3.1**: Hệ thống phải nhận diện các Checkbox trong Ghi chú và tự động tạo Task tương ứng trong DB.
- **FR3.2**: Trạng thái của Task (Done/Undone) phải được đồng bộ 2 chiều giữa màn hình Ghi chú gốc và màn hình danh sách Task.
- **FR3.3**: Người dùng có thể gán ngày đến hạn (Due Date) cho một Task.

## FR4: Tìm kiếm (Search)
- **FR4.1**: Hệ thống phải cho phép tìm kiếm Toàn văn (Full-text search) trên cả Tiêu đề và Nội dung của Ghi chú.
- **FR4.2**: Tính năng tìm kiếm phải trả về kết quả ngay lập tức khi gõ (Search as you type).
