import { expect, it, describe, jest, beforeEach } from '@jest/globals';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum, ISwapAppService } from '../src/interfaces';
import {
  AzureResourceStrategyFactory,
  FunctionAppStrategy,
  IAzureResourceStrategy,
  WebAppStrategy,
} from '../src/core/AzureResourceStrategy';
import {
  webAppListAppSettings,
  webAppSetAppSettings,
  webAppListConnectionStrings,
  webAppSetConnectionStrings,
  webAppSwap,
  functionAppListAppSettings,
  functionAppSetAppSettings,
  functionAppListConnectionStrings,
  functionAppSetConnectionStrings,
  functionAppSwap,
} from '../src/utils/azureUtility';

jest.mock('../src/utils/azureUtility');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = { mockResolvedValue: (val: any) => void; mockClear: () => void };

const mockWebAppListAppSettings = webAppListAppSettings as unknown as MockFn;
const mockWebAppSetAppSettings = webAppSetAppSettings as unknown as MockFn;
const mockWebAppListConnectionStrings = webAppListConnectionStrings as unknown as MockFn;
const mockWebAppSetConnectionStrings = webAppSetConnectionStrings as unknown as MockFn;
const mockWebAppSwap = webAppSwap as unknown as MockFn;
const mockFunctionAppListAppSettings = functionAppListAppSettings as unknown as MockFn;
const mockFunctionAppSetAppSettings = functionAppSetAppSettings as unknown as MockFn;
const mockFunctionAppListConnectionStrings = functionAppListConnectionStrings as unknown as MockFn;
const mockFunctionAppSetConnectionStrings = functionAppSetConnectionStrings as unknown as MockFn;
const mockFunctionAppSwap = functionAppSwap as unknown as MockFn;

const baseSwapAppService: ISwapAppService = {
  name: 'test-app',
  resourceGroup: 'test-rg',
  slot: 'staging',
  targetSlot: 'production',
  defaultSensitive: DefaultSensitiveEnum.false,
  defaultSlotSetting: DefaultSlotSettingEnum.false,
  appSettings: [],
  connectionStrings: [],
};

describe('AzureResourceStrategyFactory', () => {
  it('returns WebAppStrategy when resourceType is undefined', () => {
    const strategy = AzureResourceStrategyFactory.create({ ...baseSwapAppService });
    expect(strategy).toBeInstanceOf(WebAppStrategy);
  });

  it('returns WebAppStrategy when resourceType is webapp', () => {
    const strategy = AzureResourceStrategyFactory.create({ ...baseSwapAppService, resourceType: 'webapp' });
    expect(strategy).toBeInstanceOf(WebAppStrategy);
  });

  it('returns FunctionAppStrategy when resourceType is functionapp', () => {
    const strategy = AzureResourceStrategyFactory.create({ ...baseSwapAppService, resourceType: 'functionapp' });
    expect(strategy).toBeInstanceOf(FunctionAppStrategy);
  });
});

