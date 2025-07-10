import { Request, Response } from 'express';
import { ProductsService } from '../services/products.service';
import { ProductFilters } from '../types/product.types';

export class ProductsController {
  private productsService = new ProductsService();

  async getProducts(req: Request, res: Response) {
    try {
      const filters: ProductFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 12,
        category: req.query.category as string,
        featured: req.query.featured === 'true',
        sortBy: req.query.sortBy as string || 'createdAt',
        order: (req.query.order as 'asc' | 'desc') || 'desc',
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined
      };

      const result = await this.productsService.getProducts(filters);
      res.json(result);
    } catch (error) {
      console.error('Erreur getProducts:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productsService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }

      res.json(product);
    } catch (error) {
      console.error('Erreur getProductById:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 8;
      
      const products = await this.productsService.getProductsByCategory(categoryId, limit);
      res.json(products);
    } catch (error) {
      console.error('Erreur getProductsByCategory:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const products = await this.productsService.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      console.error('Erreur getFeaturedProducts:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Paramètre de recherche manquant' });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const products = await this.productsService.searchProducts(q, limit);
      
      res.json(products);
    } catch (error) {
      console.error('Erreur searchProducts:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getLowStockProducts(req: Request, res: Response) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 5;
      const products = await this.productsService.getLowStockProducts(threshold);
      res.json(products);
    } catch (error) {
      console.error('Erreur getLowStockProducts:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}