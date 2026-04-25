import * as core from '@actions/core';
import { IAppSetting, ISwapAppService, SlotType } from '../interfaces';
import AppSettingsBase, { AppSettingsType, IAppSettingOption } from './AppSettingsBase';
import { AzureResourceStrategyFactory } from './AzureResourceStrategy';

export default class ConnectionStrings extends AppSettingsBase {
  protected source: IAppSetting[] = [];
  protected target: IAppSetting[] = [];

  constructor(swapAppService: ISwapAppService, options?: Partial<IAppSettingOption>) {
    super(swapAppService, AppSettingsType.ConnectionStrings, options);
  }

  /** @override */
  public async list() {
    const resourceLabel =
      this.swapAppService.resourceType === 'functionapp' ? 'Azure Function App' : 'Azure Web App (Azure App Service)';
    core.info(`Listing Connection Strings from ${resourceLabel} ...`);
    const { name, resourceGroup, slot, targetSlot, subscriptionId } = this.swapAppService;
    const strategy = AzureResourceStrategyFactory.create(this.swapAppService);
    [this.source, this.target] = await Promise.all([
      strategy.listConnectionStrings(name, resourceGroup, { subscriptionId, slot }),
      strategy.listConnectionStrings(name, resourceGroup, { subscriptionId, slot: targetSlot }),
    ]);
    return this;
  }

  /** @override */
  public async setWebApp(appSettings: IAppSetting[], slot: string) {
    const { name, resourceGroup, subscriptionId } = this.swapAppService;
    core.info('Start set ConnectionString');
    const strategy = AzureResourceStrategyFactory.create(this.swapAppService);
    await strategy.setConnectionStrings(name, resourceGroup, appSettings, { subscriptionId, slot });
  }
}
