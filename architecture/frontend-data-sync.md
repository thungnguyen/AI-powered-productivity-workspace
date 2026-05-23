# Tích hợp Dữ liệu & Đồng bộ Ngoại tuyến (API, Storage & Offline Sync)

Là một ứng dụng ghi chú, ZenNote phải hoạt động hoàn hảo ngay cả khi người dùng đang trên máy bay (Không có mạng).

## 1. Lớp Tích hợp API (API Integration Layer)
- Sử dụng **Dio** (thay vì `http` mặc định) làm HTTP Client nhờ tính năng Interceptors mạnh mẽ.
- **Interceptors**: 
  - `AuthInterceptor`: Tự động gắn JWT Token vào mọi Request Headers.
  - `ErrorInterceptor`: Xử lý Refresh Token tự động. Nếu API báo 401 (Hết hạn token), interceptor sẽ tự gọi API cấp lại token mới, và chạy lại request bị xịt (Silent refresh) mà người dùng không hề hay biết.
- **Error Handling**: Mapping các ngoại lệ của Dio thành các `Failure` models (vd: `ServerFailure`, `NetworkFailure`) bằng functional programming (thư viện `dartz` hoặc `fpdart` - `Either<Failure, T>`).

## 2. Lưu trữ Nội bộ (Local Storage Strategy)
- Dữ liệu cấu hình nhẹ (Theme, Token, App Settings): Dùng **Flutter Secure Storage** (Mã hóa an toàn) và **SharedPreferences**.
- Dữ liệu cốt lõi (Notes, Tasks): Dùng **Isar Database** (Hoặc SQLite/Drift). Isar là NoSQL database cực nhanh dành riêng cho Flutter, tối ưu cho việc tìm kiếm text và hỗ trợ quan hệ dữ liệu sâu (rất phù hợp cho Notes chứa nhiều Subtasks).

## 3. Chiến lược Đồng bộ Ngoại tuyến (Offline Sync Strategy)
Mô hình **Offline-First**:
1. **Lưu tại máy trước**: Bất kỳ hành động tạo/sửa/xóa Ghi chú hoặc Task nào cũng lập tức được thực thi trên Local Database (Isar) trước. Trạng thái UI update ngay lập tức (Latency = 0).
2. **Hàng đợi đồng bộ (Sync Queue)**: Bản ghi đó sẽ được gắn cờ `is_synced = false`. 
3. **Background Sync**: 
   - Nếu có mạng: Ứng dụng lập tức gửi payload lên API thông qua BLoC. Nếu API trả về 200 OK, cập nhật cờ thành `is_synced = true`.
   - Nếu mất mạng: Request bị lỗi, giữ nguyên cờ `false`.
4. **Connectivity Listener**: Khi thiết bị bắt lại được Wifi/4G, một luồng (service) sẽ quét toàn bộ các bản ghi `is_synced = false` trong Local DB và push hàng loạt (Batch update) lên máy chủ thông qua API để đồng bộ.
