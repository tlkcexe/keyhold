# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
# Prisma's query engine needs OpenSSL present to detect the right binary
# target on Alpine (musl + OpenSSL 3.x) — without this it fails silently
# at runtime with a "could not parse schema engine response" error.
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate
COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
