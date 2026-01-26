## Description

Brief description of changes and motivation.

## Related Issue

Fixes #(issue number)
<!-- or -->
Relates to #(issue number)

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring (no functional changes)
- [ ] 🧪 Tests (adding or updating tests)
- [ ] 🎨 Style/UI (visual changes only)

## Changes Made

- Change 1
- Change 2
- Change 3

## Component(s) Modified

- [ ] Smart Contract (`contracts/achievement-poap.clar`)
- [ ] Contract Tests (`tests/`)
- [ ] Frontend Components
- [ ] Frontend Services/Hooks
- [ ] Documentation
- [ ] Configuration

## Testing

### For Contract Changes:
- [ ] Ran `clarinet test` - all tests pass
- [ ] Added new tests for changes
- [ ] Tested on devnet

### For Frontend Changes:
- [ ] Tested locally with `npm run dev`
- [ ] Tested wallet connection flow
- [ ] Tested on mobile viewport
- [ ] No console errors
- [ ] Build succeeds: `npm run build`

## Security Checklist

### For Contract Changes:
- [ ] Authorization checks in place for privileged functions
- [ ] All user inputs validated
- [ ] No reentrancy vulnerabilities
- [ ] `tx-sender` captured before `as-contract` blocks
- [ ] Error handling is comprehensive

### For Frontend Changes:
- [ ] No sensitive data exposed in client code
- [ ] Post-conditions used for STX transfers
- [ ] User inputs sanitized before contract calls

## Screenshots

(For UI changes - before and after if applicable)

### Before:


### After:


## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated documentation if needed
- [ ] My changes generate no new warnings
- [ ] New and existing tests pass locally
- [ ] Any dependent changes have been merged

## Additional Notes

(Any other information reviewers should know)
