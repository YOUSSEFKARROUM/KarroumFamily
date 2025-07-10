import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Gift, Truck } from 'lucide-react';
import { CartItem, Product } from '../types';
import MoroccanButton from './MoroccanButton';

interface SmartCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

const SmartCart: React.FC<SmartCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const promoCodes = {
    'BIENVENUE10': { discount: 10, type: 'percentage', description: 'Réduction de 10%' },
    'RAMADAN2024': { discount: 15, type: 'percentage', description: 'Spécial Ramadan -15%' },
    'LIVRAISON': { discount: 20, type: 'fixed', description: 'Livraison gratuite' }
  };

  const deliveryOptions = [
    { id: 'standard', name: 'Standard (2-3h)', price: 15, icon: '🚚' },
    { id: 'express', name: 'Express (1h)', price: 25, icon: '⚡' },
    { id: 'scheduled', name: 'Programmée', price: 10, icon: '📅' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryPrice = deliveryOptions.find(opt => opt.id === deliveryOption)?.price || 0;
  
  let discount = 0;
  if (appliedPromo && promoCodes[appliedPromo as keyof typeof promoCodes]) {
    const promo = promoCodes[appliedPromo as keyof typeof promoCodes];
    discount = promo.type === 'percentage' 
      ? (subtotal * promo.discount) / 100 
      : promo.discount;
  }

  const total = subtotal + deliveryPrice - discount;

  const applyPromoCode = () => {
    if (promoCodes[promoCode as keyof typeof promoCodes]) {
      setAppliedPromo(promoCode);
      setPromoCode('');
    }
  };

  const getSuggestedProducts = (): Product[] => {
    // Logique simple pour suggérer des produits complémentaires
    const suggestions: Product[] = [
      {
        id: 999,
        name: "Thé à la Menthe",
        name_ar: "أتاي بالنعناع",
        price: 8,
        image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=200",
        description: "Thé traditionnel marocain",
        description_ar: "شاي مغربي تقليدي",
        category: "boissons",
        made_at: Date.now(),
        stock: 50,
        isArtisanal: false,
        rating: 4.6,
        reviewCount: 89,
        tags: ['thé', 'menthe', 'traditionnel'],
        preparationTime: 5,
        shelfLife: 365
      }
    ];
    return suggestions;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-blanc-kasbah w-full max-w-md h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rouge-berbere to-bleu-majorelle p-6 text-blanc-kasbah">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-amiri">سلة التسوق</h2>
                <p className="text-sm opacity-90">Votre Panier ({cartItems.length})</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blanc-kasbah/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Panier vide */
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-amiri text-bleu-majorelle mb-2">
              سلة فارغة
            </h3>
            <p className="text-gray-600 mb-4">Votre panier est vide</p>
            <MoroccanButton variant="primary" onClick={onClose}>
              Continuer les achats
            </MoroccanButton>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Articles du panier */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-beige-desert/30 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-amiri text-bleu-majorelle">{item.name_ar}</h4>
                      <p className="text-sm text-gray-600">{item.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-rouge-berbere">
                          {item.price} DH
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1 bg-blanc-kasbah rounded-full hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-blanc-kasbah rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-rouge-berbere hover:bg-rouge-berbere/10 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="border-t pt-4">
              <h3 className="font-amiri text-bleu-majorelle mb-3">
                🌟 Suggestions pour vous
              </h3>
              <div className="space-y-2">
                {getSuggestedProducts().map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-vert-menthe/10 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.price} DH</p>
                      </div>
                    </div>
                    <button className="text-vert-menthe hover:bg-vert-menthe hover:text-blanc-kasbah p-1 rounded transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Options de livraison */}
            <div className="border-t pt-4">
              <h3 className="font-amiri text-bleu-majorelle mb-3 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                خيارات التوصيل
              </h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      deliveryOption === option.id
                        ? 'bg-bleu-majorelle/10 border-2 border-bleu-majorelle'
                        : 'bg-beige-desert/30 border-2 border-transparent hover:bg-beige-desert/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={deliveryOption === option.id}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="text-bleu-majorelle"
                      />
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.name}</span>
                    </div>
                    <span className="text-sm font-bold text-rouge-berbere">
                      {option.price} DH
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Code promo */}
            <div className="border-t pt-4">
              <h3 className="font-amiri text-bleu-majorelle mb-3 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                كود الخصم
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Code promo..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 p-2 border rounded-lg text-sm"
                />
                <MoroccanButton
                  variant="secondary"
                  size="small"
                  onClick={applyPromoCode}
                  disabled={!promoCode}
                >
                  Appliquer
                </MoroccanButton>
              </div>
              {appliedPromo && (
                <div className="mt-2 p-2 bg-vert-menthe/10 rounded-lg text-sm text-vert-menthe">
                  ✅ {promoCodes[appliedPromo as keyof typeof promoCodes].description}
                </div>
              )}
            </div>

            {/* Récapitulatif */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{subtotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison:</span>
                <span>{deliveryPrice} DH</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-vert-menthe">
                  <span>Réduction:</span>
                  <span>-{discount.toFixed(2)} DH</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-rouge-berbere border-t pt-2">
                <span>Total:</span>
                <span>{total.toFixed(2)} DH</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <MoroccanButton
                variant="primary"
                className="w-full text-lg py-4"
                onClick={() => {/* Logique de commande */}}
              >
                🛒 Passer la commande
              </MoroccanButton>
              
              <div className="flex space-x-2">
                <MoroccanButton
                  variant="secondary"
                  size="small"
                  onClick={onClearCart}
                  className="flex-1"
                >
                  Vider le panier
                </MoroccanButton>
                <MoroccanButton
                  variant="accent"
                  size="small"
                  onClick={onClose}
                  className="flex-1"
                >
                  Continuer
                </MoroccanButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCart;