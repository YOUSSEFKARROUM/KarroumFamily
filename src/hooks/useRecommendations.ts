import { useState, useEffect } from 'react';
import { Product, Recommendation, User } from '../types';

export const useRecommendations = (
  products: Product[], 
  user?: User, 
  currentProduct?: Product,
  cartItems: Product[] = []
) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [products, user, currentProduct, cartItems]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRecommendations: Recommendation[] = [];

    // 1. Produits tendance (basé sur les ventes et ratings)
    const trendingProducts = products
      .filter(p => p.isPopular || p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    
    if (trendingProducts.length > 0) {
      newRecommendations.push({
        type: 'trending',
        products: trendingProducts,
        reason: 'Produits les plus populaires cette semaine',
        reason_ar: 'المنتجات الأكثر شعبية هذا الأسبوع',
        confidence: 0.9
      });
    }

    // 2. Recommandations personnalisées (basées sur l'historique)
    if (user && user.orderHistory.length > 0) {
      const userCategories = products
        .filter(p => user.orderHistory.includes(p.id))
        .map(p => p.category);
      
      const personalizedProducts = products
        .filter(p => 
          userCategories.includes(p.category) && 
          !user.orderHistory.includes(p.id) &&
          !cartItems.some(item => item.id === p.id)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

      if (personalizedProducts.length > 0) {
        newRecommendations.push({
          type: 'personalized',
          products: personalizedProducts,
          reason: 'Basé sur vos achats précédents',
          reason_ar: 'بناءً على مشترياتك السابقة',
          confidence: 0.85
        });
      }
    }

    // 3. Produits similaires (si on regarde un produit spécifique)
    if (currentProduct) {
      const similarProducts = products
        .filter(p => 
          p.id !== currentProduct.id &&
          (p.category === currentProduct.category ||
           p.tags.some(tag => currentProduct.tags.includes(tag)))
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

      if (similarProducts.length > 0) {
        newRecommendations.push({
          type: 'similar',
          products: similarProducts,
          reason: 'Produits similaires qui pourraient vous plaire',
          reason_ar: 'منتجات مشابهة قد تعجبك',
          confidence: 0.75
        });
      }
    }

    // 4. Recommandations saisonnières
    const currentMonth = new Date().getMonth();
    const seasonalTags = getSeasonalTags(currentMonth);
    
    const seasonalProducts = products
      .filter(p => p.tags.some(tag => seasonalTags.includes(tag)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    if (seasonalProducts.length > 0) {
      newRecommendations.push({
        type: 'seasonal',
        products: seasonalProducts,
        reason: 'Parfait pour la saison',
        reason_ar: 'مثالي للموسم',
        confidence: 0.7
      });
    }

    // 5. Bundles intelligents (produits qui vont bien ensemble)
    if (cartItems.length > 0) {
      const bundleProducts = generateBundleRecommendations(cartItems, products);
      
      if (bundleProducts.length > 0) {
        newRecommendations.push({
          type: 'bundle',
          products: bundleProducts,
          reason: 'Parfait avec vos articles actuels',
          reason_ar: 'مثالي مع عناصرك الحالية',
          confidence: 0.8
        });
      }
    }

    setRecommendations(newRecommendations);
    setLoading(false);
  };

  const getSeasonalTags = (month: number): string[] => {
    if (month >= 2 && month <= 4) return ['printemps', 'frais', 'léger'];
    if (month >= 5 && month <= 7) return ['été', 'rafraîchissant', 'hydratant'];
    if (month >= 8 && month <= 10) return ['automne', 'réconfortant', 'épicé'];
    return ['hiver', 'chaud', 'nourrissant', 'ramadan'];
  };

  const generateBundleRecommendations = (cartItems: Product[], allProducts: Product[]): Product[] => {
    const cartCategories = cartItems.map(item => item.category);
    const complementaryCategories: Record<string, string[]> = {
      'pains': ['patisserie', 'confiture', 'miel'],
      'patisserie': ['thé', 'café', 'lait'],
      'pastilla': ['salade', 'boisson'],
    };

    const recommendations: Product[] = [];
    
    cartCategories.forEach(category => {
      const complements = complementaryCategories[category] || [];
      complements.forEach(complement => {
        const complementProducts = allProducts
          .filter(p => 
            p.category === complement && 
            !cartItems.some(item => item.id === p.id)
          )
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 2);
        
        recommendations.push(...complementProducts);
      });
    });

    return recommendations.slice(0, 4);
  };

  return { recommendations, loading, refreshRecommendations: generateRecommendations };
};