describe('WebAppStrategy', () => {
  let strategy: IAzureResourceStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new WebAppStrategy();
  });

  it('listAppSettings delegates to webAppListAppSettings', async () => {
    const mockResult = [{ name: 'KEY', value: 'VAL', slotSetting: false }];
    mockWebAppListAppSettings.mockResolvedValue(mockResult);

    const result = await strategy.listAppSettings('app', 'rg', { slot: 'staging' });

    expect(webAppListAppSettings).toHaveBeenCalledWith('app', 'rg', { slot: 'staging' });
    expect(result).toBe(mockResult);
  });

  it('setAppSettings delegates to webAppSetAppSettings', async () => {
    const mockOutput = { stdout: '', stderr: '' } as unknown as import('promisify-child-process').Output;
    mockWebAppSetAppSettings.mockResolvedValue(mockOutput);

    const result = await strategy.setAppSettings('app', 'rg', '/tmp/settings.json', { slot: 'staging' });

    expect(webAppSetAppSettings).toHaveBeenCalledWith('app', 'rg', '/tmp/settings.json', { slot: 'staging' });
    expect(result).toBe(mockOutput);
  });

  it('listConnectionStrings delegates to webAppListConnectionStrings', async () => {
    const mockResult = [{ name: 'CONN', value: 'Server=...', slotSetting: true }];
    mockWebAppListConnectionStrings.mockResolvedValue(mockResult);

    const result = await strategy.listConnectionStrings('app', 'rg', { slot: 'staging' });

    expect(webAppListConnectionStrings).toHaveBeenCalledWith('app', 'rg', { slot: 'staging' });
    expect(result).toBe(mockResult);
  });

  it('setConnectionStrings delegates to webAppSetConnectionStrings', async () => {
    mockWebAppSetConnectionStrings.mockResolvedValue(undefined);
    const appSettings = [{ name: 'CONN', value: 'Server=...', slotSetting: false }];

    await strategy.setConnectionStrings('app', 'rg', appSettings, { slot: 'staging' });

    expect(webAppSetConnectionStrings).toHaveBeenCalledWith('app', 'rg', appSettings, { slot: 'staging' });
  });

  it('swap delegates to webAppSwap', async () => {
    const mockOutput = { stdout: '', stderr: '' } as unknown as import('promisify-child-process').Output;
    mockWebAppSwap.mockResolvedValue(mockOutput);

    const result = await strategy.swap('app', 'rg', 'staging', 'production', { subscriptionId: 'sub-123' });

    expect(webAppSwap).toHaveBeenCalledWith('app', 'rg', 'staging', 'production', { subscriptionId: 'sub-123' });
    expect(result).toBe(mockOutput);
  });
});

describe('FunctionAppStrategy', () => {
  let strategy: IAzureResourceStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new FunctionAppStrategy();
  });

  it('listAppSettings delegates to functionAppListAppSettings', async () => {
    const mockResult = [{ name: 'KEY', value: 'VAL', slotSetting: false }];
    mockFunctionAppListAppSettings.mockResolvedValue(mockResult);

    const result = await strategy.listAppSettings('func', 'rg', { slot: 'staging' });

    expect(functionAppListAppSettings).toHaveBeenCalledWith('func', 'rg', { slot: 'staging' });
    expect(result).toBe(mockResult);
  });

  it('setAppSettings delegates to functionAppSetAppSettings', async () => {
    const mockOutput = { stdout: '', stderr: '' } as unknown as import('promisify-child-process').Output;
    mockFunctionAppSetAppSettings.mockResolvedValue(mockOutput);

    const result = await strategy.setAppSettings('func', 'rg', '/tmp/settings.json', { slot: 'staging' });

    expect(functionAppSetAppSettings).toHaveBeenCalledWith('func', 'rg', '/tmp/settings.json', { slot: 'staging' });
    expect(result).toBe(mockOutput);
  });

  it('listConnectionStrings delegates to functionAppListConnectionStrings', async () => {
    const mockResult = [{ name: 'CONN', value: 'Server=...', slotSetting: true }];
    mockFunctionAppListConnectionStrings.mockResolvedValue(mockResult);

    const result = await strategy.listConnectionStrings('func', 'rg', { slot: 'staging' });

    expect(functionAppListConnectionStrings).toHaveBeenCalledWith('func', 'rg', { slot: 'staging' });
    expect(result).toBe(mockResult);
  });

  it('setConnectionStrings delegates to functionAppSetConnectionStrings', async () => {
    mockFunctionAppSetConnectionStrings.mockResolvedValue(undefined);
    const appSettings = [{ name: 'CONN', value: 'Server=...', slotSetting: false }];

    await strategy.setConnectionStrings('func', 'rg', appSettings, { slot: 'staging' });

    expect(functionAppSetConnectionStrings).toHaveBeenCalledWith('func', 'rg', appSettings, { slot: 'staging' });
  });

  it('swap delegates to functionAppSwap', async () => {
    const mockOutput = { stdout: '', stderr: '' } as unknown as import('promisify-child-process').Output;
    mockFunctionAppSwap.mockResolvedValue(mockOutput);

    const result = await strategy.swap('func', 'rg', 'staging', 'production', { subscriptionId: 'sub-456' });

    expect(functionAppSwap).toHaveBeenCalledWith('func', 'rg', 'staging', 'production', { subscriptionId: 'sub-456' });
    expect(result).toBe(mockOutput);
  });
});
