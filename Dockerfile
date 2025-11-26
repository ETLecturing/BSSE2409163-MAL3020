# Stage 1: build real frontend
FROM node:20 AS frontend
WORKDIR /app
COPY ../frontendCopy/package*.json ./
RUN npm install
COPY ../frontendCopy/ ./
RUN npm run build

# Stage 2: backend
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

COPY --from=frontend /app/dist ./client_build

EXPOSE 5000
CMD ["node", "server.js"]
