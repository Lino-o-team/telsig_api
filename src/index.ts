import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateConfig } from './config/env';
import { MailService } from './services/mailService';
import { createMailRoutes } from './routes/mailRoutes';
import { createContactRoutes } from './routes/contactRoutes';
import { apiKeyMiddleware } from './middleware/apiKey';

async function startServer(): Promise<void> {
  try {
    // Valider la configuration
    validateConfig();
    
    // Créer l'application Express
    const app = express();
    
    // Middleware de sécurité
    app.use(helmet());
    app.use(cors({
      origin: config.security.corsOrigin,
      credentials: true,
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.security.rateLimitWindowMs,
      max: config.security.rateLimitMaxRequests,
      message: {
        success: false,
        error: 'Trop de requêtes, veuillez réessayer plus tard',
      },
    });
    app.use(limiter);
    
    // Middleware pour parser le JSON
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Créer le service de mail
    const mailService = new MailService(config.mail);
    
    // Vérifier la connexion SMTP
    const isConnected = await mailService.verifyConnection();
    if (!isConnected) {
      console.error('⚠️  Impossible de se connecter au serveur SMTP');
      console.error('Vérifiez vos paramètres SMTP dans le fichier .env');
    } else {
      console.log('✅ Connexion SMTP établie');
    }
    
    // Routes
    app.use('/api', apiKeyMiddleware);
    app.use('/api/mail', createMailRoutes(mailService));
    app.use('/api', createContactRoutes(mailService));
    
    // Route de base
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Serveur d\'envoi de mail Telsig',
        version: '1.0.0',
        endpoints: {
          health: 'GET /api/mail/health',
          send: 'POST /api/mail/send',
          contact: 'POST /api/contact',
        },
      });
    });
    
    // Gestion des erreurs 404
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route non trouvée',
      });
    });
    
    // Démarrer le serveur
    const port = config.server.port;
    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur le port ${port}`);
      console.log(`📧 Endpoint d'envoi de mail: http://localhost:${port}/api/mail/send`);
      console.log(`🔍 Endpoint de santé: http://localhost:${port}/api/mail/health`);
      console.log(`📝 Endpoint de contact: http://localhost:${port}/api/contact`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer(); 