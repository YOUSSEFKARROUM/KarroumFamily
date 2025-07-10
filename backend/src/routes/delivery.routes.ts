import express from 'express';
import { DeliveryService } from '../services/delivery.service';

const router = express.Router();
const deliveryService = new DeliveryService();

// GET /api/delivery/zones - Zones de livraison disponibles
router.get('/zones', async (req, res) => {
  try {
    const zones = await deliveryService.getAvailableZones();
    res.json(zones);
  } catch (error) {
    console.error('Erreur zones:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/delivery/cities - Villes par zone
router.get('/cities', async (req, res) => {
  try {
    const cities = await deliveryService.getCitiesByZone();
    res.json(cities);
  } catch (error) {
    console.error('Erreur cities:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/delivery/check - Vérifier disponibilité livraison
router.post('/check', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'Ville requise' });
    }
    
    const result = await deliveryService.checkDeliveryAvailability(city);
    res.json(result);
  } catch (error) {
    console.error('Erreur check delivery:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/delivery/calculate - Calculer frais de livraison
router.post('/calculate', async (req, res) => {
  try {
    const { city, orderAmount } = req.body;
    
    if (!city || orderAmount === undefined) {
      return res.status(400).json({ error: 'Ville et montant requis' });
    }
    
    const deliveryFee = await deliveryService.calculateDeliveryFee(city, orderAmount);
    const estimatedTime = await deliveryService.estimateDeliveryTime(city);
    
    res.json({
      deliveryFee,
      estimatedTime,
      freeDelivery: deliveryFee === 0
    });
  } catch (error) {
    console.error('Erreur calculate delivery:', error);
    
    if (error instanceof Error && error.message.includes('Zone de livraison')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;