# Chiến lược Di trú Dữ liệu (Migration Strategy)

## 1. EF Core Code-First Approach
Do ZenNote sử dụng **ASP.NET Core**, hệ thống MySQL Database sẽ được quản lý 100% vòng đời bởi **Entity Framework Core Migrations**. Không được phép thay đổi trực tiếp (Manual Alter) schema trên giao diện quản trị MySQL (như phpMyAdmin hay DBeaver).

## 2. Quy trình Thực thi Migrations
1. Kỹ sư chỉnh sửa C# Entities (Cấu hình bằng Fluent API trong thư mục `Infrastructure/Data/Configurations`).
2. Chạy lệnh: `dotnet ef migrations add [Tên_Migration_Mô_Tả_Thay_Đổi]`
3. Review file Migration (Up() và Down() methods) để đảm bảo không xóa nhầm cột hoặc thay đổi kiểu dữ liệu gây mất mát dữ liệu (Data loss).
4. Code được push lên `main`, hệ thống CI/CD (GitHub Actions) sẽ biên dịch Migration thành script SQL (`dotnet ef migrations script`) và tự động áp dụng (apply) lên Database Staging/Production.

## 3. Quản lý Rủi ro
- Các bảng tĩnh như Enums không nên dùng DB Tables để tránh JOIN quá nhiều. Hardcode chúng trên tầng Domain Enum của C# và lưu xuống DB dạng `VARCHAR` (Hoặc Integer để tối ưu).
- Chạy Database Backup tự động hàng ngày. Khi apply migration lớn (Ví dụ: tách 1 cột thành 2 cột), bắt buộc phải test trên môi trường Staging có bản clone của Data Production.
