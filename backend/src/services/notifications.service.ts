import twilio from 'twilio';
import axios from 'axios';
import { config } from '../config/environment';

export class NotificationService {
  private twilioClient: any;

  constructor() {
    if (config.twilio.accountSid && config.twilio.authToken) {
      this.twilioClient = twilio(
        config.twilio.accountSid,
        config.twilio.authToken
      );
    }
  }

  async sendOrderConfirmation(order: any) {
    const message = `
🎉 Commande confirmée !

📦 N° ${order.orderNumber}
💰 Total: ${order.total} DH
🚚 Livraison: ${order.deliveryFee === 0 ? 'GRATUITE' : order.deliveryFee + ' DH'}
📍 ${order.deliveryAddress}
${order.deliveryDate ? '📅 ' + new Date(order.deliveryDate).toLocaleDateString('fr-FR') : ''}
${order.deliveryTime ? '⏰ ' + order.deliveryTime : ''}

Merci pour votre confiance ! 🙏
Suivi: ${config.frontend.url}/orders/${order.id}
    `.trim();

    // Envoyer SMS
    await this.sendSMS(order.customerPhone, message);
    
    // Envoyer WhatsApp si numéro marocain
    if (order.customerPhone.startsWith('+212')) {
      await this.sendWhatsApp(order.customerPhone, message);
    }
  }

  async sendStatusUpdate(order: any, status: string) {
    const statusMessages: Record<string, string> = {
      CONFIRMED: '✅ Votre commande est confirmée et en préparation',
      PREPARING: '👨‍🍳 Nos chefs préparent votre commande avec amour',
      READY: '🎉 Votre commande est prête ! Livraison en cours',
      DELIVERING: '🚚 Votre livreur est en route !',
      DELIVERED: '✅ Commande livrée ! Merci et bon appétit ! 🍽️',
      CANCELLED: '❌ Votre commande a été annulée. Contactez-nous pour plus d\'infos.'
    };

    const message = `
📦 Commande ${order.orderNumber}
${statusMessages[status] || 'Statut mis à jour'}

${status === 'DELIVERED' ? 'N\'hésitez pas à nous laisser un avis ! ⭐' : ''}
Suivi: ${config.frontend.url}/orders/${order.id}
    `.trim();

    await this.sendSMS(order.customerPhone, message);
    
    if (order.customerPhone.startsWith('+212')) {
      await this.sendWhatsApp(order.customerPhone, message);
    }
  }

  async sendLowStockAlert(products: any[]) {
    const adminMessage = `
⚠️ ALERTE STOCK FAIBLE

Les produits suivants ont un stock faible :
${products.map(p => `• ${p.name} (${p.stock} restant)`).join('\n')}

Veuillez réapprovisionner rapidement.
    `.trim();

    // Envoyer à l'admin (numéro configuré)
    const adminPhone = '+212600000000'; // À configurer
    await this.sendSMS(adminPhone, adminMessage);
  }

  private async sendSMS(phone: string, message: string) {
    if (!this.twilioClient) {
      console.log('SMS non configuré. Message:', message);
      return;
    }

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: config.twilio.phoneNumber,
        to: phone
      });
      console.log(`SMS envoyé à ${phone}`);
    } catch (error) {
      console.error('Erreur SMS:', error);
    }
  }

  private async sendWhatsApp(phone: string, message: string) {
    if (!config.whatsapp.token || !config.whatsapp.phoneId) {
      console.log('WhatsApp non configuré. Message:', message);
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v17.0/${config.whatsapp.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`WhatsApp envoyé à ${phone}`);
    } catch (error) {
      console.error('Erreur WhatsApp:', error);
    }
  }

  // Méthode pour envoyer des notifications personnalisées
  async sendCustomNotification(phone: string, message: string) {
    await this.sendSMS(phone, message);
    
    if (phone.startsWith('+212')) {
      await this.sendWhatsApp(phone, message);
    }
  }
}