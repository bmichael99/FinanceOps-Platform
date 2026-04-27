
# ---- Stage 1: dependencies ----
FROM node:25.9-alpine  AS deps
WORKDIR /build

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/types/package.json ./packages/types/

RUN npm ci --include=dev

# ---- Stage 2: build ----
FROM node:25.9-alpine  AS builder
WORKDIR /build

COPY --from=deps /build/node_modules ./node_modules/
COPY package.json package-lock.json ./
COPY packages ./packages/
COPY apps/frontend ./apps/frontend/

RUN npm run build --workspace=packages/schemas
RUN npm run build --workspace=packages/types
RUN npm run build --workspace=apps/frontend

# ---- Stage 3: runtime ----
FROM nginx:alpine AS runtime

# custom nginx config for SPA routing, routes redirect to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /build/apps/frontend/dist /usr/share/nginx/html/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]