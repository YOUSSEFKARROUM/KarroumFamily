import React from 'react';

interface Product {
  made_at: number;
}

interface FreshnessIndicatorProps {
  product: Product;
}

const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ product }) => {
  const hoursOld = Math.floor((Date.now() - product.made_at) / (1000 * 60 * 60));
  
  const getFreshnessInfo = () => {
    if (hoursOld < 2) {
      return {
        text: "طازج من الفرن",
        textFr: "Sortie du four",
        icon: "🔥",
        color: "text-rouge-berbere",
        bgColor: "bg-rouge-berbere/20"
      };
    } else if (hoursOld < 6) {
      return {
        text: "طازج جداً",
        textFr: "Très frais",
        icon: "✨",
        color: "text-vert-menthe",
        bgColor: "bg-vert-menthe/20"
      };
    } else if (hoursOld < 12) {
      return {
        text: `${hoursOld} ساعات`,
        textFr: `${hoursOld}h`,
        icon: "⏰",
        color: "text-or-safran",
        bgColor: "bg-or-safran/20"
      };
    } else {
      return {
        text: "اليوم",
        textFr: "Aujourd'hui",
        icon: "📅",
        color: "text-bleu-majorelle",
        bgColor: "bg-bleu-majorelle/20"
      };
    }
  };

  const freshness = getFreshnessInfo();

  return (
    <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full ${freshness.bgColor} backdrop-blur-sm`}>
      <span className="text-lg">{freshness.icon}</span>
      <span className={`${freshness.color} font-bold`}>
        {freshness.text}
      </span>
    </div>
  );
};

export default FreshnessIndicator;