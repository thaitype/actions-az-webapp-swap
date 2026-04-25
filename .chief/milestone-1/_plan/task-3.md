# Task 3: Create IAzureResourceStrategy, Implementations, and Factory

## Objective

Create the strategy pattern infrastructure: `IAzureResourceStrategy` interface, `WebAppStrategy` class, `FunctionAppStrategy` class, and `AzureResourceStrategyFactory`.

## Scope

- Included: New file `src/core/AzureResourceStrategy.ts`, tests for factory and both strategies
- Excluded: Integration into existing classes (task-4), warnings (task-5)

## Rules & Contracts

- `.chief/_rules/_standard/coding-standards.md` (PascalCase classes, `I` prefix interfaces)
- `.chief/_rules/_standard/architecture.md`
- `.chief/milestone-1/_contract/strategy-interface.md`

## Steps

1. Create `src/core/AzureResourceStrategy.ts`
2. Define `IAzureResourceStrategy` interface with methods: `listAppSettings`, `setAppSettings`, `listConnectionStrings`, `setConnectionStrings`, `swap`
3. Implement `WebAppStrategy` -- delegates to `webApp*` functions from `azureUtility.ts`
4. Implement `FunctionAppStrategy` -- delegates to `functionApp*` functions from `azureUtility.ts`
5. Implement `AzureResourceStrategyFactory.create(swapAppService)` -- returns strategy based on `swapAppService.resourceType`
6. Default to `WebAppStrategy` when `resourceType` is undefined
7. Write tests: factory returns correct strategy, both strategies delegate to correct utility functions

## Acceptance Criteria

- [ ] `IAzureResourceStrategy` interface is exported
- [ ] `WebAppStrategy` implements the interface, delegates to `webApp*` functions
- [ ] `FunctionAppStrategy` implements the interface, delegates to `functionApp*` functions
- [ ] Factory returns `WebAppStrategy` for undefined or `'webapp'`
- [ ] Factory returns `FunctionAppStrategy` for `'functionapp'`
- [ ] Tests cover factory logic and both strategy implementations

## Verification

```bash
npm run build
npm test
npm run format-check
```

## Deliverables

- New: `src/core/AzureResourceStrategy.ts`
- New: `__tests__/AzureResourceStrategy.test.ts`
