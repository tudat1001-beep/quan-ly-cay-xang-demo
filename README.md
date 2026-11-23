# Trạm Xanh — bản dùng thử

Demo giao diện quản lý cây xăng để gửi khách trải nghiệm trên máy tính hoặc điện thoại.

## Dữ liệu demo

- Ứng dụng tự nạp dữ liệu mẫu ở lần mở đầu.
- Các giao dịch người dùng nhập được lưu trong `localStorage` của trình duyệt hiện tại.
- Mỗi thiết bị/trình duyệt có dữ liệu riêng; demo không đồng bộ giữa điện thoại và máy tính.
- Nút **Đặt lại dữ liệu mẫu** xóa các giao dịch demo trong trình duyệt đó và nạp lại bộ dữ liệu ban đầu.
- Không nhập dữ liệu thật, thông tin khách hàng thật hoặc thông tin đăng nhập. Đây là bản demo tĩnh, không có tài khoản, máy chủ hay cơ chế sao lưu.

## Đưa lên GitHub Pages

Repo này chỉ chứa `index.html`, `styles.css`, `app.js` và workflow triển khai. Khi đẩy lên nhánh `main`, GitHub Actions sẽ xuất nội dung repo thành GitHub Pages.

## Chạy thử trên máy

Mở `index.html` bằng trình duyệt hiện đại. Có thể dùng một static server nếu trình duyệt giới hạn lưu trữ khi mở bằng `file://`.
