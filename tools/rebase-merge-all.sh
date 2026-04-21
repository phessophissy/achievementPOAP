#!/usr/bin/env bash

# Rebase each open PR branch onto main, force-push, then merge
# Processes one at a time since each merge changes main

cd "$(git rev-parse --show-toplevel)"

git checkout main
git pull origin main

PRS=$(gh pr list --state open --limit 50 --json number,headRefName -q '.[] | "\(.number) \(.headRefName)"' | sort -t' ' -k1 -n)

TOTAL=$(echo "$PRS" | wc -l)
COUNT=0
MERGED=0
FAILED=0

echo "═══ Rebasing and merging $TOTAL open PRs ═══"
echo ""

while IFS=' ' read -r pr_num branch; do
  COUNT=$((COUNT + 1))
  echo "── [$COUNT/$TOTAL] PR #$pr_num ($branch) ──"

  # Checkout and rebase
  git checkout main 2>/dev/null
  git pull origin main --quiet 2>/dev/null
  git branch -D "$branch" 2>/dev/null
  git fetch origin "$branch" --quiet 2>/dev/null

  if ! git checkout "$branch" 2>/dev/null; then
    echo "  ✗ Failed to checkout $branch"
    FAILED=$((FAILED + 1))
    continue
  fi

  if ! git rebase main 2>/dev/null; then
    echo "  ✗ Rebase conflict - aborting and using theirs strategy"
    git rebase --abort 2>/dev/null

    # Try rebase with theirs strategy (accept incoming for conflicts)
    if ! git rebase -X theirs main 2>/dev/null; then
      echo "  ✗ Rebase still failed, skipping"
      git rebase --abort 2>/dev/null
      FAILED=$((FAILED + 1))
      continue
    fi
  fi

  # Force push rebased branch
  if ! git push origin "$branch" --force-with-lease 2>/dev/null; then
    git push origin "$branch" --force 2>/dev/null
  fi

  # Wait a moment for GitHub to process
  sleep 2

  # Merge via gh
  if gh pr merge "$pr_num" --merge --admin 2>/dev/null; then
    echo "  ✓ Merged PR #$pr_num"
    MERGED=$((MERGED + 1))
  else
    # Sometimes GitHub needs more time to compute mergeability
    sleep 3
    if gh pr merge "$pr_num" --merge --admin 2>/dev/null; then
      echo "  ✓ Merged PR #$pr_num (retry)"
      MERGED=$((MERGED + 1))
    else
      echo "  ✗ Failed to merge PR #$pr_num"
      FAILED=$((FAILED + 1))
    fi
  fi

  echo ""
done <<< "$PRS"

git checkout main 2>/dev/null
git pull origin main --quiet 2>/dev/null

echo "═══ Done! Merged: $MERGED, Failed: $FAILED out of $TOTAL ═══"
