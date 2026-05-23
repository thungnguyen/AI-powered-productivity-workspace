# Nguyên tắc Git và CI/CD (Git Rules)

Quy định về quản lý mã nguồn và vòng đời phát triển của ZenNote.

## 1. Chiến lược phân nhánh (Branching Strategy)
Sử dụng **GitHub Flow** (phù hợp cho CI/CD liên tục):
- `main`: Nhánh production-ready. Mọi code trên này phải luôn build và deploy thành công.
- `feature/*`: Dành cho các tính năng mới (Ví dụ: `feature/ai-chat`).
- `bugfix/*`: Dành cho việc sửa lỗi (Ví dụ: `bugfix/login-crash`).
- Không push code trực tiếp lên nhánh `main`. Mọi thay đổi phải thông qua Pull Request (PR).

## 2. Tiêu chuẩn Commit Message (Conventional Commits)
Sử dụng định dạng Conventional Commits để tự động hóa Semantic Versioning:
- `feat: [Mô tả]`: Thêm tính năng mới.
- `fix: [Mô tả]`: Sửa lỗi.
- `docs: [Mô tả]`: Cập nhật tài liệu.
- `style: [Mô tả]`: Format code, thiếu chấm phẩy... (không thay đổi logic).
- `refactor: [Mô tả]`: Viết lại code nhưng không đổi logic, không thêm tính năng hay sửa lỗi.
- `test: [Mô tả]`: Thêm hoặc sửa test case.
- `chore: [Mô tả]`: Cập nhật cấu hình build, package manager (không sửa mã nguồn).

## 3. Pull Request (PR) Requirements
- Mọi PR phải có mô tả rõ ràng về: Lý do tạo, thay đổi chính, và cách test.
- Code phải vượt qua hệ thống CI (Linting, Unit Tests, Build) thông qua GitHub Actions.
- PR chỉ được merge (squash & merge) khi có ít nhất 1 review phê duyệt.
