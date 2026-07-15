# Task 4 Engineering Report

## Status

DONE

## Scope

- Migrated the external-leader and internal-expert pages to `IntelligencePageShell`, `IntelligenceToolbar`, `IntelligenceWorkspace`, `IntelligenceListItem`, `IntelligenceDetailHeader`, and `IntelligenceSection`.
- Kept the existing hooks, APIs, query parameters, record models, generated snapshots, and pagination behavior unchanged.
- Removed fabricated update labels when no reliable leader or expert timestamp is available.

## Files

- `components/modules/talent-radar/index.tsx`
- `components/modules/internal-shared/internal-experts.tsx`
- `tests/intelligence-pages.test.mjs`
- `tests/intelligence-ui-contract.test.mjs`

## RED Evidence

Command:

```bash
node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/leader-display.test.mjs tests/leader-query.test.mjs tests/internal-experts.test.mjs
```

Initial result: exit code 1; 33 tests ran, 29 passed, and 4 failed. The failures were the new shared people-layout and timestamp-preservation assertions against the two unmigrated pages. No production file had been edited before this run.

## GREEN Evidence

- Focused command above: 33/33 passed, 0 failed.
- `node --test tests/*.test.mjs`: 130/130 passed, 0 failed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false`: exit 0.
- `npm run build`: exit 0; Next.js production build completed and generated all routes.
- `git diff --check`: exit 0.

Node tests continue to print the repository's existing `MODULE_TYPELESS_PACKAGE_JSON` performance warning. It does not affect results.

## Preservation Review

- External leaders retain the default `government` and `current` filters, submitted keyword/name/organization queries, current-page review count, avatar URL fallback, biography, career timeline, personnel events, citations, source links, loading state, pagination, and detail closure on search/filter/page changes.
- Leader freshness is shown only when a real `updated_at` or `created_at` value exists; the previous current-time fallback was removed.
- Internal experts retain the 667-record sanitized snapshot boundary, name-plus-organization selection key, public-field-only search, organization/role/research/discipline details, unframed scholar-data and Skill links, pagination, and detail closure on search/page changes.
- Expert update metadata is omitted when the record has no `updatedAt` value; the snapshot-level freshness uses the validated `syncedAt` value.
- No hooks, API routes, generated data, sanitizers, query builders, shared primitive implementations, or unrelated modules were changed.

## Concerns

- Next.js reports that its built-in type validation is skipped by repository configuration; the separate full TypeScript check passed.
- No blocking concerns remain for Task 4.
