import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const authController = new AuthController();

// POST /api/auth/login - Connexion/Inscription
router.post('/login', authController.login.bind(authController));

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', authController.refreshToken.bind(authController));

// GET /api/auth/profile - Profil utilisateur (auth requise)
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

// PUT /api/auth/profile - Mettre à jour le profil (auth requise)
router.put('/profile', authMiddleware, authController.updateProfile.bind(authController));

export default router;