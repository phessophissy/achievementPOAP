# Contributing to Achievement POAP

Thank you for your interest in contributing to Achievement POAP! This document provides guidelines for contributing to both the smart contract and frontend components.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Smart Contract Development](#smart-contract-development)
- [Frontend Development](#frontend-development)
- [Pull Request Process](#pull-request-process)
- [Security Guidelines](#security-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the issue, not the person

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/achievementPOAP.git
   cd achievementPOAP
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/phessophissy/achievementPOAP.git
   ```

## Project Structure

```
achievementPOAP/
├── contracts/
│   └── achievement-poap.clar    # Main Clarity smart contract
├── tests/
│   └── achievement-poap.test.ts # Contract tests (Clarinet/Vitest)
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Route pages
│   │   ├── services/            # Contract interaction layer
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # React contexts
│   │   └── config/              # Configuration
│   └── CONTRIBUTING.md          # Frontend-specific guidelines
├── settings/                    # Clarinet settings
├── Clarinet.toml               # Clarinet configuration
└── README.md
```

## Development Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - For Clarity development
- Node.js 18+
- Stacks Wallet (Hiro/Leather or Xverse) for testing

### Smart Contract Setup

```bash
# Install Clarinet
brew install clarinet  # macOS
# See https://github.com/hirosystems/clarinet for other OS

# Run contract tests
clarinet test

# Check contract syntax
clarinet check

# Start local devnet
clarinet devnet start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Smart Contract Development

### Clarity Coding Standards

#### Naming Conventions

- **Constants**: SCREAMING_SNAKE_CASE with descriptive prefixes
  ```clarity
  (define-constant ERR_NOT_AUTHORIZED (err u100))
  (define-constant MINT_FEE u25000)
  ```

- **Functions**: kebab-case with action verbs
  ```clarity
  (define-public (mint-poap (event-id uint)) ...)
  (define-read-only (get-user-tokens (user principal)) ...)
  ```

- **Data Variables**: kebab-case
  ```clarity
  (define-data-var token-id-nonce uint u0)
  ```

#### Error Codes

Use consistent error code ranges:
- `u100-u109`: Authorization errors
- `u110-u119`: Validation errors
- `u120-u129`: State errors

Always define errors as constants:
```clarity
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_ALREADY_MINTED (err u101))
```

#### Documentation

Document all public functions:
```clarity
;; Mint a POAP for a specific event
;; @param event-id: The ID of the event to mint from
;; @returns: (ok token-id) on success, error otherwise
(define-public (mint-poap (event-id uint))
  ...
)
```

#### Security Best Practices

1. **Authorization Checks First**
   ```clarity
   (define-public (admin-function)
     (begin
       (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
       ;; ... rest of function
     )
   )
   ```

2. **Validate All Inputs**
   ```clarity
   (asserts! (> (len metadata-uri) u0) ERR_INVALID_URI)
   (asserts! (> end-block start-block) ERR_INVALID_RANGE)
   ```

3. **Use Proper Principal Handling**
   ```clarity
   ;; CORRECT: Capture tx-sender before as-contract
   (let ((user tx-sender))
     (try! (as-contract (stx-transfer? amount tx-sender user)))
   )
   
   ;; WRONG: tx-sender changes inside as-contract!
   (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
   ```

4. **Limit List Sizes**
   ```clarity
   (define-map user-tokens principal (list 100 uint))
   ```

### Testing Requirements

All contract changes must include tests:

```typescript
// tests/achievement-poap.test.ts
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

describe('New Feature', () => {
  it('should behave correctly', () => {
    const response = simnet.callPublicFn(
      'achievement-poap',
      'function-name',
      [Cl.uint(1)],
      wallet1
    );
    expect(response.result).toBeOk(Cl.uint(1));
  });
});
```

Run tests with:
```bash
clarinet test
```

## Frontend Development

See [frontend/CONTRIBUTING.md](frontend/CONTRIBUTING.md) for detailed frontend guidelines.

### Key Points

- Use functional components with hooks
- Follow the component structure in `src/components/`
- Use the contract service layer for blockchain interactions
- Test with both mainnet and testnet configurations

## Pull Request Process

### Branch Naming

- `fix/description` - Bug fixes
- `feat/description` - New features
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**:
   ```bash
   # Contract tests
   clarinet test
   
   # Frontend (if applicable)
   cd frontend && npm run build
   ```

3. **Check your changes**:
   - Code follows project style
   - Tests pass
   - No console errors
   - Documentation updated if needed

### PR Requirements

- [ ] Clear, descriptive title
- [ ] Reference related issues: `Fixes #123`
- [ ] Description of changes
- [ ] Tests added/updated
- [ ] Documentation updated (if applicable)
- [ ] Security considerations addressed

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(contract): add batch minting function
fix(frontend): resolve wallet connection on mobile
docs(readme): update deployment instructions
```

## Security Guidelines

### Reporting Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

For critical issues that could result in loss of funds:
1. Email the maintainers directly
2. Use GitHub's private vulnerability reporting

### Smart Contract Security Checklist

When modifying contract code:

- [ ] All user inputs validated
- [ ] Authorization checks in place
- [ ] No reentrancy vulnerabilities
- [ ] Token transfers use proper patterns
- [ ] Error handling is comprehensive
- [ ] Edge cases are considered

### Frontend Security Checklist

- [ ] No sensitive data in client-side code
- [ ] Proper validation before contract calls
- [ ] Post-conditions used for transactions
- [ ] Error messages don't leak sensitive info

## Questions?

- Open a [Discussion](https://github.com/phessophissy/achievementPOAP/discussions)
- Check existing issues first
- Be patient - maintainers are volunteers

---

Thank you for contributing to Achievement POAP! 🏆
