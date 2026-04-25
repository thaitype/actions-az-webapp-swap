# Task 5: Add Function App Warnings and Update action.yml

## Objective

Add non-blocking warnings for critical Function App settings that are not marked as slot-sticky, and update `action.yml` to document the `resourceType` field in the `config` description.

## Scope

- Included: Warning logic for Function App critical settings, action.yml description update, tests for warnings, `npm run package` to update dist/
- Excluded: No new functional behavior beyond warnings

## Rules & Contracts

- `.chief/_rules/_standard/architecture.md` (no breaking changes to action.yml)
- `.chief/_rules/_standard/security.md`
- `.chief/milestone-1/_contract/resource-type.md` (warning settings list)

## Steps

1. Create a validation utility or add to existing validation that checks Function App critical settings
2. Critical settings: `AzureWebJobsStorage`, `FUNCTIONS_WORKER_RUNTIME`, `FUNCTIONS_EXTENSION_VERSION`, `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`, `WEBSITE_CONTENTSHARE`
3. When `resourceType === 'functionapp'` and any of these settings exist in `appSettings` but are not `slotSetting: true`, emit `core.warning()` with a descriptive message
4. Integrate this check into the pipeline (e.g., in `AppSettingsBase.validate()` or as a separate step)
5. Update `action.yml`: update the `config` input description to mention `resourceType` field
6. Write tests that verify warnings are emitted for the correct settings
7. Run `npm run package` to rebuild `dist/`

## Acceptance Criteria

- [ ] Warnings emitted for each critical setting not marked as slot-sticky when `resourceType === 'functionapp'`
- [ ] No warnings for `resourceType === 'webapp'` or when `resourceType` is omitted
- [ ] Warnings do not block execution (non-throwing)
- [ ] `action.yml` config description documents `resourceType`
- [ ] Tests verify warning behavior
- [ ] `npm run all` passes
- [ ] `dist/` is updated

## Verification

```bash
npm run all
```

## Deliverables

- New or modified: validation/warning logic file
- Modified: `action.yml`
- Modified: `dist/index.js` (via `npm run package`)
- New: tests for warning behavior
