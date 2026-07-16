# 📝 Quyết Định Kiến Trúc (Architecture Decision Records - ADR)

Lưu trữ các quyết định lớn về công nghệ hoặc thiết kế. Điều này giúp Agent sau này không lặp lại sai lầm hoặc tự hỏi "Tại sao lại code thế này?".

## Format Bắt Buộc Khi Thêm Mới:
```markdown
### [ADR-00X] Tên Quyết Định
- **Ngày:** YYYY-MM-DD
- **Bối cảnh:** Vấn đề là gì?
- **Quyết định:** Chọn giải pháp nào?
- **Lý do:** Tại sao chọn giải pháp đó (ưu/nhược)?
- **Hệ quả:** Bất kỳ lưu ý nào cho developer tương lai.
```

---

### [ADR-001] Áp Dụng Feature-Sliced Design (FSD)
- **Ngày:** 2026-07-16
- **Bối cảnh:** Cấu trúc dự án cũ lộn xộn, module FE/BE trộn lẫn, khó scale và khó tái sử dụng. Cần một kiến trúc rõ ràng cho Agent AI dễ hiểu.
- **Quyết định:** Chuyển toàn bộ dự án sang chuẩn **Feature-Sliced Design**.
- **Lý do:** FSD quy định rõ ranh giới các Layer (app, pages, features, entities, shared). Rất phù hợp để AI tự navigate và tái sử dụng component mà không gây vòng lặp dependencies.
- **Hệ quả:** Mọi file mới phải đặt đúng Layer. `shared` không được gọi `features`, `entities` không được gọi `features` v.v.

### [ADR-002] Path Mapping `@/*`
- **Ngày:** 2026-07-16
- **Bối cảnh:** Import đường dẫn tương đối (../../) quá sâu gây khó đọc và dễ sai sót.
- **Quyết định:** Cấu hình `tsconfig.app.json` và `vite.config.ts` để hỗ trợ `@/*` trỏ về `src/*`. Bỏ cờ `baseUrl` bị deprecate trong TS 6.0.
- **Lý do:** Standard practice, sạch code.
- **Hệ quả:** Bắt buộc dùng `@/...` khi import cross-layer.
