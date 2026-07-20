# Specification: Developer Control Center - Documentation Tracking

## 1. Overview
This specification details the technical changes required to implement documentation tracking (PRDs, Specs, ADRs) within the Developer Control Center.

## 2. Database Changes
No new tables are required. The existing `dev_artifacts` table will be used.
We will utilize the `artifact_type` field by conceptually expanding it to include:
- `prd`
- `spec`
- `adr`

*(Note: If `dev_artifact_type` was a strict Postgres ENUM, an ALTER TYPE would be required. Since it's currently a TEXT field based on prior checks, we can insert directly. For TypeScript, we will extend the `DevArtifact` interface).*

## 3. Application Changes
**`src/entities/developer/api.types.ts`**
- Modify `DevArtifact['artifact_type']` to add `'prd' | 'spec' | 'adr'`.

**`src/features/developer-control-center/DeveloperControlCenterView.tsx`**
- Use the existing `renderCatalog` function to render lists for:
  - `renderCatalog('prd', 'PRDs')`
  - `renderCatalog('spec', 'Specifications')`
  - `renderCatalog('adr', 'Architecture Decisions')`
- Remove the `renderComingSoon` placeholders for these tabs.

## 4. Script Changes
**`scripts/generate-artifacts-sql.cjs`**
- Add logic to recursively or directly scan the following paths:
  - `docs/prds/`
  - `docs/specs/`
  - `docs/adrs/`
- Generate checksums and output `INSERT INTO dev_artifacts` SQL statements for these paths with the appropriate `artifact_type`.
