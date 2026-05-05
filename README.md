# The Artist Mall

B2B Artist Management Marketplace - Enterprise Architecture.

## Workspace Structure

This repository uses NPM Workspaces to manage a monorepo containing:

- `apps/frontend`: React + Vite + TypeScript application
- `apps/backend`: Express.js + Node.js + TypeScript REST API
- `packages/shared`: Shared types, interfaces, and Zod schemas

## Getting Started

1. Run `npm install` from the root directory.
2. Build the shared package: `npm run build --workspace=@artist-mall/shared`
3. Start the dev servers: `npm run dev`

## Architecture

Please refer to the generated Implementation Plan for architecture details.
