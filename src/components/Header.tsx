import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Heart, User, Bell } from 'lucide-react';
import SmartCart from './SmartCart';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onUpdateCartQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notifications] = useState(2);
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="bg-gradient-to-r from-rouge-berbere to-bleu-majorelle shadow-xl relative overflow-hidden sticky top-0 z-40">
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo avec calligraphie arabe */}
          <div className="logo-container">
            <h1 className="text-4xl font-amiri text-blanc-kasbah leading-tight">
              سوق البيت
              <span className="text-lg font-inter block opacity-90">Souk El Bait</span>
            </h1>
          </div>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="nav-link-moroccan text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
              <span>🏠</span>
              <span className="font-semibold">الرئيسية</span>
            </a>
            <a href="#boutique" className="nav-link-moroccan text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
              <span>🛍️</span>
              <span className="font-semibold">المتجر</span>
            </a>
            <a href="#contact" className="nav-link-moroccan text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
              <span>📞</span>
              <span className="font-semibold">اتصل بنا</span>
            </a>
          </nav>
          
          {/* Panier et menu mobile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative cursor-pointer group hidden md:block">
              <Bell className="w-6 h-6 text-blanc-kasbah group-hover:text-or-safran transition-colors duration-300" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-or-safran text-blanc-kasbah text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            
            {/* Favoris */}
            <div className="relative cursor-pointer group hidden md:block">
              <Heart className="w-6 h-6 text-blanc-kasbah group-hover:text-or-safran transition-colors duration-300" />
            </div>
            
            {/* Profil utilisateur */}
            <div className="relative cursor-pointer group hidden md:block">
              <User className="w-6 h-6 text-blanc-kasbah group-hover:text-or-safran transition-colors duration-300" />
            </div>
            
            {/* Panier */}
            <div 
              className="panier-icon relative cursor-pointer group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-8 h-8 text-blanc-kasbah group-hover:text-or-safran transition-colors duration-300" />
              {cartCount > 0 && (
                <span className="cart-badge absolute -top-2 -right-2 bg-or-safran text-blanc-kasbah text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            
            {/* Menu mobile */}
            <button 
              className="md:hidden text-blanc-kasbah hover:text-or-safran transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-blanc-kasbah/20">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
                <span>🏠</span>
                <span>الرئيسية - Accueil</span>
              </a>
              <a href="#boutique" className="text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
                <span>🛍️</span>
                <span>المتجر - Boutique</span>
              </a>
              <a href="#contact" className="text-blanc-kasbah hover:text-or-safran transition-colors duration-300 flex items-center space-x-2">
                <span>📞</span>
                <span>اتصل بنا - Contact</span>
              </a>
            </nav>
          </div>
        )}
      </div>
      </header>
      
      {/* Smart Cart */}
      <SmartCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveFromCart}
        onClearCart={onClearCart}
      />
    </>
  );
};

export default Header;