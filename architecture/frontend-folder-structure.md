# Cấu trúc Thư mục & Kiến trúc Tính năng (Folder & Feature Architecture)

Kiến trúc Frontend Flutter của ZenNote được thiết kế theo mô hình **Feature-first Clean Architecture**. Điều này giúp tách biệt các tính năng độc lập, dễ dàng chia nhỏ công việc cho nhiều lập trình viên và sẵn sàng scale lên ứng dụng quy mô lớn.

## 1. Cấu trúc Thư mục Tổng quan (Folder Structure)

```text
lib/
 ├── core/                  # Code dùng chung toàn hệ thống (không chứa logic nghiệp vụ)
 │   ├── api/               # Interceptors, Dio Client, Exception classes
 │   ├── constants/         # App colors, text styles, API endpoints, dimens
 │   ├── error/             # Failure models (bắt lỗi chung)
 │   ├── routing/           # Cấu hình GoRouter, danh sách routes
 │   ├── theme/             # Light/Dark theme, ThemeData
 │   └── utils/             # Formatters, Validators, Helpers
 ├── shared/                # Các thành phần dùng chéo giữa nhiều features
 │   └── widgets/           # ZenButton, ZenTextField, ZenCard...
 ├── features/              # (Cốt lõi) Các tính năng kinh doanh độc lập
 │   ├── auth/              # Feature Xác thực
 │   ├── workspace/         # Feature Không gian làm việc
 │   ├── notes/             # Feature Ghi chú
 │   └── tasks/             # Feature Quản lý công việc
 └── main.dart              # Entry point, khởi tạo service locators
```

## 2. Kiến trúc bên trong một Feature (Clean Architecture)

Mỗi thư mục bên trong `features/` (ví dụ `notes/`) sẽ có cấu trúc 3 tầng nghiêm ngặt:

```text
features/notes/
 ├── data/                  # Tầng Dữ liệu
 │   ├── datasources/       # Remote (API) & Local (SQLite/Hive) data sources
 │   ├── models/            # DTOs (Chuyển đổi từ JSON)
 │   └── repositories/      # Repository Implementations
 ├── domain/                # Tầng Nghiệp vụ (Không phụ thuộc Flutter/Third-party)
 │   ├── entities/          # Dart classes (Note, Task)
 │   ├── repositories/      # Repository Interfaces
 │   └── usecases/          # Các thao tác kinh doanh (GetNotesUseCase)
 └── presentation/          # Tầng Giao diện
     ├── blocs/             # State Management (BLoC / Cubit)
     ├── pages/             # Các màn hình chính (NoteListPage, NoteDetailPage)
     └── widgets/           # Các widget chỉ dùng riêng cho feature này
```

## 3. Lý do lựa chọn Feature-first
Nếu một lập trình viên cần sửa lỗi màn hình Ghi chú (Notes), họ chỉ cần truy cập vào thư mục `features/notes/`. Mọi thứ từ API, UI đến State đều nằm trọn trong đó, không cần tìm kiếm rải rác khắp dự án như cách tổ chức Layer-first kiểu cũ.
