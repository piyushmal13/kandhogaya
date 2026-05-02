FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including dev deps for build)
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Copy source and build all
COPY . .
RUN npm run build:all

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Minimal runtime deps
COPY package.json package-lock.json* ./
RUN npm ci --production=true

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

EXPOSE 3000
CMD ["node", "dist/server.js"]
