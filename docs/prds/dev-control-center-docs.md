# PRD: Developer Control Center - Documentation Tracking

## 1. Goal & Context
The Developer Control Center needs a way to track, manage, and present technical documents such as PRDs (Product Requirement Documents), Specifications, and ADRs (Architecture Decision Records) directly on the Admin Dashboard. This ensures the team adheres strictly to process and design standards by providing a transparent "Single Source of Truth."

## 2. Target Audience
- Tech Leads
- AI Developer Agents (AntiGravity, etc.)
- System Administrators

## 3. Key Features
1. **Document Storage Structure**: Formalize `docs/prds`, `docs/specs`, and `docs/adrs` as the official paths for documentation.
2. **Database Sync**: Ensure all Markdown documents are parsed, hashed (checksummed), and pushed to the `dev_artifacts` table via a sync script.
3. **UI Display**: Replace placeholders in the Developer Control Center with fully functional tables showing Document Name, Scope/Status, Dependencies, and Last Updated times.

## 4. Non-Goals
- Editing markdown documents directly in the UI (read-only for now).
- Tracking raw code files outside of the `docs/` and `rule/` directories.

## 5. Success Metrics
- 100% of `.md` files in PRDs, Specs, and ADRs are discoverable in the UI.
- Any change to these documents accurately updates the checksum in the database upon running the sync process.
