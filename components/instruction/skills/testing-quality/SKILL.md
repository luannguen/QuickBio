---
id: "testing-quality"
name: "Testing & Quality Skill"
version: "1.0.0"
description: "Quy chuẩn đảm bảo chất lượng. Bao gồm chiến lược test, linting, type-checking và nghiệm thu chất lượng."
---

# 🧪 Testing & Quality Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Medium

## 1. Purpose
Đảm bảo mọi dòng code sinh ra không phá vỡ logic cũ (Regression), đạt chuẩn Type-Safety của Typescript và được format chuẩn mực.

## 2. Triggers
- Sau khi viết code mới hoặc sửa code.
- Yêu cầu liên quan đến `test`, `qa`, `lint`, `type`.

## 3. Rules & Execution

### 1. Static Testing (TypeScript & Linting)
- **Zero Typescript Errors:** KHÔNG được dùng `any` bừa bãi. Bắt buộc định nghĩa Interfaces/Types rõ ràng. Phải sửa mọi lỗi TS compiler báo (hoặc dùng ts-ignore có comment giải thích nếu do thư viện bên thứ 3).
- **Linter:** Tuân thủ ESLint/Oxlint đang cấu hình.

### 2. Manual Testing / QA Verification
Do Agent không thể tự nhìn UI như con người, việc QA thủ công dựa trên Log và Code Analysis:
- Đảm bảo xử lý đủ 4 states: `Initial`, `Loading`, `Success`, `Error`.
- Kiểm tra Edge cases (Dữ liệu rỗng, dữ liệu null, mảng chưa khởi tạo).

### 3. Automated Testing (Tương lai)
- Nếu dự án có cấu hình Unit Test / E2E, phải chạy test script và đảm bảo test Pass trước khi báo cáo hoàn thành.

## 4. Anti-Patterns
- ❌ Code ép kiểu (Type casting) lừa dối TS Compiler (Vd: `as unknown as MyType`).
- ❌ Viết logic mà không xử lý `catch (error)`.
