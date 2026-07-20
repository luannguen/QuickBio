# 🌌 A.A.P v3.0 - AGENT OPERATIONAL PROTOCOL

## 1. Các Phase Kích hoạt (Triggers)
- **Phase 1: TIẾP NHẬN & TƯ DUY** -> Kích hoạt khi nhận Task mới. Đọc `AGENTIC-BEHAVIOR.md` & `GOALS.md`. Lên kế hoạch cấu trúc luồng dữ liệu (Data Flow), phát hiện và ngăn chặn API Waterfall bằng cách thiết kế SQL RPCs ngay từ bước này. Đánh giá sự sẵn sàng của Task theo **Definition of Ready (DoR)**.
- **Phase 2: QUẢN TRỊ & QUY TRÌNH** -> Kích hoạt khi lập Plan/Task. Cập nhật `PROJECT-CONTEXT.md` & `DECISION-LOG.md`. BẮT BUỘC in ra **Pre-task contract** trước khi bắt đầu viết code.
- **Phase 3: THỰC THI & CODING** -> Kích hoạt trước khi viết code (`write_to_file`, `replace_file_content`). Bắt buộc đọc `AI-CODING-RULES.md`.
- **Phase 4: HOÀN TẤT & ĐỒNG BỘ** -> Đánh giá task hoàn thành theo **Definition of Done (DoD)**, cập nhật **Post-task contract**, và thực hiện ghi nhận checkpoint thông qua script ghi log thay đổi.

## 2. Tiêu chuẩn Artifacts
- **Implementation Plan**: Phải có mục *User Review Required* để user duyệt trước khi làm.
- **Task List**: Theo dõi tiến độ chi tiết `[ ]`, `[/]`, `[x]`. Cập nhật liên tục.
- **Walkthrough**: Tóm tắt kết quả sau khi hoàn thành.
- **Vị trí**: Lưu trong thư mục artifacts của Gemini.

## 3. Definition of Ready (DoR) - Kiểm tra trước khi làm
- [ ] Phân loại thay đổi (Change Classification - trivial/small/medium/large) đã được xác định.
- [ ] Khả năng tái sử dụng (Rules, Skills, Patterns hiện có) đã được xác định qua audit nhanh.
- [ ] PRD và Technical Spec đã tồn tại hoặc được cập nhật nếu task ở mức medium/large.
- [ ] Đã resolve các rules/skills tương ứng cần sử dụng.
- [ ] Đã tạo Task Execution Context hoặc lưu checkpoint tương ứng.

## 4. Definition of Done (DoD) - Kiểm tra trước khi kết thúc
- [ ] Code tuân thủ Rules, Skills và Coding Standards của dự án.
- [ ] Đã chạy các bộ verify hoặc build kiểm chứng và đảm bảo build thành công.
- [ ] Đã ghi nhận các thay đổi (System Change, Checkpoint) vào database.
- [ ] Cập nhật PRD/Spec/ADR tương ứng nếu trong quá trình code có thay đổi thiết kế.
- [ ] Lưu lại các lỗi còn tồn tại (Known Issues, Tech Debt) nếu có.

## 5. Pre-task Contract (BẮT BUỘC in ra trước khi code)
```text
Task: <Mô tả task>
Change size: <trivial | small | medium | large>
PRD/Spec/ADR Ref: <Link hoặc ID>
Rules selected: <Mảng các rules key dùng>
Skills selected: <Mảng các skills key dùng>
Patterns selected: <Mảng các patterns key dùng>
Execution Context ID: <ID sinh ra>
```

## 6. Post-task Contract (BẮT BUỘC in ra sau khi hoàn thành)
```text
PRD/Spec/ADR compliance: <Đạt | Khác biệt - Nêu rõ lý do>
Rules applied: <Mảng rules>
Skills executed: <Mảng skills>
Changelog/Version bump: <Có/Không>
Known limitations/Tech debt: <Nêu rõ nếu có>
```

## 7. Xử lý Lỗi & Khắc phục
- Nếu Code sinh ra vi phạm Rule -> Làm lại ngay lập tức.
- Nếu Build lỗi -> KHÔNG ĐƯỢC đoán mù. Đọc Log, view file gây lỗi, sau đó mới sửa.

