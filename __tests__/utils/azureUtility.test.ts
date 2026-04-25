import { expect, it, describe } from '@jest/globals';
import { buildAzCommandOptions, azureCommands } from '../../src/utils/azureUtility';

describe('azureUtility', () => {
  describe('buildAzCommandOptions', () => {
    it('should return empty strings if no options are provided', () => {
      const options = {};
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only subscription command if subscriptionId is provided', () => {
      const options = { subscriptionId: 'test-sub-id' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only slot command if slot is provided and not production', () => {
      const options = { slot: 'staging' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('--slot staging');
    });

    it('should return both subscription and slot commands if both are provided and slot is not production', () => {
      const options = { subscriptionId: 'test-sub-id', slot: 'staging' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('--slot staging');
    });

    it('should return empty slot command if slot is production', () => {
      const options = { slot: 'production' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('');
      expect(result.azSlotCommand).toBe('');
    });

    it('should return only subscription command if subscriptionId is provided and slot is production', () => {
      const options = { subscriptionId: 'test-sub-id', slot: 'production' };
      const result = buildAzCommandOptions(options);
      expect(result.azSubscriptionCommand).toBe('--subscription test-sub-id');
      expect(result.azSlotCommand).toBe('');
    });
  });

  describe('azureCommands.functionAppListAppSettings', () => {
    it('should produce az functionapp config appsettings list command', () => {
      const cmd = azureCommands.functionAppListAppSettings('my-func', 'my-rg', {});
      expect(cmd).toContain('az functionapp config appsettings list');
      expect(cmd).toContain('--name my-func');
      expect(cmd).toContain('--resource-group my-rg');
    });

    it('should include slot when provided', () => {
      const cmd = azureCommands.functionAppListAppSettings('my-func', 'my-rg', { slot: 'staging' });
      expect(cmd).toContain('--slot staging');
    });

    it('should include subscription when provided', () => {
      const cmd = azureCommands.functionAppListAppSettings('my-func', 'my-rg', { subscriptionId: 'sub-123' });
      expect(cmd).toContain('--subscription sub-123');
    });
  });

  describe('azureCommands.functionAppListConnectionStrings', () => {
    it('should produce az functionapp config connection-string list command', () => {
      const cmd = azureCommands.functionAppListConnectionStrings('my-func', 'my-rg', {});
      expect(cmd).toContain('az functionapp config connection-string list');
      expect(cmd).toContain('--name my-func');
      expect(cmd).toContain('--resource-group my-rg');
    });

    it('should include slot when provided', () => {
      const cmd = azureCommands.functionAppListConnectionStrings('my-func', 'my-rg', { slot: 'staging' });
      expect(cmd).toContain('--slot staging');
    });
  });

  describe('azureCommands.functionAppSetConnectionString', () => {
    const appSetting = { name: 'MY_CONN', value: 'Server=tcp:...', type: 'SQLServer' as const, slotSetting: false };

    it('should produce az functionapp config connection-string set command', () => {
      const cmd = azureCommands.functionAppSetConnectionString('my-func', 'my-rg', appSetting, {});
      expect(cmd).toContain('az functionapp config connection-string set');
      expect(cmd).toContain('--name my-func');
      expect(cmd).toContain('--resource-group my-rg');
      expect(cmd).toContain('--connection-string-type SQLServer');
      expect(cmd).toContain('--settings');
    });

    it('should use --slot-settings when slotSetting is true', () => {
      const slotAppSetting = { ...appSetting, slotSetting: true };
      const cmd = azureCommands.functionAppSetConnectionString('my-func', 'my-rg', slotAppSetting, {});
      expect(cmd).toContain('--slot-settings');
    });

    it('should throw when value is null', () => {
      const nullValueSetting = { ...appSetting, value: null };
      expect(() => azureCommands.functionAppSetConnectionString('my-func', 'my-rg', nullValueSetting, {})).toThrow();
    });
  });

  describe('azureCommands.functionAppSetAppSettingsByFile', () => {
    it('should produce az functionapp config appsettings set command', () => {
      const cmd = azureCommands.functionAppSetAppSettingsByFile('my-func', 'my-rg', '/tmp/settings.json', {});
      expect(cmd).toContain('az functionapp config appsettings set');
      expect(cmd).toContain('--name my-func');
      expect(cmd).toContain('--resource-group my-rg');
      expect(cmd).toContain('--settings @/tmp/settings.json');
    });

    it('should include slot when provided', () => {
      const cmd = azureCommands.functionAppSetAppSettingsByFile('my-func', 'my-rg', '/tmp/settings.json', {
        slot: 'staging',
      });
      expect(cmd).toContain('--slot staging');
    });
  });

  describe('azureCommands.functionAppDeploySlotSwap', () => {
    it('should produce az functionapp deployment slot swap command', () => {
      const cmd = azureCommands.functionAppDeploySlotSwap('my-func', 'my-rg', 'staging', 'production', {});
      expect(cmd).toContain('az functionapp deployment slot swap');
      expect(cmd).toContain('--name my-func');
      expect(cmd).toContain('--resource-group my-rg');
      expect(cmd).toContain('--slot staging');
      expect(cmd).toContain('--target-slot production');
    });

    it('should include subscription when provided', () => {
      const cmd = azureCommands.functionAppDeploySlotSwap('my-func', 'my-rg', 'staging', 'production', {
        subscriptionId: 'sub-456',
      });
      expect(cmd).toContain('--subscription sub-456');
    });
  });
});
