# ADR 001: Documentation Tracking in Developer Control Center

## Status
Accepted

## Context
We need a systematic way to track Product Requirement Documents (PRDs), Specifications, and Architecture Decision Records (ADRs) to enforce process compliance and keep a unified source of truth for the Developer Control Center.

## Options Considered
1. **Create new tables**: `dev_prds`, `dev_specs`, `dev_adrs`.
   - *Pros*: Strict separation of concerns.
   - *Cons*: High overhead, requires UI duplication, redundant since documents share the same metadata structure as rules and skills.
2. **Re-use `dev_artifacts` table**.
   - *Pros*: We already have a synchronization script (`generate-artifacts-sql.cjs`) and UI rendering logic (`renderCatalog`). PRDs and Specs are essentially "artifacts" of the development process.
   - *Cons*: Overloading the `artifact_type` field.

## Decision
We decided to go with **Option 2: Re-use `dev_artifacts` table**. We will extend `artifact_type` to include `prd`, `spec`, and `adr`.

## Consequences
- The synchronization script must be updated to parse the `docs/prds`, `docs/specs`, and `docs/adrs` directories.
- The UI can easily render these new artifacts by passing the correct filter parameter to the existing components.
