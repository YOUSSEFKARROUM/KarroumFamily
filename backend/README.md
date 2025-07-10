# 🏺 Backend Marketplace Marocain - Souk El Bait

Backend complet pour le marketplace marocain authentique avec API REST, gestion des commandes, notifications SMS/WhatsApp et système de livraison.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Connexion par numéro de téléphone
- JWT avec refresh tokens
- Gestion des profils utilisateurs

### 🛍️ Gestion des Produits
- CRUD complet des produits
- Catégorisation et filtrage
- Recherche avancée
- Gestion du stock
- Upload d'images

### 📦 Système de Commandes
- Création et suivi des commandes
- Gestion des statuts
- Historique complet
- Calcul automatique des frais

### 🚚 Livraison
- Zones de livraison configurables
- Calcul automatique des frais
- Estimation des délais
- Livraison gratuite conditionnelle

### 📱 Notifications
- SMS via Twilio
- WhatsApp Business API
- Notifications de statut
- Alertes stock faible

## 🛠️ Installation

### Prérequis
- Node.js 18+
- PostgreSQL 15+
- Redis (optionnel)

### Installation locale

```bash
# Cloner et installer
cd backend
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres

# Base de données
npx prisma migrate dev
npx prisma db seed

# Démarrage
npm run dev
```

### Installation avec Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Migrations et seed
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

## 📚 API Endpoints

### Authentification
```
POST /api/auth/login          # Connexion/Inscription
POST /api/auth/refresh        # Rafraîchir token
GET  /api/auth/profile        # Profil utilisateur
PUT  /api/auth/profile        # Mettre à jour profil
```

### Produits
```
GET  /api/products            # Liste des produits
GET  /api/products/:id        # Détail produit
GET  /api/products/featured   # Produits mis en avant
GET  /api/products/search     # Recherche
GET  /api/products/category/:id # Par catégorie
```

### Commandes
```
POST /api/orders              # Créer commande
GET  /api/orders/my           # Mes commandes
GET  /api/orders/:id          # Détail commande
PUT  /api/orders/:id/status   # Mettre à jour statut (admin)
GET  /api/orders/stats        # Statistiques (admin)
```

### Livraison
```
GET  /api/delivery/zones      # Zones disponibles
POST /api/delivery/check      # Vérifier disponibilité
POST /api/delivery/calculate  # Calculer frais
```

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Redis (optionnel)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Twilio SMS
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"

# WhatsApp Business
WHATSAPP_PHONE_ID="your-phone-id"
WHATSAPP_TOKEN="your-access-token"

# Configuration
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
ADMIN_SECRET="your-admin-secret"
```

### Structure de la base de données

Le schéma Prisma inclut :
- **Users** : Utilisateurs et profils
- **Categories** : Catégories de produits
- **Products** : Produits avec stock et images
- **Orders** : Commandes et articles
- **OrderStatusHistory** : Historique des statuts
- **DeliveryZones** : Zones et tarifs de livraison
- **Reviews** : Avis clients
- **SiteConfig** : Configuration du site

## 📱 Intégration Frontend

### Authentification
```javascript
// Connexion
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+212661234567', name: 'Ahmed' })
});

// Utilisation du token
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

### Création de commande
```javascript
const orderData = {
  customerName: 'Ahmed Alami',
  customerPhone: '+212661234567',
  deliveryAddress: '123 Rue Mohammed V, Casablanca',
  city: 'casablanca',
  items: [
    { productId: 'prod_123', quantity: 2, price: 25.0 }
  ]
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers,
  body: JSON.stringify(orderData)
});
```

## 🔒 Sécurité

- **Helmet** : Protection des headers HTTP
- **CORS** : Configuration des origines autorisées
- **Rate Limiting** : Protection contre le spam
- **JWT** : Authentification sécurisée
- **Validation** : Validation des données d'entrée
- **Sanitization** : Nettoyage des inputs

## 📊 Monitoring

### Health Check
```
GET /health
```

### Logs
- Morgan pour les logs HTTP
- Console.error pour les erreurs
- Logs structurés en production

### Métriques
- Statistiques des commandes
- Alertes stock faible
- Suivi des performances

## 🚀 Déploiement

### Production avec Docker
```bash
# Build et déploiement
docker-compose -f docker-compose.prod.yml up -d

# Migrations
docker-compose exec app npx prisma migrate deploy
```

### Variables de production
- Utiliser des secrets sécurisés
- Configurer les URLs de production
- Activer les logs de production
- Configurer les sauvegardes DB

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Coverage
npm run test:coverage
```

## 📈 Performance

- **Compression** : Gzip activé
- **Cache** : Redis pour les données fréquentes
- **Optimisation DB** : Index et requêtes optimisées
- **Images** : Stockage local optimisé

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour préserver l'authenticité culinaire marocaine**