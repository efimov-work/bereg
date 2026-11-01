FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_LEADS_ENABLED=0
ARG SITE_NOINDEX=1
ARG NEXT_PUBLIC_SITE_URL=
ARG YANDEX_VERIFICATION=
ARG GOOGLE_SITE_VERIFICATION=
ARG NEXT_PUBLIC_YM_ID=
ENV NEXT_PUBLIC_LEADS_ENABLED=$NEXT_PUBLIC_LEADS_ENABLED \
    SITE_NOINDEX=$SITE_NOINDEX \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    YANDEX_VERIFICATION=$YANDEX_VERIFICATION \
    GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_YM_ID=$NEXT_PUBLIC_YM_ID
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/.data && chown -R nextjs:nodejs /app/.data
VOLUME /app/.data
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
