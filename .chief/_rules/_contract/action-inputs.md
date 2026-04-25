# Action Inputs Contract

Defined in `action.yml`:

| Input  | Required | Default        | Description                    |
|--------|----------|----------------|--------------------------------|
| mode   | true     | -              | Operation mode (see Mode type) |
| config | false    | -              | JSON configuration             |
| token  | false    | -              | GitHub personal access token   |
| repo   | false    | -              | GitHub repository              |
| ref    | false    | `appsettings`  | Git ref for app settings       |
| path   | false    | `.`            | Path to place app settings     |

## Mode Values

Defined as `Mode` type in `src/main.ts`:

```ts
type Mode = 'get-deploy-slots' | 'create-swap-plan' | 'set-deploy-slots' | 'swap-slots' | 'clean';
```

## Config Shape

The `config` input accepts JSON matching `ISwapAppService` interface (see `src/interfaces/ISwapAppService.ts`).

## Mode-Input Requirements

| Mode               | config | token | repo | ref | path |
|--------------------|--------|-------|------|-----|------|
| get-deploy-slots   | required | -   | -    | -   | -    |
| create-swap-plan   | -      | required | required | required | required |
| set-deploy-slots   | required | -   | -    | -   | -    |
| swap-slots         | required | -   | -    | -   | -    |
| clean              | -      | required | required | required | -  |
