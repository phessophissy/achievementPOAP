#!/bin/bash
# Rebase each PR branch onto latest main, then merge via gh
set -e

cd /home/thee1/achievementPOAP

git config user.email "dev@achievementpoap.xyz" 2>/dev/null || true
git config user.name "AchievementPOAP Dev" 2>/dev/null || true

echo "Fetching all open PR branches..."
PR_DATA=$(gh pr list --state open --limit 200 --json number,headRefName)
PR_NUMBERS=$(echo "$PR_DATA" | python3 -c "import json,sys; prs=json.load(sys.stdin); [print(p['number'],p['headRefName']) for p in prs]")

TOTAL=$(echo "$PR_NUMBERS" | wc -l)
echo "Found $TOTAL open PRs."
echo ""

MERGED=0
FAILED=0

while IFS=" " read -r PR_NUM BRANCH; do
  [ -z "$PR_NUM" ] && continue
  echo "===== PR #$PR_NUM ($BRANCH) ====="

  # Checkout the branch
  git fetch origin "$BRANCH" 2>/dev/null || { echo "⚠️  Could not fetch $BRANCH, skipping"; FAILED=$((FAILED+1)); continue; }
  git checkout -B "$BRANCH" "origin/$BRANCH"

  # Update main reference
  git fetch origin main

  # Rebase onto main - accept all incoming (ours = branch, theirs = main after rebase)
  if ! git rebase origin/main --strategy-option=theirs 2>&1; then
    echo "Rebase conflict - resolving by accepting all changes..."
    git rebase --abort 2>/dev/null || true

    # Alternative: merge main into branch and take combined result
    git merge origin/main --no-edit -X theirs 2>&1 || {
      echo "⚠️  Could not resolve conflicts for PR #$PR_NUM, skipping"
      git merge --abort 2>/dev/null || true
      git checkout main
      FAILED=$((FAILED+1))
      continue
    }
  fi

  # Force push the rebased branch
  git push origin "$BRANCH" --force-with-lease 2>&1

  # Now merge via gh
  git checkout main
  git pull origin main

  if gh pr merge "$PR_NUM" --squash --delete-branch 2>&1; then
    echo "✅ Merged PR #$PR_NUM"
    MERGED=$((MERGED+1))
    # Pull merged changes into local main
    git pull origin main
  else
    echo "⚠️  gh merge failed for PR #$PR_NUM"
    FAILED=$((FAILED+1))
  fi

  echo ""
done <<< "$PR_NUMBERS"

echo "============================="
echo "✅ Merged:  $MERGED"
echo "⚠️  Failed: $FAILED"
echo "============================="

# Return to main
git checkout main
git pull origin main
