FROM node:18-alpine AS builder
WORKDIR /app

# Copia apenas package files para cache
COPY package*.json ./
RUN npm ci

# Copia TS config (se existir) e fonte
COPY tsconfig*.json ./
COPY . .

# Compila TypeScript para ./dist
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Instala só production deps
COPY package*.json ./
RUN npm ci --production

# Copia artefatos buildados
COPY --from=builder /app/dist ./dist

# (Opcional) copie migrations / arquivos necessários em runtime:
# COPY --from=builder /app/drizzle ./drizzle
# COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

# Inicie o app compilado
CMD ["node", "dist/server.js"]