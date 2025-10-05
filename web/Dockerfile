# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG NUXT_PUBLIC_API_BASE
ARG NUXT_API_BASE

# Set environment variables for build
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NUXT_API_BASE=${NUXT_API_BASE}

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# Change ownership
RUN chown -R nuxt:nodejs /app

# Switch to non-root user
USER nuxt

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", ".output/server/index.mjs"]
