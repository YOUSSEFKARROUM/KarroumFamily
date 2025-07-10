import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeliveryService {
  async calculateDeliveryFee(city: string, orderAmount: number): Promise<number> {
    const zone = await prisma.deliveryZone.findFirst({
      where: {
        cities: {
          has: city.toLowerCase()
        },
        isActive: true
      }
    });

    if (!zone) {
      throw new Error(`Zone de livraison non disponible pour ${city}`);
    }

    // Livraison gratuite si commande minimum atteinte
    if (zone.minOrder && orderAmount >= zone.minOrder) {
      return 0;
    }

    return zone.price;
  }

  async getAvailableZones() {
    return await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  async checkDeliveryAvailability(city: string) {
    const zone = await prisma.deliveryZone.findFirst({
      where: {
        cities: {
          has: city.toLowerCase()
        },
        isActive: true
      }
    });

    if (!zone) {
      return {
        available: false,
        message: 'Zone de livraison non disponible'
      };
    }

    return {
      available: true,
      zone: {
        name: zone.name,
        price: zone.price,
        minOrder: zone.minOrder,
        estimatedTime: this.estimateDeliveryTime(city)
      }
    };
  }

  async estimateDeliveryTime(city: string): Promise<string> {
    const deliveryTimes: Record<string, string> = {
      'casablanca': '30-45 min',
      'rabat': '45-60 min',
      'mohammedia': '35-50 min',
      'sale': '50-65 min',
      'temara': '60-75 min',
      'kenitra': '90-120 min'
    };

    return deliveryTimes[city.toLowerCase()] || '60-90 min';
  }

  async getCitiesByZone() {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        cities: true,
        price: true,
        minOrder: true
      }
    });

    return zones.map(zone => ({
      ...zone,
      cities: zone.cities.map(city => ({
        name: city,
        estimatedTime: this.estimateDeliveryTime(city)
      }))
    }));
  }
}