import express from 'express';
import { OrdersController } from '../controllers/orders.controller';
import { authMiddleware, optionalAuthMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const ordersController = new OrdersController();

// POST /api/orders - Créer une commande (avec ou sans auth)
router.post('/', optionalAuthMiddleware, ordersController.createOrder.bind(ordersController));

// GET /api/orders/my - Mes commandes (auth requise)
router.get('/my', authMiddleware, ordersController.getOrdersByUser.bind(ordersController));

// GET /api/orders/stats - Statistiques (admin)
router.get('/stats', adminMiddleware, ordersController.getDashboardStats.bind(ordersController));

// GET /api/orders/recent - Commandes récentes (admin)
router.get('/recent', adminMiddleware, ordersController.getRecentOrders.bind(ordersController));

// GET /api/orders/status/:status - Commandes par statut (admin)
router.get('/status/:status', adminMiddleware, ordersController.getOrdersByStatus.bind(ordersController));

// GET /api/orders/:id - Détail commande
router.get('/:id', ordersController.getOrderById.bind(ordersController));

// PUT /api/orders/:id/status - Mettre à jour le statut (admin)
router.put('/:id/status', adminMiddleware, ordersController.updateOrderStatus.bind(ordersController));

export default router;