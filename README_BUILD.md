Build & Deployment Guide

This file explains how to build and package the atmwalimu frontend for production.

Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm (or npm/yarn)

Environment
- Create a `.env` file in the project root or set environment variables in your CI/CD pipeline.
- Useful env variables:
  - VITE_BASE_PATH: base path for the app (default: `/`)
  - VITE_OUT_DIR: output directory for the build (default: `dist`)
  - VITE_ASSETS_DIR: assets subfolder inside output (default: `assets`)
  - NODE_OPTIONS: memory options used by the build script (optional)

Common commands (using pnpm)
- Install dependencies:

  pnpm install

- Development server:

  pnpm dev

- Run tests:

  pnpm test

- Build for production:

  pnpm build

  By default, build artifacts will be placed in `dist/`.

- Preview production build locally:

  pnpm preview

Docker (recommended static deployment)
- Build the production image:

  docker build -t atmwalimu-frontend:latest .

- Run the container locally (serves on port 8080):

  docker run --rm -p 8080:80 atmwalimu-frontend:latest

Notes
- The app expects the backend API URL to be configured via `src/utils/APIDomain.ts` or environment variables exposed at build time.
- If you use a reverse proxy (NGINX, Azure Front Door, Cloudflare, etc.), ensure you correctly rewrite `VITE_BASE_PATH` if the app lives under a subpath.

CI example (GitHub Actions)
- Use a simple workflow to build and publish the `dist/` folder to a static host (Netlify, Vercel, Azure Static Web Apps, S3+CloudFront, etc.).

Security
- Do not commit secrets to the repo. Use your CI/CD provider's secret store for production tokens.

Troubleshooting
- If builds fail with memory issues, try increasing Node's memory: `cross-env NODE_OPTIONS=--max-old-space-size=4096 pnpm build`.
- If assets are missing or route 404s occur on refresh, ensure your hosting serves `index.html` for SPA routes (rewrite/fallback to index.html).

Contact
- If you need help adjusting the build pipeline (Dockerfile, CI, or PWA settings), tell me the target hosting provider and I will produce a tailored setup.
