# Specification: Execution & System Changes Tracking

## 1. Overview
This specification details the frontend component updates and backend scripts needed to support tracking Execution Checkpoints and System Changes in the Developer Control Center.

## 2. Database Models (Existing)
We rely on:
- `dev_checkpoints`: `id`, `name`, `status`, `timestamp`, `details`.
- `dev_system_changes`: `id`, `version_tag`, `description`, `changed_files`, `created_at`, `created_by`.

## 3. Script: `scripts/record-change.cjs`
We will build a simple Node CLI to push data to Supabase.
**Usage:**
```bash
node scripts/record-change.cjs --version "v1.1.1" --desc "Added Checkpoints Module" --files "DeveloperControlCenterView.tsx, record-change.cjs" --user "ddde2961-7527-4003-89d7-bd8c7a014d36"
```
**Mechanism**:
- Use `pg` to INSERT into `dev_system_changes`.
- Auto-generate an associated checkpoint in `dev_checkpoints`.

## 4. Frontend Hooks & UI
**`src/shared/hooks/useDeveloperSWR.ts`**
- Ensure `useDevCheckpoints()` and `useDevSystemChanges()` are fully implemented to call `supabase.from(...)`. (We will verify this and add them if they don't exist).

**`src/features/developer-control-center/DeveloperControlCenterView.tsx`**
- Create `renderCheckpoints()`: Maps over checkpoints data. If empty, show a message "No checkpoints recorded yet". Use a timeline or list styling.
- Create `renderSystemChanges()`: Renders a Table with columns: Version, Description, Changed Files count/list, Created At, and User.
- Update the main switch case in `DeveloperControlCenterView` to call these functions when `activeTab === 'checkpoints'` or `activeTab === 'changes'`.
