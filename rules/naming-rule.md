# Nguyên tắc Đặt tên (Naming Rules)

Bộ quy tắc đặt tên nghiêm ngặt áp dụng trên toàn bộ hệ sinh thái ZenNote.

## 1. Backend (C# / .NET)
- **Class, Record, Struct, Method, Property**: Sử dụng `PascalCase`. (Ví dụ: `UserService`, `CalculateTotal()`, `UserName`).
- **Interface**: Tiền tố `I` kết hợp `PascalCase`. (Ví dụ: `IUserRepository`).
- **Local Variable, Method Parameter**: Sử dụng `camelCase`. (Ví dụ: `userId`, `customerName`).
- **Private Field**: Tiền tố `_` kết hợp `camelCase`. (Ví dụ: `_dbContext`, `_logger`).
- **Constant**: Sử dụng `PascalCase` (không dùng ALL_CAPS trong C#).

## 2. Frontend (Dart / Flutter)
- **Class, Enum, Typedef**: Sử dụng `PascalCase`. (Ví dụ: `HomePage`, `TaskState`).
- **Variable, Function, Method**: Sử dụng `camelCase`. (Ví dụ: `fetchData()`, `itemCount`).
- **File & Directory**: Bắt buộc sử dụng `snake_case`. (Ví dụ: `home_page.dart`, `auth_repository.dart`).
- **Constant**: Sử dụng `camelCase` (Khuyến nghị của Dart) hoặc `SCREAMING_SNAKE_CASE` (tùy ngữ cảnh, ưu tiên `camelCase`).

## 3. General (Toàn hệ thống)
- Sử dụng danh từ cho lớp (Class) và động từ cho phương thức (Method).
- Đặt tên tiếng Anh chuẩn xác, có ý nghĩa, KHÔNG viết tắt (trừ những từ phổ biến như `Id`, `Dto`, `Api`).
- Không đặt tên biến kiểu `temp`, `data`, `obj` mà không có ngữ cảnh cụ thể (Nên dùng `userData`, `taskResponse`).
