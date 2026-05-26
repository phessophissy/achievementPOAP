# Security Policy

## Reporting a Vulnerability

Use the GitHub security issue template for private, security-related reports.
Include:

- the affected area of the codebase
- reproduction steps
- whether any secret, mnemonic, or wallet export was exposed
- whether the issue is already present on a public branch

## Sensitive Data Handling

- Never commit real mnemonics, private keys, or `.env` files.
- Treat generated wallet exports as local-only artifacts.
- Rotate leaked credentials before opening a fix PR.

## Release Checklist

1. Run `npm run audit:sensitive`.
2. Check the diff for `.env`, wallet JSON, and local snapshots.
3. Confirm documentation uses placeholders instead of real secrets.
