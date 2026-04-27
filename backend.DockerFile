# ---- Stage 0: generate RSA asymmetric keys ----


# ---- Stage 1: dependencies ----
FROM node:25.9-alpine AS deps

WORKDIR /build
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/types/package.json ./packages/types/

RUN npm ci --include=dev


# ---- Stage 2: build ----
FROM node:25.9-alpine AS builder
WORKDIR /build

# Backend and packages do not generate a node_modules, shared thanks to workspaces monorepo
COPY --from=deps /build/node_modules ./node_modules/

# Copy source after node modules, that way if source changes modules do not need to be rebuilt. (no wasted cache invalidation)
COPY package.json package-lock.json ./
COPY packages ./packages/
COPY apps/backend ./apps/backend/

#Generate Prisma Client
RUN npx prisma generate --schema=apps/backend/src/prisma/schema.prisma

# Make sure shared package is built before backend
RUN npm run build --workspace=packages/schemas/
RUN npm run build --workspace=packages/types/
RUN npm run build --workspace=apps/backend/


# ---- Stage 3: production dependencies only ----
FROM node:25.9-alpine AS prod-deps
WORKDIR /build

#Copy package.json files to build node_modules
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/types/package.json ./packages/types/

RUN npm ci --omit=dev


# ---- Stage 4: runtime ----
FROM node:25.9-alpine AS runtime

WORKDIR /workspace

# Run as a non-root user for security
RUN addgroup -S app && adduser -S app -G app
# Create shared volume /data/uploads, owned by app:app so it can accessed within containers.
RUN mkdir -p /data/uploads && chown -R app:app /data
USER app

# # Copy production node_modules
COPY --from=prod-deps --chown=app:app /build/node_modules ./node_modules/

# Copy package.json files
COPY --chown=app:app package.json ./
COPY --chown=app:app apps/backend/package.json ./apps/backend/
COPY --chown=app:app packages/schemas/package.json ./packages/schemas/
COPY --chown=app:app packages/types/package.json ./packages/types/

# Copy the built output
COPY --from=builder --chown=app:app /build/apps/backend/dist ./apps/backend/dist/
COPY --from=builder --chown=app:app /build/packages/schemas/dist ./packages/schemas/dist/
COPY --from=builder --chown=app:app /build/packages/types/dist  ./packages/types/dist/

#for migrate deploy
COPY --from=builder --chown=app:app /build/apps/backend/src/prisma ./apps/backend/src/prisma/
#for query engine
COPY --from=builder --chown=app:app /build/apps/backend/src/generated ./apps/backend/src/generated/

EXPOSE 3000
CMD ["node", "apps/backend/dist/app.js"]
