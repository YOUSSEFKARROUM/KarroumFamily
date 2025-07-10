import { PrismaClient, OrderStatus } from '@prisma/client';
import { CreateOrderRequest } from '../types/order.types';
import { NotificationService } from './notifications.service';
import { DeliveryService } from './delivery.service';

const prisma = new PrismaClient();

export class OrdersService {
  private notificationService = new NotificationService();
  private deliveryService = new DeliveryService();

  async createOrder(orderData: CreateOrderRequest) {
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Générer numéro de commande
      const orderNumber = await this.generateOrderNumber();
      
      // 2. Calculer le sous-total
      let subtotal = 0;
      for (const item of orderData.items) {
        subtotal += item.price * item.quantity;
      }
      
      // 3. Calculer frais de livraison
      const deliveryFee = await this.deliveryService.calculateDeliveryFee(
        orderData.city,
        subtotal
      );
      
      // 4. Créer la commande
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail,
          deliveryAddress: orderData.deliveryAddress,
          city: orderData.city,
          notes: orderData.notes,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
          deliveryTime: orderData.deliveryTime,
          userId: orderData.userId
        }
      });

      // 5. Créer les articles de commande et mettre à jour le stock
      for (const item of orderData.items) {
        // Vérifier le stock disponible
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${product?.name || item.productId}`);
        }

        // Créer l'article de commande
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        });

        // Mettre à jour le stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 6. Historique du statut
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'PENDING',
          notes: 'Commande créée'
        }
      });

      return order;
    });

    // 7. Envoyer notifications
    try {
      await this.notificationService.sendOrderConfirmation(transaction);
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      // Ne pas faire échouer la commande si la notification échoue
    }
    
    return transaction;
  }

  async getOrderById(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                images: true
              }
            }
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getOrdersByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  nameAr: true,
                  images: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where: { userId } })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status, 
        updatedAt: new Date(),
        // Marquer comme payé si livré
        paymentStatus: status === 'DELIVERED' ? 'PAID' : undefined
      }
    });

    // Ajouter à l'historique
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        notes
      }
    });

    // Notifier le client
    try {
      await this.notificationService.sendStatusUpdate(order, status);
    } catch (error) {
      console.error('Erreur envoi notification statut:', error);
    }

    return order;
  }

  async getRecentOrders(limit = 10) {
    return await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                nameAr: true
              }
            }
          }
        }
      }
    });
  }

  async getOrdersByStatus(status: OrderStatus) {
    return await prisma.order.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                nameAr: true,
                images: true
              }
            }
          }
        }
      }
    });
  }

  async getDashboardStats() {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.setMonth(today.getMonth() - 1));

    const [
      todayOrders,
      todayRevenue,
      weekOrders,
      monthRevenue,
      pendingOrders,
      totalOrders
    ] = await Promise.all([
      // Commandes du jour
      prisma.order.count({
        where: {
          createdAt: { gte: startOfToday }
        }
      }),
      
      // Chiffre d'affaires du jour
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfToday },
          status: { not: 'CANCELLED' }
        },
        _sum: { total: true }
      }),
      
      // Commandes de la semaine
      prisma.order.count({
        where: {
          createdAt: { gte: startOfWeek }
        }
      }),
      
      // Chiffre d'affaires du mois
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { not: 'CANCELLED' }
        },
        _sum: { total: true }
      }),
      
      // Commandes en attente
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      
      // Total des commandes
      prisma.order.count()
    ]);

    return {
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0,
      weekOrders,
      monthRevenue: monthRevenue._sum.total || 0,
      pendingOrders,
      totalOrders
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const prefix = 'CMD';
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Compter les commandes du jour pour avoir un numéro séquentiel
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const ordersToday = await prisma.order.count({
      where: {
        createdAt: { gte: startOfDay }
      }
    });
    
    const sequence = (ordersToday + 1).toString().padStart(3, '0');
    
    return `${prefix}${year}${month}${day}${sequence}`;
  }
}