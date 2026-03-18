import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== config.security.apiKey) {
    res.status(401).json({
      success: false,
      error: 'Clé API invalide ou manquante',
    });
    return;
  }

  next();
}
