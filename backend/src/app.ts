import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/environment';

// Routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import deliveryRoutes from './routes/delivery.routes';

// Middleware d'upload
import { handleUploadError } from './middleware/upload.middleware';

const app = express();

// Middlewares de sécurité et performance
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    config.frontend.url
  ],
  credentials: true
}));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/delivery', deliveryRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Marketplace Marocain',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Middleware de gestion des erreurs d'upload
app.use(handleUploadError);

// Middleware de gestion des erreurs globales
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur globale:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalide' });
  }
  
  res.status(500).json({ 
    error: config.nodeEnv === 'development' ? error.message : 'Erreur serveur interne'
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${config.nodeEnv}`);
  console.log(`📱 API disponible sur: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;