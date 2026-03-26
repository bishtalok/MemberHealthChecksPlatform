FROM node:22-alpine
WORKDIR /app

# Copy entire monorepo
COPY . .

# Install all dependencies including devDeps (needed for nest build + tsc)
RUN npm install

# 1. Compile shared-types (tsc → packages/shared-types/dist/)
# 2. Generate Prisma client
# 3. Compile NestJS API (nest build → apps/api/dist/)
RUN npm run build --workspace=packages/shared-types && \
    npx prisma generate --schema=apps/api/prisma/schema.prisma && \
    npm run build --workspace=apps/api

EXPOSE 3001

# Sync DB schema then start the server
CMD ["sh", "-c", "npx prisma db push --schema=apps/api/prisma/schema.prisma --accept-data-loss && node apps/api/dist/main"]
