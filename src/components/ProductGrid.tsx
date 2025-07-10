import React, { useState } from 'react';
import ProductCard from './ProductCard';
import RecommendationSection from './RecommendationSection';
import { useRecommendations } from '../hooks/useRecommendations';
import { Product, User } from '../types';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import MoroccanButton from './MoroccanButton';


interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Données exemple avec images Pexels
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Msemmen Traditionnel",
      name_ar: "المسمن التقليدي",
      price: 15,
      originalPrice: 18,
      image: "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Crêpes feuilletées traditionnelles, croustillantes à l'extérieur, moelleuses à l'intérieur. Recette de grand-mère.",
      description_ar: "فطائر مورقة تقليدية، مقرمشة من الخارج، طرية من الداخل. وصفة الجدة.",
      category: "pains",
      made_at: Date.now() - (1000 * 60 * 30), // 30 minutes ago
      stock: 12,
      isArtisanal: true,
      rating: 4.8,
      reviewCount: 127,
      tags: ['traditionnel', 'croustillant', 'fait-main', 'populaire'],
      isPopular: true,
      discount: 17
    },
    {
      id: 2,
      name: "Harcha aux Graines",
      name_ar: "الحرشة بالحبوب",
      price: 12,
      image: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Pain de semoule parfumé aux graines de fenouil et d'anis. Texture unique et saveur authentique.",
      description_ar: "خبز السميد المعطر ببذور الشمر واليانسون. قوام فريد ونكهة أصيلة.",
      category: "pains",
      made_at: Date.now() - (1000 * 60 * 60 * 2), // 2 hours ago
      stock: 8,
      isArtisanal: true,
      rating: 4.6,
      reviewCount: 89,
      tags: ['semoule', 'graines', 'parfumé', 'authentique'],
      isNew: true
    },
    {
      id: 3,
      name: "Feuilles de Pastilla",
      name_ar: "أوراق البسطيلة",
      price: 25,
      image: "https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Feuilles ultra-fines faites à la main, parfaites pour vos pastillas sucrées ou salées.",
      description_ar: "أوراق رقيقة جداً مصنوعة يدوياً، مثالية للبسطيلة الحلوة أو المالحة.",
      category: "pastilla",
      made_at: Date.now() - (1000 * 60 * 45), // 45 minutes ago
      stock: 5,
      isArtisanal: true,
      rating: 4.9,
      reviewCount: 156,
      tags: ['ultra-fin', 'fait-main', 'polyvalent', 'premium']
    },
    {
      id: 4,
      name: "Chebakia Dorée",
      name_ar: "الشباكية الذهبية",
      price: 35,
      image: "https://images.pexels.com/photos/4110254/pexels-photo-4110254.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Pâtisserie traditionnelle en forme de rose, dorée au miel et parsemée de graines de sésame.",
      description_ar: "حلوى تقليدية على شكل وردة، مذهبة بالعسل ومرشوشة ببذور السمسم.",
      category: "patisserie",
      made_at: Date.now() - (1000 * 60 * 60 * 4), // 4 hours ago
      stock: 15,
      isArtisanal: true,
      rating: 4.7,
      reviewCount: 203,
      tags: ['miel', 'sésame', 'traditionnel', 'festif'],
      isPopular: true
    },
    {
      id: 5,
      name: "Khubz Beldi",
      name_ar: "الخبز البلدي",
      price: 8,
      image: "https://images.pexels.com/photos/4110253/pexels-photo-4110253.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Pain traditionnel marocain cuit au four à bois, croûte croustillante et mie moelleuse.",
      description_ar: "خبز مغربي تقليدي مطبوخ في فرن الخشب، قشرة مقرمشة ولب طري.",
      category: "pains",
      made_at: Date.now() - (1000 * 60 * 60 * 1), // 1 hour ago
      stock: 20,
      isArtisanal: true,
      rating: 4.5,
      reviewCount: 78,
      tags: ['four-bois', 'traditionnel', 'quotidien', 'économique']
    },
    {
      id: 6,
      name: "Mlawi Feuilleté",
      name_ar: "الملوي المورق",
      price: 18,
      image: "https://images.pexels.com/photos/4110257/pexels-photo-4110257.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Galette feuilletée traditionnelle, parfaite pour le petit-déjeuner avec du miel ou de la confiture.",
      description_ar: "رقاقة مورقة تقليدية، مثالية للإفطار مع العسل أو المربى.",
      category: "pains",
      made_at: Date.now() - (1000 * 60 * 20), // 20 minutes ago
      stock: 3,
      isArtisanal: true,
      rating: 4.4,
      reviewCount: 92,
      tags: ['feuilleté', 'petit-déjeuner', 'miel', 'confiture']
    }
  ];

  // Utilisateur exemple pour les recommandations
  const currentUser: User = {
    id: 'user123',
    name: 'Ahmed',
    preferences: ['traditionnel', 'fait-main', 'authentique'],
    orderHistory: [1, 4],
    favoriteProducts: favorites,
    dietaryRestrictions: []
  };

  // Hook pour les recommandations
  const { recommendations, loading: recommendationsLoading } = useRecommendations(
    allProducts,
    currentUser,
    undefined,
    cart
  );

  // Filtrage et tri des produits
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.name_ar.includes(searchTerm) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.made_at - a.made_at;
        case 'popular':
        default:
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating;
      }
    });

  const categories = [
    { id: 'all', name: 'Tous', name_ar: 'الكل', icon: '🏪' },
    { id: 'pains', name: 'Pains', name_ar: 'الخبز', icon: '🥖' },
    { id: 'patisserie', name: 'Pâtisserie', name_ar: 'الحلويات', icon: '🧁' },
    { id: 'pastilla', name: 'Pastilla', name_ar: 'البسطيلة', icon: '🥟' }
  ];
  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <section id="boutique" className="py-12 bg-gradient-to-br from-beige-desert to-blanc-kasbah">
      <div className="container mx-auto px-4">
        {/* Titre de section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-amiri text-rouge-berbere mb-4">
            منتجاتنا الطازجة
          </h2>
          <h3 className="text-3xl font-playfair text-bleu-majorelle mb-6">
            Nos Produits Frais
          </h3>
          <p className="text-xl text-marron-henné max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection de spécialités marocaines préparées avec amour selon les traditions ancestrales
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-blanc-kasbah rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث عن المنتجات... / Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-bleu-majorelle/20 rounded-lg focus:border-bleu-majorelle focus:outline-none transition-colors"
              />
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-bleu-majorelle text-blanc-kasbah shadow-lg'
                      : 'bg-beige-desert text-marron-henné hover:bg-bleu-majorelle/10'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Tri et filtres */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-bleu-majorelle/20 rounded-lg focus:border-bleu-majorelle focus:outline-none"
              >
                <option value="popular">Populaires</option>
                <option value="newest">Nouveautés</option>
                <option value="rating">Mieux notés</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border-2 border-bleu-majorelle/20 rounded-lg hover:border-bleu-majorelle transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-bleu-majorelle" />
              </button>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </div>

        {/* Message si aucun produit trouvé */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-amiri text-bleu-majorelle mb-2">
              لم نجد أي منتجات
            </h3>
            <p className="text-marron-henné mb-4">
              Aucun produit ne correspond à votre recherche
            </p>
            <MoroccanButton 
              variant="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Réinitialiser les filtres
            </MoroccanButton>
          </div>
        )}
      </div>

      {/* Sections de recommandations */}
      {!recommendationsLoading && recommendations.map((recommendation, index) => (
        <RecommendationSection
          key={`${recommendation.type}-${index}`}
          recommendation={recommendation}
          onAddToCart={handleAddToCart}
          className="mt-8"
        />
      ))}

      <div className="container mx-auto px-4">
        
        {/* Section "Pourquoi nous choisir" */}
        <div className="mt-16 bg-gradient-to-br from-blanc-kasbah to-beige-desert/30 rounded-2xl p-12 shadow-xl border border-bleu-majorelle/10">
          <h3 className="text-3xl font-amiri text-center text-bleu-majorelle mb-8">
            لماذا تختارنا؟
          </h3>
          <h4 className="text-2xl font-playfair text-center text-marron-henné mb-12">
            Pourquoi Nous Choisir ?
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h5 className="text-xl font-bold text-rouge-berbere mb-2">Fait Main</h5>
              <p className="text-gray-600">Chaque produit est préparé artisanalement selon les recettes traditionnelles</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h5 className="text-xl font-bold text-vert-menthe mb-2">Ingrédients Naturels</h5>
              <p className="text-gray-600">Nous utilisons uniquement des ingrédients frais et naturels du terroir marocain</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🚚</div>
              <h5 className="text-xl font-bold text-or-safran mb-2">Livraison Rapide</h5>
              <p className="text-gray-600">Livraison dans les 2 heures pour garantir la fraîcheur maximale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Quick View */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-blanc-kasbah rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-amiri text-bleu-majorelle">
                  {quickViewProduct.name_ar}
                </h3>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <h4 className="text-xl font-playfair text-marron-henné mb-2">
                    {quickViewProduct.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {quickViewProduct.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-rouge-berbere">
                      {quickViewProduct.price} DH
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-gray-400 line-through">
                        {quickViewProduct.originalPrice} DH
                      </span>
                    )}
                  </div>
                  
                  <MoroccanButton
                    variant="primary"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full"
                  >
                    🛒 Ajouter au panier
                  </MoroccanButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;