# Trạm Xanh — bản dùng thử

Demo giao diện quản lý cây xăng để gửi khách trải nghiệm trên máy tính hoặc điện thoại.

## Dữ liệu demo

- Ứng dụng tự nạp dữ liệu mẫu ở lần mở đầu.
- Các giao dịch người dùng nhập được lưu trong `localStorage` của trình duyệt hiện tại.
- Mỗi thiết bị/trình duyệt có dữ liệu riêng; demo không đồng bộ giữa điện thoại và máy tính.
- Bộ chọn **Chế độ thử** cho xem giao diện Quản lý/Nhân viên. Ở chế độ Nhân viên, chỉ còn màn hình bán xe; giá trên phiếu bán là chỉ đọc. Đây là mô phỏng giao diện, không phải đăng nhập hay cơ chế bảo vệ dữ liệu.
- Nút **Đặt lại dữ liệu mẫu** xóa các giao dịch demo trong trình duyệt đó và nạp lại bộ dữ liệu ban đầu.
- Không nhập dữ liệu thật, thông tin khách hàng thật hoặc thông tin đăng nhập. Đây là bản demo tĩnh, không có tài khoản, máy chủ hay cơ chế sao lưu.
- **Nạp vào trụ** chuyển số lít từ kho chung sang tồn của trụ. Lượt xe công ty và bán lẻ chốt cuối ngày được trừ khỏi tồn trụ; tổng tồn không bị trừ hai lần.
- Màn hình bán xe và nhập nhiên liệu giữ trụ/nhà cung cấp/nhiên liệu gần nhất để ghi nhiều phiếu liên tiếp.

## Đưa lên GitHub Pages

Repo này chỉ chứa các tệp tĩnh của demo. GitHub Pages phát hành trực tiếp nội dung ở thư mục gốc của nhánh `main`; không có backend hay dữ liệu vận hành trong repo.

## Chạy thử trên máy

Mở `index.html` bằng trình duyệt hiện đại. Có thể dùng một static server nếu trình duyệt giới hạn lưu trữ khi mở bằng `file://`.
