# Strategy Interface Contract

## IAzureResourceStrategy

The strategy interface abstracts resource-type-specific Azure CLI operations.

```ts
interface IAzureResourceStrategy {
  listAppSettings(
    name: string,
    resourceGroup: string,
    options: AzureCommandOption
  ): Promise<IAppSetting[]>;

  setAppSettings(
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ): Promise<Output>;

  listConnectionStrings(
    name: string,
    resourceGroup: string,
    options: AzureCommandOption
  ): Promise<IAppSetting[]>;

  setConnectionStrings(
    name: string,
    resourceGroup: string,
    appSettings: IAppSetting[],
    options: AzureCommandOption
  ): Promise<void>;

  swap(
    name: string,
    resourceGroup: string,
    slot: string,
    targetSlot: string,
    options: Omit<AzureCommandOption, 'slot'>
  ): Promise<Output>;
}
```

## Implementations

- `WebAppStrategy` -- delegates to existing `webApp*` utility functions
- `FunctionAppStrategy` -- delegates to new `functionApp*` utility functions

## Factory

```ts
class AzureResourceStrategyFactory {
  static create(swapAppService: ISwapAppService): IAzureResourceStrategy;
}
```

Returns `WebAppStrategy` when `resourceType` is `'webapp'` or undefined.
Returns `FunctionAppStrategy` when `resourceType` is `'functionapp'`.

## File Location

`src/core/AzureResourceStrategy.ts`
