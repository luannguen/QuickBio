---
id: "ai-agent-safety"
name: "AI Agent Safety & Autonomy Skill"
version: "1.0.0"
description: "Quy chuẩn an toàn cho các tác vụ sử dụng LLM, Prompt Engineering và tự động hóa do Agent thực hiện."
---

# 🤖 AI Agent Safety & Autonomy Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Critical (BLOCKER)

## 1. Purpose
Ngăn chặn các rủi ro như Prompt Injection, Hallucination (Sinh ra dữ liệu ảo), và các hành động phá hoại ngầm do AI tự quyết định sai lầm.

## 2. Triggers
- Mọi hoạt động của bản thân AI Agent.
- Tích hợp API OpenAI, Gemini, Claude vào trong ứng dụng.

## 3. Rules & Execution
1. **Bounded Autonomy:** AI Agent (kể cả bản thân) KHÔNG ĐƯỢC TỰ Ý sửa đổi Hiến Pháp (`PROJECT-CONSTITUTION.md`) hoặc hạ mức độ các Approval Gates.
2. **AI Data Validation:** Mọi dữ liệu do LLM sinh ra (trong app) phải được coi là KHÔNG ĐÁNG TIN (Untrusted Input) và phải validate bằng schema (Vd: Zod) trước khi lưu vào Database.
3. **Prompt Injection Defense:** Khi user input được truyền vào LLM API, phải có cơ chế escape hoặc system prompt rõ ràng để tránh bị thao túng (Jailbreak).

## 4. Anti-Patterns
- ❌ Lưu trực tiếp chuỗi JSON từ LLM trả về vào cơ sở dữ liệu mà không thông qua bước validate/parse.
