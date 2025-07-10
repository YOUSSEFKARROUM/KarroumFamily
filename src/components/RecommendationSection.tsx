import React from 'react';
import { Recommendation } from '../types';
import ProductCard from './ProductCard';
import { Sparkles, TrendingUp, Heart, Calendar, Package } from 'lucide-react';

interface RecommendationSectionProps {
  recommendation: Recommendation;
  onAddToCart: (product: any) => void;
  className?: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendation,
  onAddToCart,
  className = ''
}) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'trending':
        return <TrendingUp className="w-6 h-6 text-rouge-berbere" />;
      case 'personalized':
        return <Heart className="w-6 h-6 text-rouge-berbere" />;
      case 'similar':
        return <Sparkles className="w-6 h-6 text-rouge-berbere" />;
      case 'seasonal':
        return <Calendar className="w-6 h-6 text-rouge-berbere" />;
      case 'bundle':
        return <Package className="w-6 h-6 text-rouge-berbere" />;
      default:
        return <Sparkles className="w-6 h-6 text-rouge-berbere" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (recommendation.type) {
      case 'trending':
        return 'from-rouge-berbere/5 to-or-safran/5';
      case 'personalized':
        return 'from-bleu-majorelle/5 to-vert-menthe/5';
      case 'similar':
        return 'from-vert-menthe/5 to-beige-desert/5';
      case 'seasonal':
        return 'from-or-safran/5 to-marron-henné/5';
      case 'bundle':
        return 'from-marron-henné/5 to-rouge-berbere/5';
      default:
        return 'from-beige-desert/5 to-blanc-kasbah/5';
    }
  };

  return (
    <section className={`py-12 bg-gradient-to-br ${getBackgroundGradient()} ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header de la section */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4 bg-blanc-kasbah/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border-2 border-rouge-berbere/10">
            {getIcon()}
            <div className="text-center">
              <h3 className="text-xl font-amiri text-bleu-majorelle mb-1">
                {recommendation.reason_ar}
              </h3>
              <p className="text-sm font-playfair text-marron-henné">
                {recommendation.reason}
              </p>
              <div className="flex items-center justify-center mt-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.floor(recommendation.confidence * 5)
                          ? 'bg-or-safran'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {Math.round(recommendation.confidence * 100)}% pertinence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de produits recommandés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendation.products.map((product, index) => (
            <div
              key={product.id}
              className="transform transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                showRecommendationBadge={true}
                recommendationType={recommendation.type}
              />
            </div>
          ))}
        </div>

        {/* Badge de confiance */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 bg-vert-menthe/10 px-4 py-2 rounded-full border border-vert-menthe/20">
            <Sparkles className="w-4 h-4 text-vert-menthe" />
            <span className="text-sm text-vert-menthe font-medium">
              Recommandation IA basée sur vos préférences
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;