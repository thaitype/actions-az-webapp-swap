import { expect, it, describe, jest, beforeEach } from '@jest/globals';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum, ISwapAppService } from '../src/interfaces';
import {
  functionAppListAppSettings,
  functionAppSetAppSettings,
  functionAppListConnectionStrings,
  functionAppSetConnectionStrings,
  functionAppSwap,
} from '../src/utils/azureUtility';

jest.mock('../src/utils/azureUtility');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = { mockResolvedValue: (val: any) => void; mockClear: () => void };

const mockFunctionAppListAppSettings = functionAppListAppSettings as unknown as MockFn;
const mockFunctionAppSetAppSettings = functionAppSetAppSettings as unknown as MockFn;
const mockFunctionAppListConnectionStrings = functionAppListConnectionStrings as unknown as MockFn;
const mockFunctionAppSetConnectionStrings = functionAppSetConnectionStrings as unknown as MockFn;
const mockFunctionAppSwap = functionAppSwap as unknown as MockFn;

const functionAppService: ISwapAppService = {
  name: 'my-func-app',
  resourceGroup: 'my-rg',
  slot: 'staging',
  targetSlot: 'production',
  subscriptionId: 'sub-func-123',
  resourceType: 'functionapp',
  defaultSensitive: DefaultSensitiveEnum.false,
  defaultSlotSetting: DefaultSlotSettingEnum.false,
  appSettings: [],
  connectionStrings: [],
};

describe('AppSettings uses FunctionAppStrategy for resourceType=functionapp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list() delegates to functionAppListAppSettings for both slots', async () => {
    const mockSettings = [{ name: 'FUNC_KEY', value: 'func-val', slotSetting: false }];
    mockFunctionAppListAppSettings.mockResolvedValue(mockSettings);

    const AppSettings = (await import('../src/core/AppSettings')).default;
    const instance = new AppSettings(functionAppService);
    await instance.list();

    expect(functionAppListAppSettings).toHaveBeenCalledTimes(2);
    expect(functionAppListAppSettings).toHaveBeenCalledWith('my-func-app', 'my-rg', {
      subscriptionId: 'sub-func-123',
      slot: 'staging',
    });
    expect(functionAppListAppSettings).toHaveBeenCalledWith('my-func-app', 'my-rg', {
      subscriptionId: 'sub-func-123',
      slot: 'production',
    });
  });
});

describe('ConnectionStrings uses FunctionAppStrategy for resourceType=functionapp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('list() delegates to functionAppListConnectionStrings for both slots', async () => {
    const mockConnStrings = [{ name: 'FUNC_CONN', value: 'Server=func;', slotSetting: true }];
    mockFunctionAppListConnectionStrings.mockResolvedValue(mockConnStrings);

    const ConnectionStrings = (await import('../src/core/ConnectionStrings')).default;
    const instance = new ConnectionStrings(functionAppService);
    await instance.list();

    expect(functionAppListConnectionStrings).toHaveBeenCalledTimes(2);
    expect(functionAppListConnectionStrings).toHaveBeenCalledWith('my-func-app', 'my-rg', {
      subscriptionId: 'sub-func-123',
      slot: 'staging',
    });
    expect(functionAppListConnectionStrings).toHaveBeenCalledWith('my-func-app', 'my-rg', {
      subscriptionId: 'sub-func-123',
      slot: 'production',
    });
  });

  it('setWebApp() delegates to functionAppSetConnectionStrings', async () => {
    mockFunctionAppSetConnectionStrings.mockResolvedValue(undefined);

    const ConnectionStrings = (await import('../src/core/ConnectionStrings')).default;
    const instance = new ConnectionStrings(functionAppService);
    const appSettings = [{ name: 'FUNC_CONN', value: 'Server=func;', slotSetting: false }];
    await instance.setWebApp(appSettings, 'staging');

    expect(functionAppSetConnectionStrings).toHaveBeenCalledWith('my-func-app', 'my-rg', appSettings, {
      subscriptionId: 'sub-func-123',
      slot: 'staging',
    });
  });
});

describe('SwapSlots uses FunctionAppStrategy for resourceType=functionapp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('execute() delegates to functionAppSwap', async () => {
    const mockOutput = { stdout: '', stderr: '' } as unknown as import('promisify-child-process').Output;
    mockFunctionAppSwap.mockResolvedValue(mockOutput);

    const { SwapSlots } = await import('../src/commands/SwapSlots');
    const instance = new SwapSlots(functionAppService);
    await instance.execute();

    expect(functionAppSwap).toHaveBeenCalledWith('my-func-app', 'my-rg', 'staging', 'production', {
      subscriptionId: 'sub-func-123',
    });
  });
});
