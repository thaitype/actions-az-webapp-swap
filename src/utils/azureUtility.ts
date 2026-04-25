import { executeProcess, parseBufferToString } from './executeProcess';
import { IAppSetting } from '../interfaces';
import { stripIndent } from 'common-tags';
import { Output } from 'promisify-child-process';

export type AzureCommandOption = {
  subscriptionId?: string;
  slot?: string;
};

export function buildAzCommandOptions(options: AzureCommandOption) {
  const azSubscriptionCommand = options.subscriptionId ? `--subscription ${options.subscriptionId}` : '';
  const azSlotCommand = options.slot !== 'production' && options.slot !== undefined ? `--slot ${options.slot}` : '';
  return { azSubscriptionCommand, azSlotCommand };
}

export const azureCommands = {
  webAppListAppSettings: (name: string, resourceGroup: string, options: AzureCommandOption) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az webapp config appsettings list \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --resource-group ${resourceGroup}
  `;
  },

  webAppListConnectionStrings: (name: string, resourceGroup: string, options: AzureCommandOption) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az webapp config connection-string list \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --resource-group ${resourceGroup}
  `;
  },

  webAppSetConnectionString: (
    name: string,
    resourceGroup: string,
    appSetting: IAppSetting,
    options: AzureCommandOption
  ) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    /**
     * Note: Due to Azure CLI version 2.35.0,
     * If using `--settings` in the code, no matter slotSettings in Azure is True or False,
     * the slotSettings will not change to be `false`
     *
     * In Addition, if using `--slot-settings`, it can override config slotSettings in Azure to be `true`
     *
     * Ref: https://docs.microsoft.com/en-us/cli/azure/webapp/config/connection-string?view=azure-cli-latest#az-webapp-config-connection-string-set
     */
    const slotSettingCommand = appSetting.slotSetting === true ? '--slot-settings' : '--settings';
    const key = appSetting.name.replaceAll('"', '\\"');
    if (appSetting.value === null) throw new Error('Something wrong with implementation, value should not be null');
    const value = appSetting.value.replaceAll('"', '\\"');
    return stripIndent`
      az webapp config connection-string set \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --connection-string-type ${appSetting.type} \\
          --resource-group ${resourceGroup} \\
          ${slotSettingCommand} "${key}"="${value}"
  `;
  },

  webAppSetAppSettingsByFile: (
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az webapp config appsettings set \\
        --name ${name} \\
        --resource-group ${resourceGroup} \\
        ${azSlotCommand} \\
        ${azSubscriptionCommand} \\
        --settings @${appSettingPath}
    `;
  },

  webAppDeploySlotSwap: (
    name: string,
    resourceGroup: string,
    slot: string,
    targetSlot: string,
    options: Omit<AzureCommandOption, 'slot'>
  ) => {
    const { azSubscriptionCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az webapp deployment slot swap \\
        --name ${name} \\
        --resource-group ${resourceGroup} \\
        --slot ${slot} \\
        ${azSubscriptionCommand} \\
        --target-slot ${targetSlot}
    `;
  },

  functionAppListAppSettings: (name: string, resourceGroup: string, options: AzureCommandOption) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az functionapp config appsettings list \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --resource-group ${resourceGroup}
  `;
  },

  functionAppListConnectionStrings: (name: string, resourceGroup: string, options: AzureCommandOption) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az functionapp config connection-string list \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --resource-group ${resourceGroup}
  `;
  },

  functionAppSetConnectionString: (
    name: string,
    resourceGroup: string,
    appSetting: IAppSetting,
    options: AzureCommandOption
  ) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    const slotSettingCommand = appSetting.slotSetting === true ? '--slot-settings' : '--settings';
    const key = appSetting.name.replaceAll('"', '\\"');
    if (appSetting.value === null) throw new Error('Something wrong with implementation, value should not be null');
    const value = appSetting.value.replaceAll('"', '\\"');
    return stripIndent`
      az functionapp config connection-string set \\
          --name ${name} \\
          ${azSlotCommand} \\
          ${azSubscriptionCommand} \\
          --connection-string-type ${appSetting.type} \\
          --resource-group ${resourceGroup} \\
          ${slotSettingCommand} "${key}"="${value}"
  `;
  },

  functionAppSetAppSettingsByFile: (
    name: string,
    resourceGroup: string,
    appSettingPath: string,
    options: AzureCommandOption
  ) => {
    const { azSubscriptionCommand, azSlotCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az functionapp config appsettings set \\
        --name ${name} \\
        --resource-group ${resourceGroup} \\
        ${azSlotCommand} \\
        ${azSubscriptionCommand} \\
        --settings @${appSettingPath}
    `;
  },

  functionAppDeploySlotSwap: (
    name: string,
    resourceGroup: string,
    slot: string,
    targetSlot: string,
    options: Omit<AzureCommandOption, 'slot'>
  ) => {
    const { azSubscriptionCommand } = buildAzCommandOptions(options);
    return stripIndent`
      az functionapp deployment slot swap \\
        --name ${name} \\
        --resource-group ${resourceGroup} \\
        --slot ${slot} \\
        ${azSubscriptionCommand} \\
        --target-slot ${targetSlot}
    `;
  },
};

export async function webAppListConnectionStrings(
  name: string,
  resourceGroup: string,
  options: AzureCommandOption
): Promise<IAppSetting[]> {
  const result = await executeProcess(azureCommands.webAppListConnectionStrings(name, resourceGroup, options));
  return JSON.parse(parseBufferToString(result.stdout));
}

export async function webAppSetConnectionStrings(
  name: string,
  resourceGroup: string,
  appSettings: IAppSetting[],
  options: AzureCommandOption
) {
  /**
   * Because Azure CLI cannot use set JSON file with connection string
   * https://docs.microsoft.com/en-us/cli/azure/webapp/config/connection-string?view=azure-cli-latest#az-webapp-config-connection-string-set
   * This function require to set connection string individually
   */
  const workers: Promise<Output>[] = [];
  for (const appSetting of appSettings) {
    workers.push(executeProcess(azureCommands.webAppSetConnectionString(name, resourceGroup, appSetting, options)));
  }
  await Promise.all(workers);
}

export async function webAppListAppSettings(
  name: string,
  resourceGroup: string,
  options: AzureCommandOption
): Promise<IAppSetting[]> {
  const result = await executeProcess(azureCommands.webAppListAppSettings(name, resourceGroup, options));
  return JSON.parse(parseBufferToString(result.stdout));
}

export async function webAppSetAppSettings(
  name: string,
  resourceGroup: string,
  appSettingPath: string,
  options: AzureCommandOption
): Promise<Output> {
  return await executeProcess(azureCommands.webAppSetAppSettingsByFile(name, resourceGroup, appSettingPath, options));
}

export async function webAppSwap(
  name: string,
  resourceGroup: string,
  slot: string,
  targetSlot: string,
  options: Omit<AzureCommandOption, 'slot'>
): Promise<Output> {
  return await executeProcess(azureCommands.webAppDeploySlotSwap(name, resourceGroup, slot, targetSlot, options));
}

export async function functionAppListConnectionStrings(
  name: string,
  resourceGroup: string,
  options: AzureCommandOption
): Promise<IAppSetting[]> {
  const result = await executeProcess(azureCommands.functionAppListConnectionStrings(name, resourceGroup, options));
  return JSON.parse(parseBufferToString(result.stdout));
}

export async function functionAppSetConnectionStrings(
  name: string,
  resourceGroup: string,
  appSettings: IAppSetting[],
  options: AzureCommandOption
) {
  const workers: Promise<Output>[] = [];
  for (const appSetting of appSettings) {
    workers.push(
      executeProcess(azureCommands.functionAppSetConnectionString(name, resourceGroup, appSetting, options))
    );
  }
  await Promise.all(workers);
}

export async function functionAppListAppSettings(
  name: string,
  resourceGroup: string,
  options: AzureCommandOption
): Promise<IAppSetting[]> {
  const result = await executeProcess(azureCommands.functionAppListAppSettings(name, resourceGroup, options));
  return JSON.parse(parseBufferToString(result.stdout));
}

export async function functionAppSetAppSettings(
  name: string,
  resourceGroup: string,
  appSettingPath: string,
  options: AzureCommandOption
): Promise<Output> {
  return await executeProcess(
    azureCommands.functionAppSetAppSettingsByFile(name, resourceGroup, appSettingPath, options)
  );
}

export async function functionAppSwap(
  name: string,
  resourceGroup: string,
  slot: string,
  targetSlot: string,
  options: Omit<AzureCommandOption, 'slot'>
): Promise<Output> {
  return await executeProcess(azureCommands.functionAppDeploySlotSwap(name, resourceGroup, slot, targetSlot, options));
}
