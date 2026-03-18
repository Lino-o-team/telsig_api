import dotenv from 'dotenv';
import { MailConfig } from '../types/mail';

// Charger les variables d'environnement
dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  } as MailConfig,
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    corsOrigin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:3000'],
    apiKey: process.env.API_KEY || '',
  },
};

// Validation des variables d'environnement requises
export function validateConfig(): void {
  const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
  }
} 