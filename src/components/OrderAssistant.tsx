import React, { useState } from 'react';
import { MessageCircle, X, Phone, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';

interface OrderAssistantProps {
  cartItems: CartItem[];
}

const OrderAssistant: React.FC<OrderAssistantProps> = ({ cartItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{type: 'bot' | 'user', message: string, timestamp: Date}>>([]);
  
  const getContextualMessages = () => {
    const baseMessages = [
      {
        ar: "أهلاً وسهلاً! كيف يمكنني مساعدتك؟",
        fr: "Bienvenue ! Comment puis-je vous aider ?",
        type: "greeting"
      }
    ];

    if (cartItems.length === 0) {
      baseMessages.push({
        ar: "هل تريد معرفة المزيد عن منتجاتنا الطازجة؟",
        fr: "Voulez-vous en savoir plus sur nos produits frais ?",
        type: "products"
      });
    } else {
      baseMessages.push({
        ar: `لديك ${cartItems.length} منتجات في السلة. هل تريد إكمال الطلب؟`,
        fr: `Vous avez ${cartItems.length} produits dans votre panier. Voulez-vous finaliser votre commande ?`,
        type: "checkout"
      });
    }

    baseMessages.push(
      {
        ar: "يمكنني مساعدتك في اختيار أفضل المنتجات لك",
        fr: "Je peux vous aider à choisir les meilleurs produits",
        type: "help"
      },
      {
        ar: "هل تحتاج مساعدة في الطلب؟",
        fr: "Avez-vous besoin d'aide pour commander ?",
        type: "order"
      }
    );

    return baseMessages;
  };

  const messages = getContextualMessages();

  const quickActions = [
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Appeler",
      action: () => window.open('tel:+212661234567'),
      color: "bg-vert-menthe"
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      label: "WhatsApp",
      action: () => {
        const message = cartItems.length > 0 
          ? `Bonjour! J'ai ${cartItems.length} produits dans mon panier et j'aimerais passer commande.`
          : "Bonjour! J'aimerais en savoir plus sur vos produits.";
        window.open(`https://wa.me/212661234567?text=${encodeURIComponent(message)}`);
      },
      color: "bg-or-safran"
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: "Chat Live",
      action: () => {/* Ouvrir chat en direct */},
      color: "bg-bleu-majorelle"
    }
  ];

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentMessage(0);
    }
  };

  const nextMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bulle de chat */}
      {isOpen && (
        <div className="mb-4 bg-blanc-kasbah rounded-2xl shadow-2xl max-w-sm border-2 border-bleu-majorelle animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-bleu-majorelle to-vert-menthe text-blanc-kasbah rounded-t-xl -m-6 mb-4">
              <span className="text-2xl">🤖</span>
              <div>
                <span className="font-amiri font-bold block">مساعد الطلبات</span>
                <span className="text-xs opacity-90">Assistant Intelligent</span>
              </div>
              <button 
                onClick={toggleAssistant}
                className="ml-auto text-blanc-kasbah hover:text-or-safran transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 p-4 -mt-4">
            {/* Message contextuel */}
            <div className="bg-bleu-majorelle/10 p-3 rounded-lg">
              <p className="text-sm font-amiri text-bleu-majorelle mb-1">
                {messages[currentMessage].ar}
              </p>
              <p className="text-xs text-gray-600">
                {messages[currentMessage].fr}
              </p>
            </div>
            
            {/* Informations du panier si applicable */}
            {cartItems.length > 0 && (
              <div className="bg-vert-menthe/10 p-3 rounded-lg">
                <p className="text-xs text-vert-menthe font-bold mb-2">
                  📦 Votre panier: {cartItems.length} article(s)
                </p>
                <div className="space-y-1">
                  {cartItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>{item.name}</span>
                      <span>{item.quantity}x {item.price}DH</span>
                    </div>
                  ))}
                  {cartItems.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{cartItems.length - 2} autres produits...
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Actions rapides */}
            <div className="space-y-2">
              <button 
                onClick={nextMessage}
                className="text-xs text-bleu-majorelle hover:text-rouge-berbere transition-colors w-full text-left"
              >
                💬 Message suivant →
              </button>
              
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-blanc-kasbah px-2 py-2 rounded-lg text-xs hover:opacity-90 transition-all duration-200 flex flex-col items-center space-y-1`}
                  >
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Indicateur de statut */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-vert-menthe rounded-full animate-pulse"></div>
              <span>En ligne - Réponse immédiate</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bouton d'ouverture */}
      <button 
        onClick={toggleAssistant}
        className="bg-gradient-to-r from-bleu-majorelle to-vert-menthe hover:from-blue-700 hover:to-green-700 text-blanc-kasbah p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-blanc-kasbah/20 relative"
      >
        <MessageCircle className="w-6 h-6" />
        {cartItems.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-or-safran text-blanc-kasbah text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {cartItems.length}
          </div>
        )}
      </button>
    </div>
  );
};

export default OrderAssistant;