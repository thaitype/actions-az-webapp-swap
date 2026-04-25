# Milestone 1: Azure Function App Slot Swap Support

## Objective

Add support for Azure Function App deployment slot swaps alongside the existing Azure Web App support. Users declare `resourceType: 'functionapp'` in their config JSON to use Function App CLI commands instead of Web App commands.

## Success Criteria

1. Config JSON accepts optional `resourceType` field (`'webapp'` | `'functionapp'`), defaulting to `'webapp'`
2. When `resourceType: 'functionapp'`, all Azure CLI calls use `az functionapp` instead of `az webapp`
3. Strategy pattern cleanly separates resource-type-specific behavior
4. Commands (`get-deploy-slots`, `set-deploy-slots`, `swap-slots`) use strategy -- no if/else branching
5. `create-swap-plan` and `clean` commands are unchanged
6. Function App critical settings (`AzureWebJobsStorage`, `FUNCTIONS_WORKER_RUNTIME`, `FUNCTIONS_EXTENSION_VERSION`, `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`, `WEBSITE_CONTENTSHARE`) emit warnings when not marked `slotSetting: true`
7. Full backwards compatibility -- omitting `resourceType` behaves identically to current code
8. Full test coverage for all new code
9. All verification passes: `npm run all`

## Constraints

- No new npm dependencies
- No breaking changes to `action.yml` inputs
- No weakening of TypeScript strict mode
- `dist/` must be updated via `npm run package` after all source changes

## Dependencies

None. This is the first milestone.
