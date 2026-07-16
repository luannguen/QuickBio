# 🗂️ Skill Registry

**Layer:** 2 - Orchestration  
**Status:** Active  
**Description:** Hệ thống thư mục (Index) tập trung quản lý toàn bộ các Capability Skills và Domain Skills của dự án. Project Orchestrator sử dụng Registry này để định tuyến (route) chính xác skill cần thiết cho mỗi task, ngăn chặn việc load thừa instruction không liên quan.

*Note: Danh sách này cần được tự động kiểm tra tính hợp lệ bằng `scripts/skill-lint.js`.*

## 1. Capability Skills (Kỹ Năng Năng Lực)

| Skill ID | Name | Path | Triggers | Risk Levels |
| :--- | :--- | :--- | :--- | :--- |
| `project-orchestrator` | Project Orchestrator | `skills/project-orchestrator/SKILL.md` | *Mọi task (Bootstrapped)* | Low, Medium, High, Critical |
| `project-memory` | Project Memory | `skills/project-memory/SKILL.md` | *Mọi task* | Low, Medium, High, Critical |
| `requirement-analysis` | Requirement Analysis | `skills/requirement-analysis/SKILL.md` | `requirement`, `spec`, `feature`, `logic` | Medium, High, Critical |
| `system-architecture` | System Architecture | `skills/system-architecture/SKILL.md` | `design`, `architecture`, `module`, `flow` | High, Critical |
| `ui-ux-production` | UI/UX Production | `skills/ui-ux-production/SKILL.md` | `ui`, `ux`, `component`, `page`, `style` | Low, Medium, High |
| `backend-production` | Backend Production | `skills/backend-production/SKILL.md` | `api`, `serverless`, `database`, `logic` | Low, Medium, High, Critical |
| `api-integration` | API & Integration | `skills/api-integration/SKILL.md` | `webhook`, `3rd-party`, `endpoint` | Medium, High |
| `data-lifecycle` | Data Lifecycle | `skills/data-lifecycle/SKILL.md` | `schema`, `migration`, `cache`, `retention`| High, Critical |
| `security` | Security & Threat Modeling | `skills/security/SKILL.md` | `auth`, `payment`, `permission`, `tenant` | High, Critical |
| `testing-quality` | Testing & Quality | `skills/testing-quality/SKILL.md` | `test`, `qa`, `coverage`, `e2e` | Low, Medium, High, Critical |
| `code-review-refactoring`| Code Review & Refactor | `skills/code-review-refactoring/SKILL.md` | `refactor`, `clean`, `review` | Medium, High |
| `dependency-evolution` | Dependency Evolution | `skills/dependency-evolution/SKILL.md` | `npm`, `package`, `upgrade`, `vulnerability`| Medium, High, Critical |
| `devops-release` | DevOps & Release | `skills/devops-release/SKILL.md` | `deploy`, `vercel`, `ci`, `cd`, `env` | Medium, High, Critical |
| `observability-incident` | Observability & Incident | `skills/observability-incident/SKILL.md` | `bug`, `log`, `error`, `crash`, `monitor` | Medium, High, Critical |
| `performance-scalability`| Performance & Scale | `skills/performance-scalability/SKILL.md` | `slow`, `optimize`, `n+1`, `load` | Medium, High |
| `documentation-sync` | Documentation Sync | `skills/documentation-sync/SKILL.md` | `doc`, `readme`, `adr`, `update` | Low, Medium |
| `migration-compatibility`| Migration & Backward Comp | `skills/migration-compatibility/SKILL.md` | `migrate`, `breaking`, `v1-to-v2` | High, Critical |
| `analytics-telemetry` | Analytics & Telemetry | `skills/analytics-telemetry/SKILL.md` | `event`, `track`, `ga`, `mixpanel` | Low, Medium |
| `ai-agent-safety` | AI Agent Safety | `skills/ai-agent-safety/SKILL.md` | `llm`, `prompt`, `agent`, `automation` | Medium, High, Critical |

## 2. Domain Skills (Kỹ Năng Nghiệp Vụ)

| Skill ID | Name | Path | Associated Entities/Modules |
| :--- | :--- | :--- | :--- |
| `domain-user-identity` | User & Identity | `skills/domains/user-identity/SKILL.md` | `users`, `auth`, `profiles` |
| `domain-bio-tenant` | Bio & Tenant Isolation | `skills/domains/bio-tenant/SKILL.md` | `bios`, `tenant_id`, `custom_domain` |
| `domain-product-inventory` | Product & Inventory | `skills/domains/product-inventory/SKILL.md` | `products`, `inventory`, `digital_file` |
| `domain-order-payment` | Order & Payment | `skills/domains/order-payment/SKILL.md` | `orders`, `transactions`, `qr_code` |
| `domain-marketing-affiliate`| Marketing & Affiliate | `skills/domains/marketing-affiliate/SKILL.md` | `affiliates`, `commissions`, `referrals` |
| `domain-admin-rbac` | Admin & RBAC | `skills/domains/admin-rbac/SKILL.md` | `admin_roles`, `permissions`, `dashboard` |

## 3. Maintenance Rules
- KHÔNG tạo Skill trùng lặp.
- Mọi Skill được định nghĩa ở đây phải có file `SKILL.md` tương ứng tồn tại ở đường dẫn `Path`.
- Nếu có file `SKILL.md` không nằm trong danh sách này, file đó bị xem là "Orphaned" (Mồ côi) và Orchestrator sẽ không bao giờ gọi tới.
