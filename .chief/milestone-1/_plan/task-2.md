# Task 2: Add functionApp* Utility Functions to azureUtility.ts

## Objective

Add parallel `functionApp*` functions and Azure CLI command builders in `azureUtility.ts` that mirror the existing `webApp*` functions but use `az functionapp` commands.

## Scope

- Included: New command builders and async functions in `azureUtility.ts`, tests for new functions
- Excluded: Strategy pattern, command/core class changes

## Rules & Contracts

- `.chief/_rules/_standard/coding-standards.md`
- `.chief/_rules/_standard/architecture.md` (Azure CLI via promisify-child-process)
- `.chief/milestone-1/_contract/resource-type.md` (CLI command mapping table)

## Steps

1. Add to `azureCommands` object: `functionAppListAppSettings`, `functionAppListConnectionStrings`, `functionAppSetConnectionString`, `functionAppSetAppSettingsByFile`, `functionAppDeploySlotSwap`
2. Add async wrapper functions: `functionAppListAppSettings`, `functionAppListConnectionStrings`, `functionAppSetConnectionStrings`, `functionAppSetAppSettings`, `functionAppSwap`
3. The new functions must have identical signatures and return types to their `webApp*` counterparts
4. Write unit tests for the new command builders (verify correct CLI strings are produced)

## Acceptance Criteria

- [ ] All 5 `functionApp*` command builders exist in `azureCommands`
- [ ] All 5 `functionApp*` async wrapper functions are exported
- [ ] Function signatures match their `webApp*` counterparts exactly
- [ ] CLI commands use `az functionapp` instead of `az webapp`
- [ ] Tests verify correct command string generation
- [ ] All existing tests still pass

## Verification

```bash
npm run build
npm test
npm run format-check
```

## Deliverables

- Modified: `src/utils/azureUtility.ts`
- New or modified: `__tests__/utils/azureUtility.test.ts`
