import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL!
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER!
  },
  
  whatsapp: {
    phoneId: process.env.WHATSAPP_PHONE_ID!,
    token: process.env.WHATSAPP_TOKEN!
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173'
  },
  
  admin: {
    secret: process.env.ADMIN_SECRET!
  }
};

// Validation des variables d'environnement critiques
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`);
  }
}