#!/bin/bash
set -e

cd /home/thee1/achievementPOAP

echo "Fetching all open PRs..."

# Get all open PR numbers (paginate through all)
PR_NUMBERS=$(gh pr list --state open --limit 200 --json number --jq '.[].number')

TOTAL=$(echo "$PR_NUMBERS" | wc -l)
echo "Found $TOTAL open PRs to merge."
echo ""

MERGED=0
FAILED=0

for PR in $PR_NUMBERS; do
  echo -n "Merging PR #$PR ... "
  if gh pr merge "$PR" --squash --auto --delete-branch 2>&1; then
    echo "✅ Merged"
    MERGED=$((MERGED + 1))
  else
    # Try without --auto in case it's ready now
    if gh pr merge "$PR" --squash --delete-branch 2>&1; then
      echo "✅ Merged (direct)"
      MERGED=$((MERGED + 1))
    else
      echo "⚠️  Failed - skipping"
      FAILED=$((FAILED + 1))
    fi
  fi
  sleep 1
done

echo ""
echo "============================="
echo "✅ Merged:  $MERGED"
echo "⚠️  Failed: $FAILED"
echo "============================="
