## Sensitive File Policy

This repository contains deployment helpers and wallet tooling, so local files
need a stricter handling policy than ordinary frontend assets.

### Never commit

- `.env` files with real values
- generated wallet exports such as `wallets.json`
- mnemonics, seed phrases, and private key dumps
- ad hoc local JSON snapshots like `tools/wallet-principals.json`
- Python cache folders such as `tools/__pycache__/`

### Allowed placeholders

- `.env.example` with obvious placeholder values
- public wallet addresses when they are needed for documentation
- sample metadata that is intentionally part of the product

### Before opening a PR

1. Run `npm run audit:sensitive`.
2. Confirm `git status --short` does not include local wallet exports.
3. Sanity check `.env.example` for placeholders only.

### If a secret is committed by mistake

1. Revoke or rotate it immediately.
2. Remove it from the branch history before merging.
3. Notify maintainers through the security report flow.
