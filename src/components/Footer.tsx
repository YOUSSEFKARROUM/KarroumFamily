import React from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-marron-henné to-rouge-berbere text-blanc-kasbah relative overflow-hidden">
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h3 className="text-4xl font-amiri mb-4 leading-tight">
              سوق البيت
              <span className="text-lg font-inter block opacity-90">Souk El Bait</span>
            </h3>
            <p className="text-blanc-kasbah/80 mb-6 leading-relaxed">
              Nous perpétuons les traditions culinaires marocaines avec passion et authenticité. 
              Chaque produit raconte une histoire, chaque saveur transporte vers le Maroc authentique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-or-safran transition-colors">📱</a>
              <a href="#" className="text-2xl hover:text-or-safran transition-colors">📧</a>
              <a href="#" className="text-2xl hover:text-or-safran transition-colors">🌐</a>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-xl font-playfair mb-6 text-or-safran">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-vert-menthe" />
                <span className="text-sm">0661-234-567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-vert-menthe" />
                <span className="text-sm">Casablanca, Maroc</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-vert-menthe" />
                <span className="text-sm">7j/7 - 6h à 22h</span>
              </div>
            </div>
          </div>
          
          {/* Liens rapides */}
          <div>
            <h4 className="text-xl font-playfair mb-6 text-or-safran">Liens Rapides</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm hover:text-or-safran transition-colors">
                🏠 الرئيسية - Accueil
              </a>
              <a href="#boutique" className="block text-sm hover:text-or-safran transition-colors">
                🛍️ المتجر - Boutique
              </a>
              <a href="#contact" className="block text-sm hover:text-or-safran transition-colors">
                📞 اتصل بنا - Contact
              </a>
              <a href="#" className="block text-sm hover:text-or-safran transition-colors">
                ℹ️ معلومات عنا - À Propos
              </a>
            </div>
          </div>
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-blanc-kasbah/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-blanc-kasbah/70">
              © 2024 Souk El Bait - Tous droits réservés
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-rouge-berbere fill-current" />
              <span>à Casablanca</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;