# Stage 1: build frontend
FROM node:20 AS frontend
WORKDIR /app
COPY frontendCopy/package*.json ./
RUN npm install
COPY frontendCopy/ ./
RUN npm run build

# Stage 2: backend
FROM node:20
WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/ ./

# Copy frontend build from previous stage
COPY --from=frontend /app/dist ./client_build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
