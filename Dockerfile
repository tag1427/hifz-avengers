FROM node:22-alpine

WORKDIR /app

# Install dependencies cleanly using lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build production Vite bundle
COPY . .
RUN npm run build

# Persistent data directory (mount Coolify persistent volume to /data)
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data

RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "server.mjs"]
