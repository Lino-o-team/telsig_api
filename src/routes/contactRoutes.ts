import { Router, Request, Response } from 'express';
import { MailService } from '../services/mailService';
import { validateContactRequest } from '../middleware/contactValidation';
import { ContactRequest } from '../types/contact';

export function createContactRoutes(mailService: MailService): Router {
  const router = Router();

  // Route pour le formulaire de contact
  router.post('/contact', validateContactRequest, async (req: Request, res: Response) => {
    try {
      const contactData: ContactRequest = req.body;
      
      // Créer le contenu HTML du mail
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nouveau message de contact - Telsig
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Informations du contact</h3>
            <p><strong>Nom :</strong> ${contactData.name}</p>
            <p><strong>Email :</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            ${contactData.phone ? `<p><strong>Téléphone :</strong> ${contactData.phone}</p>` : ''}
            ${contactData.company ? `<p><strong>Entreprise :</strong> ${contactData.company}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #007bff; margin-top: 0;">Message</h3>
            <p><strong>Sujet :</strong> ${contactData.subject}</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
            <p>Ce message a été envoyé depuis le formulaire de contact du site Telsig.</p>
            <p>Date d'envoi : ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `;

      // Créer le contenu texte du mail
      const textContent = `
        NOUVEAU MESSAGE DE CONTACT - TELSIG

        INFORMATIONS DU CONTACT :
        Nom : ${contactData.name}
        Email : ${contactData.email}
        ${contactData.phone ? `Téléphone : ${contactData.phone}` : ''}
        ${contactData.company ? `Entreprise : ${contactData.company}` : ''}

        MESSAGE :
        Sujet : ${contactData.subject}

        ${contactData.message}

        ---
        Ce message a été envoyé depuis le formulaire de contact du site Telsig.
        Date d'envoi : ${new Date().toLocaleString('fr-FR')}
      `;

      // Préparer les données du mail
      const mailData = {
        to: 'info-contact@telsig.net',
        subject: `[Contact Telsig] ${contactData.subject}`,
        text: textContent,
        html: htmlContent,
      };

      // Envoyer le mail
      const result = await mailService.sendMail(mailData);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        });
      } else {
        console.error('Erreur lors de l\'envoi du mail de contact:', result.error);
        res.status(500).json({
          success: false,
          error: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
        });
      }
    } catch (error) {
      console.error('Erreur dans la route /contact:', error);
      res.status(500).json({
        success: false,
        error: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
      });
    }
  });

  return router;
} 