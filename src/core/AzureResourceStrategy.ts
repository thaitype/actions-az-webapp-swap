import { Output } from 'promisify-child-process';
import { IAppSetting } from '../interfaces';
import { ISwapAppService } from '../interfaces/ISwapAppService';
import {
  AzureCommandOption,
  functionAppListAppSettings,
  functionAppListConnectionStrings,
  functionAppSetAppSettings,
  functionAppSetConnectionStrings,
  functionAppSwap,
  webAppListAppSettings,
  webAppListConnectionStrings,
  webAppSetAppSettings,
  webAppSetConnectionStrings,
  webAppSwap,
} from '../utils/azureUtility';

export interface IAzureResourceStrategy {
  listAppSettings(name: string, resourceGroup: string, options: AzureCommandOption): Promise<IAppSetting[]>;

  setAppSettings(
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ): Promise<Output>;

  listConnectionStrings(name: string, resourceGroup: string, options: AzureCommandOption): Promise<IAppSetting[]>;

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

export class WebAppStrategy implements IAzureResourceStrategy {
  async listAppSettings(name: string, resourceGroup: string, options: AzureCommandOption): Promise<IAppSetting[]> {
    return webAppListAppSettings(name, resourceGroup, options);
  }

  async setAppSettings(
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ): Promise<Output> {
    return webAppSetAppSettings(name, resourceGroup, appSettingPath, options);
  }

  async listConnectionStrings(
    name: string,
    resourceGroup: string,
    options: AzureCommandOption
  ): Promise<IAppSetting[]> {
    return webAppListConnectionStrings(name, resourceGroup, options);
  }

  async setConnectionStrings(
    name: string,
    resourceGroup: string,
    appSettings: IAppSetting[],
    options: AzureCommandOption
  ): Promise<void> {
    return webAppSetConnectionStrings(name, resourceGroup, appSettings, options);
  }

  async swap(
    name: string,
    resourceGroup: string,
    slot: string,
    targetSlot: string,
    options: Omit<AzureCommandOption, 'slot'>
  ): Promise<Output> {
    return webAppSwap(name, resourceGroup, slot, targetSlot, options);
  }
}

export class FunctionAppStrategy implements IAzureResourceStrategy {
  async listAppSettings(name: string, resourceGroup: string, options: AzureCommandOption): Promise<IAppSetting[]> {
    return functionAppListAppSettings(name, resourceGroup, options);
  }

  async setAppSettings(
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ): Promise<Output> {
    return functionAppSetAppSettings(name, resourceGroup, appSettingPath, options);
  }

  async listConnectionStrings(
    name: string,
    resourceGroup: string,
    options: AzureCommandOption
  ): Promise<IAppSetting[]> {
    return functionAppListConnectionStrings(name, resourceGroup, options);
  }

  async setConnectionStrings(
    name: string,
    resourceGroup: string,
    appSettings: IAppSetting[],
    options: AzureCommandOption
  ): Promise<void> {
    return functionAppSetConnectionStrings(name, resourceGroup, appSettings, options);
  }

  async swap(
    name: string,
    resourceGroup: string,
    slot: string,
    targetSlot: string,
    options: Omit<AzureCommandOption, 'slot'>
  ): Promise<Output> {
    return functionAppSwap(name, resourceGroup, slot, targetSlot, options);
  }
}

export class AzureResourceStrategyFactory {
  static create(swapAppService: ISwapAppService): IAzureResourceStrategy {
    if (swapAppService.resourceType === 'functionapp') {
      return new FunctionAppStrategy();
    }
    return new WebAppStrategy();
  }
}
