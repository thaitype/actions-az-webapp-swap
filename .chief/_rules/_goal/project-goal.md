# Project Goal

## Purpose

Provide a GitHub Actions action that safely swaps Azure App Service deployment slots.

## Core Capabilities

1. **Get Deploy Slots** -- Retrieve current app settings and connection strings from Azure App Service slots
2. **Create Swap Plan** -- Generate a swap plan by comparing source and target slot configurations
3. **Set Deploy Slots** -- Apply app settings to deployment slots before swapping
4. **Swap Slots** -- Execute the actual slot swap operation on Azure App Service
5. **Clean** -- Clean up temporary artifacts after swap operations

## Quality Goals

- Reliable slot swapping with proper validation
- Clear reporting of app setting differences between slots
- Safe handling of sensitive configuration values
- Support for slot-sticky (slotSetting) configurations
