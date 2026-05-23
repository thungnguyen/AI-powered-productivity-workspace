# Các Chiến lược Cốt lõi (Caching, Realtime, Auth, Testing)

## 1. Chiến lược Bộ đệm (Caching Strategy)
- **Redis Distributed Cache**: Sử dụng để lưu trữ các dữ liệu đọc nhiều - ghi ít (Ví dụ: Workspace Settings, Danh sách Tags).
- **Cache Invalidation**: Sử dụng MediatR Pipeline hoặc Event Handlers để xóa Cache khi có sự thay đổi. (Ví dụ: `UpdateWorkspaceCommand` thành công sẽ trigger xóa key `Cache:Workspace:{Id}`).
- Đối với dữ liệu cá nhân, luôn gắn UserId/WorkspaceId vào Key để tránh rò rỉ dữ liệu chéo.

## 2. Chiến lược Thời gian thực (Realtime Strategy)
- Sử dụng **SignalR** để đồng bộ trạng thái (Sync).
- Mọi client kết nối vào SignalR sẽ được phân nhóm (Group) theo `WorkspaceId`.
- Khi user A tick hoàn thành 1 Task, Backend sẽ gửi thông báo qua SignalR chỉ tới Group `WorkspaceId` đó để các thiết bị khác (hoặc user khác) update UI realtime.
- SignalR Backplane (dùng Redis) được chuẩn bị sẵn nếu cần chạy nhiều server API song song.

## 3. Chiến lược Xác thực & Phân quyền (Auth Strategy)
- **Authentication**: JWT (JSON Web Tokens). Access Token tuổi thọ ngắn (15-30 phút), Refresh Token tuổi thọ dài (7-30 ngày) lưu trong DB để cấp mới Access Token. Đảm bảo an toàn khi Token bị lộ.
- **Authorization**: 
  - **Role-based (RBAC)**: Ở mức cơ bản (Owner, Admin, Member của 1 Workspace).
  - **Policy-based**: Xử lý logic phân quyền ở tầng Application (Không cho phép User xóa Note nếu không phải Owner của Note đó).

## 4. Chiến lược Kiểm thử (Testing Strategy)
- **Unit Tests** (xUnit, Moq, FluentAssertions): Tập trung test tầng Domain (Entities, Logic cốt lõi) và tầng Application (Command/Query Handlers). Không kết nối Database thật, mà Mock các Interfaces.
- **Integration Tests**: Kiểm tra API Endpoint xuyên suốt (từ Controller tới Database). Sử dụng `TestContainers` (chạy MySQL/Redis thật qua Docker trong lúc test) kết hợp với `WebApplicationFactory` để test API thực tế.
- Mục tiêu: 80% Test Coverage cho Business Logic.
