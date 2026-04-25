# Coding Standards

## Language & Runtime

- TypeScript (strict mode enabled)
- Node.js 16 (as defined in `action.yml` `runs.using: node16`)
- ES6 target, CommonJS modules

## Formatting

- Prettier is the formatter
- Config: `.prettierrc.json`
  - 2-space indent, no tabs
  - Single quotes
  - Trailing commas: `es5`
  - Semicolons: yes
  - Print width: 120
  - Arrow parens: avoid

Run: `npm run format-check` to verify, `npm run format` to fix.

## File Conventions

- Source files in `src/`
- Test files in `__tests__/` with `.test.ts` extension
- Line endings: LF (Unix-style), enforced via `.editorconfig`
- Charset: UTF-8 for `.js` and `.ts` files

## TypeScript Rules

- `strict: true` -- do not weaken strict mode
- `noImplicitAny: true`
- `esModuleInterop: true`
- Output to `lib/` directory
- Root directory is `src/`
- Tests are excluded from compilation

## Naming Conventions

- Classes: PascalCase (e.g., `SwapAppSettings`, `GetDeploySlots`)
- Interfaces: PascalCase with `I` prefix (e.g., `ISwapAppService`, `IAppSetting`)
- Enums: PascalCase with `Enum` suffix (e.g., `DefaultSensitiveEnum`)
- Type aliases: PascalCase (e.g., `SlotType`, `Mode`)
- Files: PascalCase for classes/modules, camelCase for utilities

## Module Organization

- Commands in `src/commands/` -- each command is a class with an `execute()` method
- Core domain logic in `src/core/`
- Interfaces in `src/interfaces/`
- Utilities in `src/utils/`
- Validation in `src/validation/`

## Dependencies

- Use `@actions/core` for GitHub Actions I/O (inputs, outputs, logging)
- Use `@azure/arm-appservice` and `@azure/identity` for Azure SDK operations
- Use `zod` for runtime validation where needed
- Do not add new dependencies without explicit approval
