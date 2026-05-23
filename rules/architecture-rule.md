# Nguyên tắc Kiến trúc (Architecture Rules)

Bộ quy tắc này định hướng kiến trúc tổng thể cho dự án ZenNote, đảm bảo tính mở rộng, dễ bảo trì và tuân thủ các tiêu chuẩn doanh nghiệp (Enterprise Standards).

## 1. Kiến trúc tổng thể (Clean Architecture)
Dự án backend phải tuân thủ nghiêm ngặt mô hình Clean Architecture gồm 4 tầng chính:
- **Domain Layer**: Chứa các Entities, Value Objects, Enums, và Interfaces nội tại. Không phụ thuộc vào bất kỳ tầng nào khác.
- **Application Layer**: Chứa Use Cases, CQRS (Commands/Queries), DTOs, và các Interfaces của Infrastructure (như Repository interfaces). Tầng này chỉ phụ thuộc vào Domain Layer.
- **Infrastructure Layer**: Chứa implementations của CSDL (Entity Framework, MySQL, Redis), Email/SMS providers, và các external APIs. Phụ thuộc vào Application Layer.
- **Presentation Layer**: Chứa Web API (Controllers/Endpoints) và SignalR Hubs. Chỉ giao tiếp với Application Layer thông qua MediatR.

## 2. Nguyên tắc thiết kế (SOLID Principles)
Tất cả code được sinh ra phải tuân thủ SOLID:
- **S**ingle Responsibility: Mỗi class/module chỉ chịu trách nhiệm cho một chức năng duy nhất.
- **O**pen/Closed: Mở rộng chức năng thông qua Interface/Inheritance thay vì sửa đổi code cũ.
- **L**iskov Substitution: Class con phải có thể thay thế class cha mà không làm hỏng logic.
- **I**nterface Segregation: Tạo nhiều Interface nhỏ và cụ thể thay vì một Interface khổng lồ.
- **D**ependency Inversion: Các module cấp cao không được phụ thuộc vào các module cấp thấp; cả hai nên phụ thuộc vào abstractions (Interfaces).

## 3. CQRS và MediatR
- Bắt buộc tách biệt luồng Ghi (Command) và Đọc (Query) thông qua mẫu thiết kế CQRS.
- Sử dụng thư viện `MediatR` trong ASP.NET Core. 
- Controllers chỉ làm nhiệm vụ nhận Request và trả về Response, mọi logic phải được xử lý bên trong `IRequestHandler`.

## 4. Tái sử dụng (Reusable Strategy)
- Xây dựng các Shared Kernel (ví dụ: Base Entity, Exception handling, Pagination classes) để dùng chung trên toàn hệ thống.
- Ở Frontend, các UI components phải được thiết kế dạng stateless và tái sử dụng được (như Buttons, TextFields, Cards) trước khi tích hợp vào màn hình (Screen).
