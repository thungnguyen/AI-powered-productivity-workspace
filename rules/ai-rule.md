# Nguyên tắc dành cho AI Agents (AI Engineering Rules)

Bộ quy tắc này được thiết kế để các công cụ AI (như Antigravity, GitHub Copilot) hiểu rõ context và sinh code đồng nhất cho ZenNote.

## 1. Đọc ngữ cảnh (Context Awareness)
- Khi AI Agent bắt đầu một task, bắt buộc phải phân tích cấu trúc dự án và các bộ luật hiện tại trong thư mục `/rules` trước khi sinh code.
- Khi thêm một tính năng mới, AI phải tự động áp dụng Clean Architecture (Backend) hoặc Feature-first architecture (Frontend) như đã định nghĩa.

## 2. Tự động Commenting và Documenting
- Sinh code phải bao gồm **XML Documentation** (cho C#) ở trên các public method và class chứa logic phức tạp.
- Sử dụng **///** comments cho Dart/Flutter với các method public để IntelliSense dễ nhận diện.
- Giải thích "Tại sao" thay vì "Cái gì". AI không cần comment kiểu `// Khởi tạo biến x = 1`.

## 3. Tính dự đoán (Predictability)
- Khi AI được yêu cầu tạo Entity mới, nó phải tự động tạo kèm theo `Migration`, `DTO`, `Command/Query` (CQRS), `Handler`, và update `Controller` (Backend).
- Khi tạo API mới, AI phải tự động bổ sung vào Postman collection (nếu có) hoặc update cấu hình Swagger documentation tương ứng.
- Tuyệt đối không sử dụng thư viện bên ngoài (3rd party libraries) nếu tính năng đó có thể giải quyết dễ dàng bằng code thuần (Native/Core libraries), trừ khi được user yêu cầu.

## 4. Báo cáo (Feedback Loop)
- AI cần thông báo bằng markdown artifacts nếu nhận thấy mã được yêu cầu viết vi phạm SOLID, trùng lặp code, hoặc không tuân thủ Design System.
