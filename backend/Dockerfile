# Dockerfile multi-stage pour optimiser la taille
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# Image de production
FROM node:18-alpine AS production

WORKDIR /app

# Installer dumb-init pour une gestion propre des signaux
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Créer le dossier uploads
RUN mkdir -p uploads/products && chown -R nodejs:nodejs uploads

# Changer vers l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage avec dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]