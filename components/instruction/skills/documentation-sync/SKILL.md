---
id: "documentation-sync"
name: "Documentation Sync Skill"
version: "1.0.0"
description: "Kỹ năng giữ cho các file README, API Docs và System Design luôn được cập nhật đồng bộ với code thực tế."
---

# 📚 Documentation Sync Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Low

## 1. Purpose
Tránh tình trạng "Code một đằng, Docs một nẻo". Đảm bảo documentation sống (Living Document) luôn phản ánh chính xác trạng thái của Production.

## 2. Triggers
- Bất kỳ khi nào hoàn thành một task có tạo thêm API mới, thay đổi luồng nghiệp vụ hoặc cấu trúc file quan trọng.
- Khi User yêu cầu `update docs`, `readme`.

## 3. Rules & Execution
1. **Self-Documenting Code First:** Ưu tiên đặt tên biến, hàm rõ ràng thay vì viết comment giải thích code tồi.
2. **API Documentation:** Nếu tạo route API mới, BẮT BUỘC cập nhật tài liệu API (nếu có, ví dụ Swagger/OpenAPI hoặc file Markdown mô tả API).
3. **Environment Sync:** Nếu thay đổi biến môi trường, bắt buộc cập nhật `.env.example` và `README.md`.

## 4. Anti-Patterns
- ❌ Hoàn thành một Feature phức tạp nhưng không để lại bất kỳ dòng giải thích nào trong Project Memory hoặc README.
