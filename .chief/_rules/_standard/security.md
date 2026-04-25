# Security Rules

## Sensitive Values

- Never log or expose Azure subscription IDs, tokens, or app setting values in plain text
- Use `@actions/core.setSecret()` to mask sensitive values in logs
- Respect `sensitive` and `hideValue` flags on app settings

## Secrets and Credentials

- Never commit `.env`, `secret.json`, or credential files
- GitHub tokens must only be received via `@actions/core.getInput('token')`
- Azure authentication is handled via `@azure/identity` -- do not implement custom auth

## Git Safety

- Do not commit `node_modules/`
- Do not commit `.env` or `.env.test`
- Verify `.gitignore` covers sensitive paths before adding new secret-containing files
