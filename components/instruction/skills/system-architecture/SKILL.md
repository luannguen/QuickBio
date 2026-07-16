---
id: "system-architecture"
name: "System Architecture Skill"
version: "1.0.0"
description: "Kỹ năng thiết kế kiến trúc hệ thống. Chịu trách nhiệm thiết kế cấu trúc module, luồng dữ liệu (data flow) và giao tiếp giữa các thành phần trước khi đi vào implement chi tiết."
---

# 🏗️ System Architecture Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** High

## 1. Purpose
Đảm bảo hệ thống phát triển một cách có cấu trúc, tuân thủ nguyên tắc Feature-Sliced Design (FSD) hoặc cấu trúc module hiện hành, thay vì tạo ra "Spaghetti Code".

## 2. Triggers
- Task thêm mới Module lớn, Service mới, Database Tables mới.
- Task thay đổi luồng giao tiếp giữa Frontend và Backend.
- Yêu cầu liên quan đến `architecture`, `design`, `module`, `flow`, `structure`.

## 3. Execution Workflow
1. **Current State Analysis:** Khảo sát kiến trúc hiện tại thông qua `ARCHITECTURE_DECISIONS.md`.
2. **Component Mapping:** Xác định các lớp (Layers) sẽ bị ảnh hưởng (UI, Logic, Data, External API).
3. **Data Flow Design:** Vẽ hoặc mô tả luồng đi của dữ liệu từ Client -> Server -> DB và ngược lại.
4. **Boundary Enforcement:** Đảm bảo các module không bị "rò rỉ" (leak) state sang nhau. Luôn sử dụng public API của module (vd: `index.ts` ở FSD).
5. **Architectural Proposal:** Nếu thay đổi lớn, phải viết một bản thiết kế ngắn (Architecture Proposal) và **YÊU CẦU DUYỆT (Approval Gate)** trước khi code.

## 4. Architectural Rules Bắt Buộc
- **Separation of Concerns:** Tách biệt rõ UI (Component), Logic (Hook/Store), và Data (Service/API).
- **Single Source of Truth:** Bất kỳ trạng thái (state) nào cũng chỉ được lưu trữ và quản lý ở một nơi duy nhất.
- **Dependency Inversion:** Các module cấp cao không phụ thuộc vào module cấp thấp. Phụ thuộc vào interface, không phụ thuộc implementation.

## 5. Cập nhật Memory
Nếu đưa ra một quyết định kiến trúc mới, BẮT BUỘC phải tạo thêm mục trong `ARCHITECTURE_DECISIONS.md`.
