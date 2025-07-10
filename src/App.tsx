import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import DeliveryZoneChecker from './components/DeliveryZoneChecker';
import OrderAssistant from './components/OrderAssistant';
import Footer from './components/Footer';
import { CartItem, Product } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };
  return (
    <div className="min-h-screen bg-blanc-kasbah">
      <Header 
        cartItems={cartItems}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
      <Hero />
      <ProductGrid onAddToCart={handleAddToCart} />
      
      {/* Section Livraison */}
      <section className="py-20 bg-gradient-to-br from-blanc-kasbah to-beige-desert/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-amiri text-rouge-berbere mb-4">
                خدمة التوصيل
              </h2>
              <h3 className="text-2xl font-playfair text-bleu-majorelle">
                Service de Livraison
              </h3>
            </div>
            <DeliveryZoneChecker />
          </div>
        </div>
      </section>
      
      <Footer />
      <OrderAssistant cartItems={cartItems} />
    </div>
  );
}

export default App;