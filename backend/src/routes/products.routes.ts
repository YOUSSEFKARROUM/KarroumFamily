import express from 'express';
import { ProductsController } from '../controllers/products.controller';

const router = express.Router();
const productsController = new ProductsController();

// GET /api/products - Liste produits avec filtres
router.get('/', productsController.getProducts.bind(productsController));

// GET /api/products/featured - Produits mis en avant
router.get('/featured', productsController.getFeaturedProducts.bind(productsController));

// GET /api/products/search - Recherche produits
router.get('/search', productsController.searchProducts.bind(productsController));

// GET /api/products/low-stock - Produits en rupture (admin)
router.get('/low-stock', productsController.getLowStockProducts.bind(productsController));

// GET /api/products/category/:categoryId - Produits par catégorie
router.get('/category/:categoryId', productsController.getProductsByCategory.bind(productsController));

// GET /api/products/:id - Détail produit
router.get('/:id', productsController.getProductById.bind(productsController));

export default router;