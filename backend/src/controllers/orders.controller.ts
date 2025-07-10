import { Request, Response } from 'express';
import { OrdersService } from '../services/orders.service';
import { CreateOrderRequest, OrderStatusUpdate } from '../types/order.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { OrderStatus } from '@prisma/client';

export class OrdersController {
  private ordersService = new OrdersService();

  async createOrder(req: AuthRequest, res: Response) {
    try {
      const orderData: CreateOrderRequest = {
        ...req.body,
        userId: req.user?.id // Optionnel si utilisateur connecté
      };

      // Validation basique
      if (!orderData.customerName || !orderData.customerPhone || !orderData.deliveryAddress) {
        return res.status(400).json({ 
          error: 'Informations client manquantes (nom, téléphone, adresse)' 
        });
      }

      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({ 
          error: 'Aucun article dans la commande' 
        });
      }

      const order = await this.ordersService.createOrder(orderData);
      
      res.status(201).json({
        message: 'Commande créée avec succès',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status
        }
      });
    } catch (error) {
      console.error('Erreur createOrder:', error);
      
      if (error instanceof Error && error.message.includes('Stock insuffisant')) {
        return res.status(400).json({ error: error.message });
      }
      
      if (error instanceof Error && error.message.includes('Zone de livraison')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.ordersService.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }

      res.json(order);
    } catch (error) {
      console.error('Erreur getOrderById:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getOrdersByUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.ordersService.getOrdersByUser(req.user.id, page, limit);
      res.json(result);
    } catch (error) {
      console.error('Erreur getOrdersByUser:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes }: OrderStatusUpdate = req.body;

      // Validation du statut
      const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const order = await this.ordersService.updateOrderStatus(id, status as OrderStatus, notes);
      
      res.json({
        message: 'Statut mis à jour avec succès',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status
        }
      });
    } catch (error) {
      console.error('Erreur updateOrderStatus:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  async getRecentOrders(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const orders = await this.ordersService.getRecentOrders(limit);
      res.json(orders);
    } catch (error) {
      console.error('Erreur getRecentOrders:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getOrdersByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      
      const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const orders = await this.ordersService.getOrdersByStatus(status.toUpperCase() as OrderStatus);
      res.json(orders);
    } catch (error) {
      console.error('Erreur getOrdersByStatus:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await this.ordersService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Erreur getDashboardStats:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}