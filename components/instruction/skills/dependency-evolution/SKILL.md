---
id: "dependency-evolution"
name: "Dependency Evolution Skill"
version: "1.0.0"
description: "Kỹ năng quản lý thư viện bên ngoài (NPM, Pip, etc.), cập nhật version và kiểm tra lỗ hổng bảo mật (Vulnerabilities)."
---

# 📦 Dependency Evolution Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** High

## 1. Purpose
Kiểm soát chặt chẽ việc thêm, bớt hoặc cập nhật các thư viện bên thứ 3 (Dependencies) để tránh làm phình to ứng dụng (Bloat) hoặc gây lỗi Breaking Changes ngầm.

## 2. Triggers
- User yêu cầu cài đặt thư viện mới (`install`, `add package`, `npm i`).
- Yêu cầu cập nhật version (`update`, `upgrade`, `bump`).
- Báo cáo lỗ hổng bảo mật (`audit`, `vulnerability`).

## 3. Rules & Execution

### Khi Thêm Thư Viện Mới
1. **Justification (Biện luận):** Trước khi chạy lệnh cài đặt, tự hỏi "Có thực sự cần thư viện này không? Có thể tự viết bằng native code (vd: fetch thay vì axios, native date thay vì moment) được không?".
2. **Bundle Size Check:** Đánh giá xem thư viện có quá nặng cho UI không.

### Khi Cập Nhật (Upgrades)
1. Cập nhật Minor/Patch (vd: `1.2.3` -> `1.2.4`) thì tự động thực hiện.
2. Cập nhật Major (vd: `React 18` -> `19`, `Next 14` -> `15`) là **High Risk** và bắt buộc phải đưa qua **Approval Gate** để hỏi User.
3. Luôn đọc Changelog của thư viện trước khi update Major.

## 4. Anti-Patterns
- ❌ Chạy `npm update` toàn bộ dự án mù quáng mà không kiểm tra Breaking Changes.
- ❌ Thêm các thư viện không đáng tin cậy hoặc bị bỏ hoang (deprecated).
