import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'L\'email doit être valide',
    'any.required': 'L\'email est requis',
  }),
  phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{8,}$/).optional().messages({
    'string.pattern.base': 'Le numéro de téléphone doit être valide',
  }),
  company: Joi.string().max(100).optional().messages({
    'string.max': 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères',
  }),
  subject: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Le sujet doit contenir au moins 5 caractères',
    'string.max': 'Le sujet ne peut pas dépasser 200 caractères',
    'any.required': 'Le sujet est requis',
  }),
  message: Joi.string().min(10).max(2000).required().messages({
    'string.min': 'Le message doit contenir au moins 10 caractères',
    'string.max': 'Le message ne peut pas dépasser 2000 caractères',
    'any.required': 'Le message est requis',
  }),
});

export function validateContactRequest(req: Request, res: Response, next: NextFunction): void {
  const { error } = contactSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: 'Données de contact invalides',
      details: error.details.map((detail: any) => detail.message),
    });
    return;
  }
  
  next();
} 