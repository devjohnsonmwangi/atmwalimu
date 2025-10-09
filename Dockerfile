# Multi-stage Dockerfile for a Vite + React static app

# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install deps
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile

# Copy sources
COPY . .

# Build
ARG NODE_OPTIONS
ARG VITE_BASE_PATH
RUN pnpm build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: copy custom nginx.conf if you want SPA fallback or headers
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
