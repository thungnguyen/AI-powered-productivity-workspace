# Nguyên tắc Frontend (Frontend Rules)

Bộ quy tắc cho ứng dụng Flutter đa nền tảng (Mobile & Web) của ZenNote.

## 1. Cấu trúc thư mục (Directory Structure)
Sử dụng cấu trúc theo hướng tính năng (Feature-first) kết hợp với các tầng rõ ràng:
```text
lib/
 ├── core/              # Shared utils, theme, constants, error handling
 ├── data/              # API clients, local storage, DTO models
 ├── domain/            # Entities, repository interfaces
 ├── features/          # Cấu trúc theo từng tính năng (vd: auth, workspace, tasks)
 │   └── [feature_name]/
 │       ├── presentation/ # Screens, Widgets, State Management (Bloc/Cubit)
 │       ├── domain/       # Use cases chuyên biệt cho feature
 │       └── data/         # Repositories impl cho feature
 └── main.dart
```

## 2. Quản lý trạng thái (State Management)
- Khuyến nghị sử dụng **BLoC** (hoặc Riverpod tùy theo sự thống nhất cốt lõi) làm chuẩn quản lý trạng thái doanh nghiệp.
- Tách biệt UI (Widgets) khỏi Business Logic. Mọi tương tác người dùng phải gửi Event tới BLoC và UI chỉ lắng nghe State để render.

## 3. Tái sử dụng Component (Component Strategy)
- Xây dựng thư mục `lib/core/presentation/widgets/` cho các UI components dùng chung (ZenButton, ZenTextField, ZenCard...).
- Không hardcode màu sắc, kích thước hay typography. Phải tham chiếu qua `Theme.of(context)`.

## 4. Xử lý Đa ngôn ngữ và Môi trường
- Toàn bộ Text hiển thị phải được cấu hình đa ngôn ngữ (Localization/l10n). Không dùng chuỗi string trực tiếp trong UI.
- Sử dụng file cấu hình môi trường (.env) cho các API endpoints tương ứng (dev, staging, prod).
