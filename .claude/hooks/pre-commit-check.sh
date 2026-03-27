#!/bin/bash
# Pre-commit check for ScioEdu Intranet
# Runs ESLint and TypeScript check on staged files before commit.
# Exit 2 = block commit, exit 0 = pass.

set -euo pipefail

ERRORS=()
WARNINGS=()

# ── 1. ESLint on staged JS/TS/TSX files ──────────────────────────
STAGED_JS=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' || true)

if [ -n "$STAGED_JS" ]; then
  ESLINT_OUTPUT=$(npx eslint $STAGED_JS --no-warn-ignored 2>&1) || {
    ERRORS+=("ESLint errors found:")
    ERRORS+=("$ESLINT_OUTPUT")
  }
fi

# ── 2. TypeScript check ──────────────────────────────────────────
TSC_OUTPUT=$(npx tsc --noEmit 2>&1) || {
  ERRORS+=("TypeScript errors found:")
  ERRORS+=("$TSC_OUTPUT")
}

# ── 3. Check for .env or secrets in staged files ─────────────────
SECRETS_CHECK=$(git diff --cached --name-only | grep -E '^\.(env|env\..*)$|wrangler\.toml$' || true)

if [ -n "$SECRETS_CHECK" ]; then
  ERRORS+=("⚠️  Attempting to commit sensitive files: $SECRETS_CHECK")
fi

# ── Report ────────────────────────────────────────────────────────
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "❌ Pre-commit check FAILED"
  echo ""
  for err in "${ERRORS[@]}"; do
    echo "$err"
  done
  exit 2
fi

echo "✅ Pre-commit check passed (ESLint + TypeScript)"
exit 0
