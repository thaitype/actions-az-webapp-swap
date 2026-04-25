import * as core from '@actions/core';
import { ISwapAppService } from '../interfaces';
import { AzureResourceStrategyFactory } from '../core/AzureResourceStrategy';

export class SwapSlots {
  constructor(private swapAppService: ISwapAppService) {}

  public async execute() {
    core.debug(`Using swap-slots mode`);
    const { name, resourceGroup, slot, targetSlot, subscriptionId } = this.swapAppService;
    const strategy = AzureResourceStrategyFactory.create(this.swapAppService);
    await strategy.swap(name, resourceGroup, slot, targetSlot, { subscriptionId });
  }
}
