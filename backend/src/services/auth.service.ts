import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/environment';
import { AuthTokens, TokenPayload } from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
  // Génération des tokens
  generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
    
    return { accessToken, refreshToken };
  }

  // Inscription/Connexion par téléphone
  async registerOrLogin(phone: string, name?: string) {
    // Nettoyer le numéro de téléphone
    const cleanPhone = this.cleanPhoneNumber(phone);
    
    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name: name || `Client ${cleanPhone.slice(-4)}`
        }
      });
    }
    
    const tokens = this.generateTokens(user.id);
    
    return {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email
      },
      tokens
    };
  }

  // Vérification du token
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          address: true,
          city: true
        }
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const tokens = this.generateTokens(user.id);
      return tokens;
    } catch (error) {
      throw new Error('Token de rafraîchissement invalide');
    }
  }

  // Nettoyer le numéro de téléphone
  private cleanPhoneNumber(phone: string): string {
    // Supprimer tous les caractères non numériques sauf le +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Ajouter +212 si le numéro commence par 0
    if (cleaned.startsWith('0')) {
      cleaned = '+212' + cleaned.substring(1);
    }
    
    // Ajouter +212 si le numéro ne commence pas par +
    if (!cleaned.startsWith('+')) {
      cleaned = '+212' + cleaned;
    }
    
    return cleaned;
  }
}