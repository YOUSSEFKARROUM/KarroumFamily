import React, { useState } from 'react';
import MoroccanButton from './MoroccanButton';

interface DeliveryInfo {
  price: number;
  time: string;
  zone: string;
}

const DeliveryZoneChecker: React.FC = () => {
  const [address, setAddress] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryZones: { [key: string]: DeliveryInfo } = {
    "casablanca": { price: 0, time: "30 min", zone: "Centre Casablanca" },
    "ain sebaa": { price: 10, time: "35 min", zone: "Ain Sebaa" },
    "mohammedia": { price: 15, time: "45 min", zone: "Mohammedia" },
    "sale": { price: 20, time: "50 min", zone: "Salé" },
    "rabat": { price: 20, time: "50 min", zone: "Rabat" },
    "temara": { price: 25, time: "60 min", zone: "Temara" },
    "kenitra": { price: 35, time: "90 min", zone: "Kenitra" }
  };

  const checkDelivery = async () => {
    if (!address.trim()) {
      setError("الرجاء إدخال عنوانك - Veuillez entrer votre adresse");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const searchAddress = address.toLowerCase();
    const zone = Object.keys(deliveryZones).find(z => 
      searchAddress.includes(z) || searchAddress.includes(z.replace(/\s+/g, ''))
    );
    
    if (zone) {
      setDeliveryInfo(deliveryZones[zone]);
    } else {
      setDeliveryInfo(null);
      setError("عذراً، لا نقوم بالتوصيل لهذه المنطقة حالياً - Désolé, nous ne livrons pas dans cette zone actuellement");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-beige-desert to-blanc-kasbah p-8 rounded-2xl shadow-xl border-2 border-vert-menthe/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-amiri text-bleu-majorelle mb-2">
          🚚 تحقق من التوصيل
        </h3>
        <h4 className="text-xl font-playfair text-marron-henné">
          Vérifiez la Livraison
        </h4>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <input 
            type="text" 
            placeholder="أدخل عنوانك... / Entrez votre adresse..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 p-3 border-2 border-bleu-majorelle/20 rounded-lg focus:border-bleu-majorelle focus:outline-none transition-colors font-inter"
            onKeyPress={(e) => e.key === 'Enter' && checkDelivery()}
          />
          <MoroccanButton 
            onClick={checkDelivery}
            variant="primary"
            disabled={isLoading}
            className={isLoading ? 'animate-pulse' : ''}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blanc-kasbah border-t-transparent rounded-full animate-spin"></div>
                <span>فحص...</span>
              </span>
            ) : (
              "تحقق"
            )}
          </MoroccanButton>
        </div>
        
        {error && (
          <div className="bg-rouge-berbere/10 border-2 border-rouge-berbere/20 p-4 rounded-lg">
            <p className="text-rouge-berbere text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
        
        {deliveryInfo && (
          <div className="bg-vert-menthe/10 border-2 border-vert-menthe/20 p-6 rounded-lg">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">✅</div>
              <h5 className="text-lg font-bold text-vert-menthe">
                التوصيل متاح - Livraison Disponible
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">📍</div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="font-bold text-bleu-majorelle">{deliveryInfo.zone}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-bold text-rouge-berbere">
                    {deliveryInfo.price === 0 ? "Gratuit" : `${deliveryInfo.price} DH`}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <p className="text-sm text-gray-600">Délai</p>
                  <p className="font-bold text-or-safran">{deliveryInfo.time}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryZoneChecker;