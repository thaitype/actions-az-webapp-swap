import { expect, test } from '@jest/globals';
import InputValidation from '../src/validation/InputValidation';
import { DefaultSensitiveEnum, DefaultSlotSettingEnum, ISwapAppService, ResourceType } from '../src/interfaces';

const swapAppService: Partial<ISwapAppService> = {
  name: '',
  resourceGroup: '',
  slot: '',
  targetSlot: '',
  defaultSensitive: DefaultSensitiveEnum.true,
  defaultSlotSetting: DefaultSlotSettingEnum.required,
};

test('InputValidation.validate appSettings is undefined should return appSettings with empty list', () => {
  const actual = InputValidation.validate(swapAppService);

  const expected: Partial<ISwapAppService> = {
    ...swapAppService,
    appSettings: [],
  };

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validate connectionStrings is undefined should return connectionStrings with empty list', () => {
  const actual = InputValidation.validate(swapAppService);

  const expected: Partial<ISwapAppService> = {
    ...swapAppService,
    connectionStrings: [],
  };

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validateArray appSettings is undefined should return appSettings with empty list', () => {
  const actual = InputValidation.validateArray([swapAppService]);

  const expected: Partial<ISwapAppService>[] = [
    {
      ...swapAppService,
      appSettings: [],
    },
  ];

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validateArray connectionStrings is undefined should return connectionStrings with empty list', () => {
  const actual = InputValidation.validateArray([swapAppService]);

  const expected: Partial<ISwapAppService>[] = [
    {
      ...swapAppService,
      connectionStrings: [],
    },
  ];

  expect(actual).toStrictEqual(expected);
});

test('InputValidation.validate resourceType is undefined should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService };
  expect(() => InputValidation.validate(input)).not.toThrow();
});

test('InputValidation.validate resourceType is webapp should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'webapp' as ResourceType };
  expect(() => InputValidation.validate(input)).not.toThrow();
});

test('InputValidation.validate resourceType is functionapp should pass validation', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'functionapp' as ResourceType };
  expect(() => InputValidation.validate(input)).not.toThrow();
});

test('InputValidation.validate resourceType with invalid value should throw', () => {
  const input: Partial<ISwapAppService> = { ...swapAppService, resourceType: 'invalid' as ResourceType };
  expect(() => InputValidation.validate(input)).toThrow();
});
