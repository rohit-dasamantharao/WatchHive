# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
# Copy server package files
COPY server/package.json server/package-lock.json ./server/

# Install root dependencies (for concurrently, etc.)
RUN npm install
# Install server dependencies
RUN cd server && npm install

# Copy server source code
COPY server ./server/

# Generate Prisma client
RUN cd server && npx prisma generate

# Build the application
RUN cd server && npm run build

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package.json server/package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/server/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose the port
EXPOSE 5001

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
