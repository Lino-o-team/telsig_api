import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const mailSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email().required(),
    Joi.array().items(Joi.string().email()).min(1).required()
  ),
  subject: Joi.string().min(1).max(200).required(),
  text: Joi.string().optional(),
  html: Joi.string().optional(),
  cc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).optional(),
  bcc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).optional(),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      content: Joi.alternatives().try(Joi.string(), Joi.binary()).required(),
      contentType: Joi.string().optional(),
    })
  ).optional(),
});

export function validateMailRequest(req: Request, res: Response, next: NextFunction): void {
  const { error } = mailSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: 'Données de mail invalides',
      details: error.details.map(detail => detail.message),
    });
    return;
  }
  
  next();
} 