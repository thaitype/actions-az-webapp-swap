# Task 1: Add resourceType to ISwapAppService and Zod Validation

## Objective

Add the `resourceType` field to the `ISwapAppService` interface and update the Zod validation schema to accept it. This is the foundational data model change that all subsequent tasks depend on.

## Scope

- Included: `ISwapAppService` interface, `ResourceType` type alias, Zod schema update, existing test updates
- Excluded: Azure CLI functions, strategy pattern, command changes

## Rules & Contracts

- `.chief/_rules/_standard/coding-standards.md` (naming: PascalCase types, `I` prefix interfaces)
- `.chief/_rules/_contract/data-models.md` (new optional fields allowed)
- `.chief/milestone-1/_contract/resource-type.md`

## Steps

1. Add `ResourceType` type alias (`'webapp' | 'functionapp'`) to `src/interfaces/ISwapAppService.ts`
2. Add optional `resourceType?: ResourceType` field to `ISwapAppService` interface
3. Export `ResourceType` from `src/interfaces/index.ts`
4. Update `SwapAppServiceSchema` in `src/validation/InputValidation.ts` to add `resourceType: z.enum(['webapp', 'functionapp']).optional()`
5. Add tests for validation: config without `resourceType` passes, with `'webapp'` passes, with `'functionapp'` passes, with invalid value fails
6. Verify existing tests still pass

## Acceptance Criteria

- [ ] `ResourceType` type is exported from interfaces
- [ ] `ISwapAppService.resourceType` is optional
- [ ] Zod validation accepts missing, `'webapp'`, and `'functionapp'` values
- [ ] Zod validation rejects invalid `resourceType` values
- [ ] All existing tests pass unchanged
- [ ] New validation tests cover the new field

## Verification

```bash
npm run build
npm test
npm run format-check
```

## Deliverables

- Modified: `src/interfaces/ISwapAppService.ts`
- Modified: `src/interfaces/index.ts` (if `ResourceType` needs explicit re-export)
- Modified: `src/validation/InputValidation.ts`
- Modified or new: `__tests__/InputValidation.test.ts`
