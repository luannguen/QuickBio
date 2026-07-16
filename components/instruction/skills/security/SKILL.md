---
id: "security"
name: "Security & Threat Modeling Skill"
version: "1.0.0"
description: "Quy tắc cốt lõi về bảo mật. Kỹ năng này giám sát mọi truy cập vào hệ thống, đảm bảo Zero-Trust, phân quyền đúng đắn và bảo vệ dữ liệu nhạy cảm."
---

# 🛡️ Security & Threat Modeling Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Critical (BLOCKER)

## 1. Purpose
Hệ thống phải được bảo vệ từ nhiều lớp (Defense in Depth). Không được phép giả định "Người dùng sẽ không làm vậy".

## 2. Triggers
- Task có `auth`, `login`, `permission`, `role`, `payment`, `tenant`, `RLS` (Row Level Security).
- Khi tạo API endpoints mới.

## 3. Rules & Execution

### Nguyên Tắc Zero-Trust
1. **Frontend (UI) KHÔNG phải là lớp bảo mật:** Mọi logic chặn ở UI (ẩn nút, redirect) chỉ là UX. Mọi API call đều phải tự kiểm tra quyền ở Backend.
2. **Server-Side Validation:** Mọi payload nhận từ client phải được validate. Không tin bất cứ UUID hoặc ID nào gửi lên (Vd: Client gửi ID đơn hàng của người khác).

### Authorization & Tenant Isolation
1. **Row Level Security (RLS) ở Database:** Nếu dùng Supabase/PostgreSQL, mọi bảng chứa dữ liệu của Tenant (Cửa hàng, User) BẮT BUỘC phải có RLS policy ép `auth.uid() = user_id`.
2. **Data Leakage Prevention:** Tránh trả về dữ liệu dư thừa. API list users không được trả về `password_hash` hay `secret_keys`.

### Data Protection
1. **Secrets:** API keys, Webhook secrets BẮT BUỘC lưu trong biến môi trường. Tuyệt đối không commit lên git.
2. **Sensitive Data (Dữ liệu nhạy cảm):** Mật khẩu, mã OTP phải được băm (hashing) hoặc mã hóa (encryption) chuẩn.

## 4. Cổng Chặn (Approval Gate)
- Việc thay đổi cấu trúc Phân Quyền (RBAC) hoặc xóa các Row Level Security (RLS) policies BẮT BUỘC phải xin ý kiến User.
- KHÔNG tạo "Backdoor" để dev dễ test nếu đưa lên Production.
