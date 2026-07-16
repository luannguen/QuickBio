# 🔄 Workflow Registry

**Layer:** 2 - Orchestration  
**Status:** Active  
**Description:** Danh sách định nghĩa các quy trình (workflows) chuẩn của dự án. Orchestrator sẽ quyết định dùng Workflow nào dựa trên phân loại Task.

## 1. Core Workflows (Quy Trình Cốt Lõi)

| Workflow ID | Name | Path | Triggers | Risk Levels |
| :--- | :--- | :--- | :--- | :--- |
| `wf-feature` | Feature Development | `workflows/feature-development/WORKFLOW.md` | `new feature`, `enhancement` | Low, Medium, High, Critical |
| `wf-bugfix` | Bug Fix | `workflows/bug-fix/WORKFLOW.md` | `bug`, `fix`, `error` | Low, Medium, High, Critical |
| `wf-incident` | Incident Response | `workflows/incident-response/WORKFLOW.md` | `crash`, `down`, `critical bug` | High, Critical |
| `wf-refactor` | Refactoring | `workflows/refactoring/WORKFLOW.md` | `refactor`, `clean code`, `debt`| Medium, High |
| `wf-migration` | Migration | `workflows/migration/WORKFLOW.md` | `migration`, `schema change` | High, Critical |
| `wf-dependency`| Dependency Upgrade | `workflows/dependency-upgrade/WORKFLOW.md` | `upgrade`, `bump`, `audit` | Medium, High, Critical |
| `wf-release` | Release | `workflows/release/WORKFLOW.md` | `deploy`, `release`, `publish` | Medium, High, Critical |
| `wf-performance`| Performance Optimization | `workflows/performance-optimization/WORKFLOW.md` | `slow`, `optimize`, `speed` | Medium, High |
| `wf-security` | Security Review | `workflows/security-review/WORKFLOW.md` | `audit`, `security`, `vuln` | Medium, High, Critical |

## 2. Maintenance Rules
- KHÔNG gọi một workflow chưa được định nghĩa trong danh sách này.
- Mỗi workflow bắt buộc phải tuân thủ chuẩn đầu vào (Inputs) và đầu ra (Outputs).
- Workflow phải định nghĩa rõ Approval Gates.
