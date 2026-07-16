# 🧠 PROJECT CONTEXT

## Thông tin dự án
- Tên dự án: QuickBio (KiemTienOnline).
- Mô hình kinh doanh: SaaS (Software as a Service) Multi-tenant.
- Tech Stack: React 18, Vite, TypeScript, Tailwind CSS, Supabase (PostgreSQL).

## Đối tượng & Phân quyền
- **Tenant (Creator/Seller)**: Đăng ký tài khoản, có trang Bio riêng, tự đăng bài viết (Articles) và đăng bán sản phẩm (Products). Quản lý độc lập.
- **Super Admin**: Quản trị viên cấp cao của nền tảng. Có quyền truy cập vào Admin Console, kiểm duyệt (Cảnh cáo, Đình chỉ, Xoá) bài viết và sản phẩm của mọi Tenant. Có quyền thanh toán hoa hồng (Withdrawals).
- **Guest (Người mua)**: Truy cập trang Bio của Tenant, đọc bài viết, đặt mua sản phẩm vật lý/số.

## Tình trạng hiện hành
- E-commerce CRUD (Digital & Physical) và Articles CRUD đã hoàn thành. RLS đã được cấu hình chặt chẽ.
- Đang bắt đầu quá trình refactor nội bộ bằng A.A.P v3.0 Protocol.
