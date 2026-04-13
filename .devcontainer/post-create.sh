#!/usr/bin/env bash
set -euo pipefail

cd /workspace

if [ ! -f package.json ]; then
  echo "[devcontainer] package.json nao encontrado. Pulando instalacao de dependencias."
  exit 0
fi

if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then
  echo "[devcontainer] Instalando dependencias com pnpm..."
  pnpm install
  exit 0
fi

if [ -f package-lock.json ]; then
  echo "[devcontainer] Instalando dependencias com npm ci..."
  npm ci
  exit 0
fi

echo "[devcontainer] Instalando dependencias com npm install..."
npm install
