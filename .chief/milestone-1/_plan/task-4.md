# Task 4: Integrate Strategy into AppSettings, ConnectionStrings, and SwapSlots

## Objective

Replace direct `webApp*` utility calls in `AppSettings`, `ConnectionStrings`, and `SwapSlots` with strategy-based calls. The strategy is obtained from `AzureResourceStrategyFactory` using the `swapAppService` config.

## Scope

- Included: Modify `AppSettings.ts`, `ConnectionStrings.ts`, `SwapSlots.ts` to use strategy
- Excluded: Warnings (task-5), action.yml changes (task-5), new tests for strategy (task-3 covers those)

## Rules & Contracts

- `.chief/_rules/_standard/architecture.md` (command pattern, no if/else branching)
- `.chief/milestone-1/_contract/strategy-interface.md`

## Steps

1. In `AppSettings.ts`: import `AzureResourceStrategyFactory`, create strategy in constructor or `list()`, replace `webAppListAppSettings` calls with `strategy.listAppSettings`, replace `webAppSetAppSettings` call with `strategy.setAppSettings`
2. In `ConnectionStrings.ts`: same pattern -- replace `webAppListConnectionStrings` with `strategy.listConnectionStrings`, replace `webAppSetConnectionStrings` with `strategy.setConnectionStrings`
3. In `SwapSlots.ts`: import factory, create strategy, replace `webAppSwap` with `strategy.swap`
4. Update existing tests for `AppSettings`, `ConnectionStrings`, `SwapSlots` to mock the strategy or verify behavior still works

## Acceptance Criteria

- [ ] `AppSettings` uses strategy for `list()` and `setWebApp()`
- [ ] `ConnectionStrings` uses strategy for `list()` and `setWebApp()`
- [ ] `SwapSlots` uses strategy for `execute()`
- [ ] No direct `webApp*` imports remain in these three files
- [ ] No if/else branching on `resourceType` in command classes
- [ ] All existing tests pass (may need mock updates)
- [ ] New tests verify Function App path through the strategy

## Verification

```bash
npm run build
npm test
npm run format-check
```

## Deliverables

- Modified: `src/core/AppSettings.ts`
- Modified: `src/core/ConnectionStrings.ts`
- Modified: `src/commands/SwapSlots.ts`
- Modified: `__tests__/AppSettingsBase.test.ts` (if needed)
