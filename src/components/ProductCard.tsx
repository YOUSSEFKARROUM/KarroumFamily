import React, { useState } from 'react';
import MoroccanButton from './MoroccanButton';
import FreshnessIndicator from './FreshnessIndicator';
import { Star, Heart, Eye, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  name_ar: string;
  price: number;
  image: string;
  description: string;
  category: string;
  made_at: number;
  stock: number;
  isArtisanal: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  originalPrice?: number;
  discount?: number;
  isPopular?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showRecommendationBadge?: boolean;
  recommendationType?: string;
  onQuickView?: (product: Product) => void;
  onToggleFavorite?: (productId: number) => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  showRecommendationBadge = false,
  recommendationType,
  onQuickView,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulation
    onAddToCart(product);
    setIsLoading(false);
  };

  const getRecommendationBadgeColor = () => {
    switch (recommendationType) {
      case 'trending': return 'bg-rouge-berbere';
      case 'personalized': return 'bg-bleu-majorelle';
      case 'similar': return 'bg-vert-menthe';
      case 'seasonal': return 'bg-or-safran';
      case 'bundle': return 'bg-marron-henné';
      default: return 'bg-rouge-berbere';
    }
  };

  const getRecommendationBadgeText = () => {
    switch (recommendationType) {
      case 'trending': return '🔥 Tendance';
      case 'personalized': return '💝 Pour Vous';
      case 'similar': return '✨ Similaire';
      case 'seasonal': return '🌟 Saison';
      case 'bundle': return '📦 Parfait Ensemble';
      default: return '⭐ Recommandé';
    }
  };
  return (
    <div 
      className="group bg-blanc-kasbah rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 moroccan-border relative transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de recommandation */}
      {showRecommendationBadge && (
        <div className={`absolute top-2 left-2 ${getRecommendationBadgeColor()} text-blanc-kasbah px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg animate-pulse`}>
          {getRecommendationBadgeText()}
        </div>
      )}
      
      {/* Badge nouveau produit */}
      {product.isNew && (
        <div className="absolute top-2 right-2 bg-vert-menthe text-blanc-kasbah px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          🆕 Nouveau
        </div>
      )}
      
      {/* Badge artisanal */}
      {product.isArtisanal && !product.isNew && (
        <div className="absolute top-2 right-2 bg-or-safran text-blanc-kasbah px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          🤲 Fait Main
        </div>
      )}
      
      {/* Badge promotion */}
      {product.discount && product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-rouge-berbere text-blanc-kasbah px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg animate-bounce">
          -{product.discount}%
        </div>
      )}
      
      {/* Badge stock faible */}
      {product.stock <= 3 && product.stock > 0 && !product.discount && (
        <div className="absolute top-2 left-2 bg-rouge-berbere text-blanc-kasbah px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg animate-pulse">
          ⚠️ Stock Limité
        </div>
      )}
      
      {/* Image avec effet hover */}
      <div className="relative overflow-hidden h-48 group">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-beige-desert animate-pulse"></div>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rouge-berbere/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Actions rapides au hover */}
        <div className={`absolute inset-0 flex items-center justify-center space-x-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={() => onToggleFavorite?.(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-rouge-berbere text-blanc-kasbah' 
                : 'bg-blanc-kasbah/80 text-rouge-berbere hover:bg-rouge-berbere hover:text-blanc-kasbah'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => onQuickView?.(product)}
            className="p-2 bg-blanc-kasbah/80 text-bleu-majorelle rounded-full backdrop-blur-sm hover:bg-bleu-majorelle hover:text-blanc-kasbah transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className="p-2 bg-blanc-kasbah/80 text-vert-menthe rounded-full backdrop-blur-sm hover:bg-vert-menthe hover:text-blanc-kasbah transition-all duration-200 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
        
        {/* Indicateur de fraîcheur */}
        <div className="absolute bottom-3 left-3">
          <FreshnessIndicator product={product} />
        </div>
      </div>
      
      {/* Contenu */}
      <div className="p-6">
        {/* Rating et reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-or-safran fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount})
            </span>
          </div>
          
          {product.isPopular && (
            <div className="bg-rouge-berbere/10 text-rouge-berbere px-2 py-1 rounded-full text-xs font-bold">
              🔥 Populaire
            </div>
          )}
        </div>
        
        {/* Noms en arabe et français */}
        <h3 className="text-xl font-amiri text-bleu-majorelle mb-2 leading-relaxed">
          {product.name_ar}
        </h3>
        <h4 className="text-lg font-playfair text-marron-henné mb-3 font-semibold">
          {product.name}
        </h4>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        {/* Prix et action */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice} DH
                </span>
              )}
              <span className="text-2xl font-bold text-rouge-berbere">
                {product.price} DH
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {product.stock} en stock
            </span>
          </div>
          
          <MoroccanButton 
            variant="success" 
            size="medium"
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className={`${isLoading ? 'animate-pulse' : ''} ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blanc-kasbah border-t-transparent rounded-full animate-spin"></div>
                <span>...</span>
              </span>
            ) : product.stock === 0 ? (
              <span>نفذ المخزون</span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>اطلب</span>
              </span>
            )}
          </MoroccanButton>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-beige-desert text-marron-henné px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;