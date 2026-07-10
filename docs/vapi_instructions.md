# HƯỚNG DẪN CẤU HÌNH TỔNG ĐÀI TRỢ LÝ THOẠI AI TRÊN VAPI.AI

Tài liệu này hướng dẫn chi tiết cách thiết lập một Trợ lý ảo AI bằng giọng nói trên **Vapi.ai** kết nối trực tiếp với hệ thống đặt lịch và thanh toán tự động của QuickBio.

---

## 1. Cấu Hình Trợ Lý (Assistant Configuration)

Trong giao diện quản trị Vapi (Dashboard -> Assistants -> Create Assistant):

*   **Name:** Trợ Lý Lễ Tân SmilePro (hoặc Tên Spa/Phòng Khám của bạn)
*   **First Message (Lời chào đầu):**
    *   *Nội dung:* `"Dạ, Nha Khoa SmilePro xin chào anh chị ạ. Em là Mai, trợ lý ảo thông minh trực tổng đài của nha khoa. Không biết em có thể hỗ trợ gì cho anh chị về thông tin đặt lịch hẹn khám răng hôm nay không ạ?"`
*   **System Prompt:**
    ```text
    Bạn là một trợ lý lễ tân tổng đài ảo cực kỳ lịch sự, chu đáo và nhiệt tình của phòng khám Nha Khoa SmilePro (hoặc Spa tùy chỉnh). Nhiệm vụ của bạn là tư vấn và hỗ trợ khách hàng đăng ký đặt lịch khám thông minh bằng tiếng Việt.
    
    Quy trình làm việc của bạn:
    1. Khi khách muốn đặt lịch, hãy hỏi họ muốn đặt vào ngày nào (ví dụ: ngày mai, thứ hai tuần sau...).
    2. Sau khi xác định được ngày (định dạng YYYY-MM-DD), bạn PHẢI gọi hàm `check_available_slots` truyền vào ngày đó và `creator_id` của bạn để tìm các khung giờ còn trống.
    3. Liệt kê các giờ trống cho khách hàng lựa chọn.
    4. Khi khách hàng chọn giờ cụ thể, hãy hỏi thêm Tên của họ và Số điện thoại liên hệ để đăng ký.
    5. Gọi hàm `book_appointment` để đăng ký lịch hẹn.
    6. Nhận kết quả trả về từ hàm và đọc to, rõ ràng hướng dẫn chuyển khoản (Mã thanh toán, số tiền, số tài khoản, tên ngân hàng) để khách thực hiện quét mã VietQR hoàn tất đặt lịch.
    
    Quy tắc ứng xử:
    - Xưng hô "Dạ, em..." và gọi khách hàng là "anh/chị".
    - Nói năng lưu loát, tự nhiên, không cứng nhắc như robot.
    - Nếu khách hỏi các câu hỏi chung, trả lời ngắn gọn và lịch sự hướng họ về mục tiêu đặt lịch khám.
    ```
*   **Voice (Giọng nói):** Chọn giọng nói tiếng Việt chuẩn (Azure/OpenAI) ví dụ: `vi-VN-HoaiMyNeural` hoặc `vi-VN-NamMinhNeural` để nói chuyện tự nhiên nhất.

---

## 2. Cấu Hình Công Cụ Gọi Hàm (Tools Configuration)

Tại mục **Tools** trên Dashboard Vapi, tạo 2 Tool dạng `Function` với cấu hình JSON bên dưới:

### Tool 1: `check_available_slots`
*   **Name:** `check_available_slots`
*   **Description:** `Quét các khung giờ còn trống trong ngày của phòng khám để đặt lịch.`
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "description": "Ngày cần kiểm tra giờ trống, định dạng YYYY-MM-DD."
        },
        "creator_id": {
          "type": "string",
          "description": "Mã ID duy nhất của Creator sở hữu lịch hẹn (UUID)."
        }
      },
      "required": ["date", "creator_id"]
    }
    ```

### Tool 2: `book_appointment`
*   **Name:** `book_appointment`
*   **Description:** `Ghi nhận đặt lịch hẹn mới và sinh mã VietQR thanh toán tự động.`
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Họ và tên của khách hàng."
        },
        "phone": {
          "type": "string",
          "description": "Số điện thoại liên hệ của khách hàng."
        },
        "date_time": {
          "type": "string",
          "description": "Thời gian đặt hẹn đầy đủ (định dạng ISO, ví dụ: 2026-07-10T10:00:00Z)."
        },
        "creator_id": {
          "type": "string",
          "description": "Mã ID duy nhất của Creator sở hữu lịch hẹn (UUID)."
        }
      },
      "required": ["name", "phone", "date_time", "creator_id"]
    }
    ```

---

## 3. Cấu Hình Webhook URL

Trong mục **Assistant** -> **Settings** -> **Webhooks** trên Vapi.ai:

*   **Webhook URL:** Điền đường dẫn API deploy của bạn trên Vercel:
    `https://your-domain.vercel.app/api/vapi`
*   **Secret (Tùy chọn):** Khóa bảo mật để kiểm tra tính hợp lệ của request.

---

## 📌 LẤY CREATOR ID Ở ĐÂU?
*   Mã ID Creator của bạn là UUID tài khoản Supabase (ví dụ: `ddde2961-7527-4003-89d7-bd8c7a014d36`).
*   Khi cấu hình prompt hệ thống hoặc cài đặt biến cho Vapi, bạn có thể gán cứng mã này vào tham số truyền đi hoặc chỉ định trực tiếp trong cấu hình Assistant để AI luôn gọi đúng cửa hàng của bạn.
