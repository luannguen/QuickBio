---
id: "devops-release"
name: "DevOps & Release Skill"
version: "1.0.0"
description: "Quy chuẩn triển khai (Deploy), quản lý biến môi trường, CI/CD và quy trình phát hành (Release) sản phẩm."
---

# 🚀 DevOps & Release Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** High

## 1. Purpose
Đảm bảo hệ thống có thể được triển khai tự động, an toàn, quản lý cấu hình (Biến môi trường) không bị lộ lọt, và xử lý build caching tốt (Vercel).

## 2. Triggers
- Task liên quan đến `deploy`, `vercel`, `ci`, `cd`, `build error`, `env`.
- Triển khai lên Production hoặc Staging.

## 3. Rules & Execution

### Quản Lý Biến Môi Trường (Environment Variables)
1. **Never Commit Secrets:** `.env` tuyệt đối không được đưa lên Git.
2. **Sync Validation:** Bất cứ khi nào thêm một biến môi trường mới vào code (`process.env.NEW_KEY`), BẮT BUỘC phải:
   - Thêm nó (dạng rỗng hoặc dummy) vào `.env.example`.
   - Thông báo cho User cập nhật Vercel Environment Variables.

### Triển Khai (Deployment) & Build
1. Phân tích lỗi Build: Khi gặp lỗi Build (tsc, eslint, vite build), phải đọc kỹ log lỗi. Thường là do Type Mismatch hoặc Thiếu Dependency.
2. Không "Force Push" (Bỏ qua CI checks) khi đẩy code lên nhánh main/master.

## 4. Anti-Patterns
- ❌ Thay đổi cấu hình `vercel.json` hoặc `vite.config.ts` để "tắt typecheck" hoặc "tắt linter" cho nhanh qua bước Build. Mọi lỗi phải được sửa tận gốc.
