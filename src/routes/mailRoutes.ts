import { Router, Request, Response } from 'express';
import { MailService } from '../services/mailService';
import { validateMailRequest } from '../middleware/validation';
import { MailRequest } from '../types/mail';

export function createMailRoutes(mailService: MailService): Router {
  const router = Router();

  // Route pour envoyer un mail
  router.post('/send', validateMailRequest, async (req: Request, res: Response) => {
    try {
      const mailRequest: MailRequest = req.body;
      const result = await mailService.sendMail(mailRequest);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Mail envoyé avec succès',
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Erreur lors de l\'envoi du mail',
        });
      }
    } catch (error) {
      console.error('Erreur dans la route /send:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  });

  // Route pour vérifier la connexion SMTP
  router.get('/health', async (req: Request, res: Response) => {
    try {
      const isConnected = await mailService.verifyConnection();
      console.log('🚀 - isConnected:', isConnected);
      
      if (isConnected) {
        res.status(200).json({
          success: true,
          message: 'Connexion SMTP OK',
        });
      } else {
        res.status(503).json({
          success: false,
          error: 'Connexion SMTP échouée',
        });
      }
    } catch (error) {
      console.error('Erreur dans la route /health:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification de la connexion',
      });
    }
  });

  return router;
} 