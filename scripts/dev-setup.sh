#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

cp -n .env.example .env || true
cp -n backend/.env.example backend/.env || true
cp -n portfolio/.env.example portfolio/.env || true

printf 'Environment files are ready. Set GEMINI_API_KEY and ADMIN_SECRET before production.\n'
