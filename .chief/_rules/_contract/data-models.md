# Data Models Contract

## ISwapAppService

Primary configuration model for a swap operation.

```ts
interface ISwapAppService {
  name: string;              // Azure App Service name
  resourceGroup: string;     // Azure resource group
  subscriptionId?: string;   // Azure subscription ID (optional)
  slot: string;              // Source slot (e.g., "production")
  targetSlot: string;        // Target slot (e.g., "staging")
  defaultSlotSetting: DefaultSlotSettingEnum;
  defaultSensitive: DefaultSensitiveEnum;
  defaultHideValue?: boolean;
  appSettings: ISwapAppSetting[];
  connectionStrings: ISwapAppSetting[];
}
```

## ISwapAppSetting

Per-setting configuration within a swap.

```ts
interface ISwapAppSetting {
  name: string;
  sensitive: boolean;
  slotSetting: boolean;
  baseSlotSetting?: boolean;  // Previous slot setting value before merge
  slots?: string[];           // Slot locations where the setting applies
  value?: string;
  hideValue?: boolean;
}
```

## IAppSetting

Raw app setting from Azure.

```ts
interface IAppSetting {
  name: string;
  slotSetting: boolean;
  value: string | null;
  type?: connectionStringType;  // Only for connection strings
}
```

## Enums

```ts
enum DefaultSensitiveEnum { true = 'true', false = 'false', required = 'required' }
enum DefaultSlotSettingEnum { true = 'true', false = 'false', required = 'required', inherit = 'inherit' }
type SlotType = 'source' | 'target';
```

## Rules

- Do not rename or remove existing interface fields without a major version bump
- New optional fields may be added
- `connectionStringType` values match Azure CLI accepted values
