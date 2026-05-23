# Cấu trúc Solution & Project (Backend Solution Structure)

Hệ thống Backend của ZenNote được thiết kế theo **Clean Architecture** kết hợp với mô hình **Feature-Based Organization** (Cấu trúc theo tính năng) để đảm bảo tính phân tách (Separation of Concerns) và khả năng bảo trì.

## 1. Cấu trúc Solution (Solution Structure)
Solution `ZenNote.sln` bao gồm 4 project chính tương ứng với 4 lớp kiến trúc:

```text
ZenNote.sln
 ├── 1. Core
 │   └── ZenNote.Domain        # Entities, Enums, Exceptions, Domain Events, Interfaces (Không phụ thuộc bất kỳ library nào)
 ├── 2. Application
 │   └── ZenNote.Application   # Use Cases (CQRS), DTOs, Validation, Interfaces (Phụ thuộc vào Domain)
 ├── 3. Infrastructure
 │   └── ZenNote.Infrastructure # EF Core, MySQL, Redis, Identity, External APIs (Phụ thuộc vào Application)
 └── 4. Presentation
     └── ZenNote.Api           # Controllers, Middlewares, SignalR Hubs (Phụ thuộc vào Application & Infrastructure)
```

## 2. Luồng Phụ thuộc (Dependency Flow)
- Quy tắc vàng: **Mọi sự phụ thuộc phải hướng vào trong (hướng về Domain Layer)**.
- `API` -> phụ thuộc vào `Application` và `Infrastructure` (để đăng ký DI).
- `Infrastructure` -> phụ thuộc vào `Application` (để implement các Interfaces định nghĩa ở Application).
- `Application` -> phụ thuộc vào `Domain`.
- `Domain` -> Không phụ thuộc vào ai. Đây là trái tim của hệ thống.

## 3. Tổ chức theo Tính năng (Feature-based Module Organization)
Thay vì tổ chức thư mục theo Technical Concerns (gom tất cả Handlers vào 1 thư mục, Validators vào 1 thư mục), lớp **Application** sẽ được tổ chức theo **Features** (Tính năng) để tăng độ cohesive (gắn kết).

Ví dụ cấu trúc thư mục lớp `ZenNote.Application`:
```text
ZenNote.Application/
 ├── Common/
 │   ├── Behaviors/           # ValidationBehavior, LoggingBehavior
 │   ├── Interfaces/          # IApplicationDbContext, ICacheService
 │   └── Exceptions/          # ValidationException, NotFoundException
 └── Features/
     ├── Workspaces/
     │   ├── Commands/
     │   │   ├── CreateWorkspace/
     │   │   │   ├── CreateWorkspaceCommand.cs
     │   │   │   ├── CreateWorkspaceCommandHandler.cs
     │   │   │   └── CreateWorkspaceCommandValidator.cs
     │   │   └── DeleteWorkspace/
     │   └── Queries/
     │       └── GetWorkspaceDetails/
     └── Tasks/
         ├── Commands/
         └── Queries/
```
Việc tổ chức này giúp kỹ sư khi sửa một tính năng (ví dụ Create Workspace) chỉ cần làm việc trong duy nhất 1 folder, không cần nhảy qua nhảy lại giữa nhiều file phân tán.
