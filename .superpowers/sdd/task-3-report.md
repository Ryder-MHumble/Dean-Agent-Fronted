# Task 3 Engineering Report

## Status

DONE

## Scope

- Migrated the paper and academic-achievement modules to `IntelligencePageShell`.
- Replaced local filter cards with `IntelligenceToolbar` and local master/detail surfaces with `IntelligenceWorkspace`, `IntelligenceListItem`, `IntelligenceDetailHeader`, and `IntelligenceSection`.
- Kept the paper and achievement implementations separate; no hook, API, query model, or record model was merged or changed.

## Files

- `components/modules/papers/index.tsx`
- `components/modules/papers/paper-list.tsx`
- `components/modules/internal-shared/academic-achievements.tsx`
- `components/modules/internal-shared/academic-achievement-list.tsx`
- `tests/intelligence-pages.test.mjs`
- `tests/intelligence-ui-contract.test.mjs`

## RED Evidence

Command:

```bash
node --test tests/intelligence-ui-contract.test.mjs tests/intelligence-pages.test.mjs tests/paper-feed.test.mjs tests/achievement-feed.test.mjs
```

Initial result: exit code 1; 35 tests ran, 34 passed, and 1 failed. The new migration contract failed on the missing `IntelligenceToolbar` in `paper-list.tsx`, before any production edits.

After the paper migration, the focused migration assertion still failed on the academic-achievement list's missing shared toolbar, confirming both paths were covered.

During self-review, a targeted preservation assertion also failed before the sampled paper count was corrected: sampled feeds would have been presented as an exact toolbar total instead of the existing `精选聚合 N 条` wording.

## GREEN Evidence

- Focused command above: 35/35 passed, 0 failed.
- `node --test tests/*.test.mjs`: 129/129 passed, 0 failed.
- `./node_modules/.bin/tsc --noEmit --incremental false --pretty false`: exit 0.
- `npm run build`: exit 0; Next.js production build and all routes completed.
- `git diff --check`: exit 0.

Node tests continue to print the repository's existing `MODULE_TYPELESS_PACKAGE_JSON` performance warning. It does not affect results.

## Self-review

- Papers retain the default `top-conference` category, category/source/date/search behavior, page/detail resets, optional date grouping, Chinese `预印本` copy, module-level scholar hover-card cache, scholar graph links, source/PDF links, sampled-count wording, and pagination.
- Academic achievements retain `useZgcaAchievements`, all type/status/year/source/member filters, asynchronous `/api/scholars/:id` identity enrichment, the module cache, author merging, `key={item.id}`, source labels and links, detail/PDF links, Skill link, pagination, and detail order: author, abstract, project, sources, identifiers, full text.
- Both Skill links remain unframed metadata links supplied by the module wrappers.
- The pages use the shared solid report background and shared white toolbar/workspace surfaces; no hero, gradient, design narration, CTA, or entrance-hiding behavior was added.
- No data-layer files, hooks, APIs, shared primitive implementations, or unrelated modules were modified.

## Concerns

- `next build` reports that its own type validation is skipped by repository configuration; the separate full TypeScript command passed.
- No blocking concerns remain for Task 3.
