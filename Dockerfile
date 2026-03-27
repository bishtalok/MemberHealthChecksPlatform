FROM node:22-alpine
WORKDIR /app

# Copy entire monorepo
COPY . .

# Install all dependencies (devDeps needed for nest build + tsc)
RUN npm install

# Step 1: Build shared-types
RUN cd packages/shared-types && npx tsc && echo "shared-types built" && ls -la dist/

# Step 2: Generate Prisma client
RUN cd apps/api && npx prisma generate && echo "Prisma client generated"

# Step 3: Build NestJS API (explicit cd, NOT --workspace flag)
RUN cd apps/api && npx nest build && echo "NestJS built" && ls -la dist/

# Step 4: Final verification
RUN ls -la apps/api/dist/src/main.js

EXPOSE 3001

WORKDIR /app/apps/api

CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && node dist/src/main"]
