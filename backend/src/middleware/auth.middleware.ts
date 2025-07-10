import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const user = await authService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    res.status(401).json({ error: 'Non autorisé' });
  }
};

// Middleware optionnel (pour utilisateurs connectés ou invités)
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      const user = await authService.verifyToken(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, continuer sans utilisateur
    next();
  }
};

// Middleware admin (à implémenter selon vos besoins)
export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier d'abord l'authentification
    await authMiddleware(req, res, () => {});
    
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    // Vérifier les droits admin (à adapter selon votre logique)
    // Par exemple, vérifier un rôle ou un secret admin
    const adminSecret = req.header('X-Admin-Secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Droits administrateur requis' });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    res.status(403).json({ error: 'Accès refusé' });
  }
};