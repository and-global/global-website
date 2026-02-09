# Multi-stage Strapi Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    cp -R node_modules /opt/app/prod_node_modules && \
    npm ci

# Build stage
FROM base AS build
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN mkdir -p /opt/app/public
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /opt/app/prod_node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src

RUN mkdir -p /opt/app/public/uploads && \
    chown -R node:node /opt/app

USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
