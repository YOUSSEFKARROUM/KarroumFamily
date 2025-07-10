import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../types/auth.types';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const { phone, name }: LoginRequest = req.body;

      // Validation
      if (!phone) {
        return res.status(400).json({ error: 'Numéro de téléphone requis' });
      }

      // Validation format téléphone (basique)
      const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ 
          error: 'Format de téléphone invalide. Utilisez le format marocain (+212XXXXXXXXX ou 0XXXXXXXXX)' 
        });
      }

      const result = await this.authService.registerOrLogin(phone, name);
      
      res.json({
        message: 'Connexion réussie',
        ...result
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Token de rafraîchissement requis' });
      }

      const tokens = await this.authService.refreshToken(refreshToken);
      
      res.json({
        message: 'Token rafraîchi avec succès',
        tokens
      });
    } catch (error) {
      console.error('Erreur refreshToken:', error);
      res.status(401).json({ error: 'Token de rafraîchissement invalide' });
    }
  }

  async getProfile(req: any, res: Response) {
    try {
      // L'utilisateur est déjà attaché par le middleware auth
      const user = req.user;
      
      res.json({
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          address: user.address,
          city: user.city
        }
      });
    } catch (error) {
      console.error('Erreur getProfile:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async updateProfile(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { name, email, address, city } = req.body;

      // Validation email si fourni
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Format email invalide' });
      }

      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(address && { address }),
          ...(city && { city })
        },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          address: true,
          city: true
        }
      });

      res.json({
        message: 'Profil mis à jour avec succès',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
      
      res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  }
}