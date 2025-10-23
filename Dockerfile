# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install --only=production

# Copy built frontend
COPY --from=builder /app/frontend/dist ./public

# Copy backend source
COPY backend/ .

# Expose port
EXPOSE 5002

# Start the application
CMD ["npm", "start"]
