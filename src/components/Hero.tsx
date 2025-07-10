import React from 'react';
import MoroccanButton from './MoroccanButton';

const Hero: React.FC = () => {
  return (
    <section className="hero-moroccan relative overflow-hidden min-h-screen flex items-center">
      {/* Background avec pattern zellige */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige-desert via-blanc-kasbah to-beige-desert"></div>
      
      {/* Éléments décoratifs flottants */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-rouge-berbere/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-bleu-majorelle/20 rounded-full blur-3xl animate-float-delayed"></div>
      
      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Titre principal en arabe */}
          <h2 className="text-6xl md:text-7xl font-amiri text-rouge-berbere mb-6 leading-tight">
            طعم الأصالة في بيتك
          </h2>
          
          {/* Sous-titre français */}
          <h3 className="text-3xl md:text-4xl font-playfair text-bleu-majorelle mb-8 leading-relaxed">
            Le Goût Authentique du Maroc chez Vous
          </h3>
          
          {/* Description engageante */}
          <p className="text-xl md:text-2xl text-marron-henné mb-12 max-w-3xl mx-auto leading-relaxed font-inter">
            Découvrez nos <span className="font-bold text-rouge-berbere">msemmen croustillants</span>, 
            <span className="font-bold text-bleu-majorelle"> harcha moelleuse</span> et 
            <span className="font-bold text-vert-menthe"> feuilles de pastilla fraîches</span>, 
            préparés selon les recettes ancestrales de nos grand-mères.
          </p>
          
          {/* Badges de confiance */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-vert-menthe/20 px-6 py-3 rounded-full border-2 border-vert-menthe">
              <span className="text-vert-menthe font-bold">🌿 100% Naturel</span>
            </div>
            <div className="bg-or-safran/20 px-6 py-3 rounded-full border-2 border-or-safran">
              <span className="text-or-safran font-bold">🤲 Fait Main</span>
            </div>
            <div className="bg-rouge-berbere/20 px-6 py-3 rounded-full border-2 border-rouge-berbere">
              <span className="text-rouge-berbere font-bold">🚚 Livraison Rapide</span>
            </div>
          </div>
          
          {/* CTA principal */}
          <div className="space-y-4">
            <MoroccanButton 
              variant="primary" 
              size="large"
              className="text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl"
            >
              <span className="flex items-center space-x-3">
                <span>🛒</span>
                <span className="font-amiri">اطلب الآن</span>
                <span className="text-lg">- Commander Maintenant</span>
              </span>
            </MoroccanButton>
            
            <p className="text-sm text-marron-henné/80 mt-4">
              📞 أو اتصل بنا مباشرة: <span className="font-bold text-bleu-majorelle">0661-234-567</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-rouge-berbere rounded-full flex justify-center">
          <div className="w-1 h-3 bg-rouge-berbere rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;