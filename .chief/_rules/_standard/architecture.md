# Architecture Rules

## Project Type

This is a GitHub Actions action (JavaScript/Node.js type). It runs inside GitHub Actions runners, not as a standalone application.

## Entry Point

- `src/main.ts` is the entry point
- It reads GitHub Actions inputs and dispatches to command classes based on the `mode` input
- The action is bundled with `@vercel/ncc` into `dist/index.js` for distribution

## Command Pattern

Each mode maps to a command class in `src/commands/`:

| Mode               | Command Class    |
|--------------------|------------------|
| `get-deploy-slots` | `GetDeploySlots` |
| `create-swap-plan` | `CreateSwapPlan` |
| `set-deploy-slots` | `SetDeploySlots` |
| `swap-slots`       | `SwapSlots`      |
| `clean`            | `Clean`          |

Each command class:
- Receives configuration via constructor
- Has an `execute()` method as the main entry point
- Uses Azure SDK or GitHub utilities internally

## Core Domain

- `SwapAppSettings` -- main logic for slot swap settings management
- `AppSettingsBase` / `AppSettings` / `ConnectionStrings` -- app settings abstraction
- `AppSettingsMasking` / `AppSettingsHiding` -- sensitive value handling

## Bundling

- `npm run package` runs `ncc build` to produce `dist/index.js`
- The `dist/` directory is checked into git (required for GitHub Actions)
- Always run `npm run package` before committing changes that affect runtime code

## Key Constraints

- Do not introduce breaking changes to `action.yml` inputs without a major version bump
- The `dist/` directory must always be up to date with source changes
- Azure CLI commands may be executed via `promisify-child-process`
