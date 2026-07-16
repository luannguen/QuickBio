# 📜 ARCHITECTURE DECISION LOG

| Ngày | Quyết định | Bối cảnh & Lý do | Trạng thái |
|---|---|---|---|
| 16/07/2026 | Chuyển đổi sang A.A.P v3.0 Protocol | Cần chuẩn hoá hành vi của AI Agent, ngăn chặn việc Agent phá vỡ cấu trúc mã nguồn. Xoá bỏ `components/instruction/` cũ. | **Active** |
| 16/07/2026 | Sử dụng Supabase RLS cho Multi-tenant | Đảm bảo dữ liệu Sản phẩm/Bài viết của các Tenant được cách ly độc lập, nhưng Super Admin vẫn có thể bypass nhờ policy đặc biệt. | **Active** |
| 15/07/2026 | Strict 3-Layer Architecture | Ngăn việc trộn lẫn fetch data Supabase trong UI components gây khó bảo trì. Chia thành UI -> Hook -> Service/API. | **Active** |
