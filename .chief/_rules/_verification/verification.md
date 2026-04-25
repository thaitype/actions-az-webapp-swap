# Verification Rules

## Build Verification

All code changes must pass:

```bash
npm run build
```

This compiles TypeScript from `src/` to `lib/`.

## Test Verification

```bash
npm test
```

- Uses Jest with ts-jest transform
- Test files: `__tests__/**/*.test.ts`
- All tests must pass before a task is considered complete

For coverage:

```bash
npm run test:coverage
```

## Format Verification

```bash
npm run format-check
```

Must pass with zero formatting issues.

## Package Verification

When source code changes affect runtime behavior:

```bash
npm run package
```

This rebuilds `dist/index.js` via `@vercel/ncc`. The `dist/` directory must be committed.

## Full Verification (CI equivalent)

```bash
npm run all
```

Runs: `build` -> `format` -> `package` -> `test`

## Definition of Done

A task is complete when:

1. `npm run build` succeeds (zero TypeScript errors)
2. `npm test` passes (all tests green)
3. `npm run format-check` passes (no formatting issues)
4. If runtime code changed: `npm run package` was run and `dist/` updated
5. No new lint warnings introduced
