import React from 'react';

interface MoroccanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const MoroccanButton: React.FC<MoroccanButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-rouge-berbere hover:bg-terre-cuite text-blanc-kasbah shadow-rouge-berbere/30',
    secondary: 'bg-bleu-majorelle hover:bg-blue-700 text-blanc-kasbah shadow-bleu-majorelle/30',
    accent: 'bg-or-safran hover:bg-yellow-600 text-blanc-kasbah shadow-or-safran/30',
    success: 'bg-vert-menthe hover:bg-green-600 text-blanc-kasbah shadow-vert-menthe/30'
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        font-bold 
        rounded-xl 
        transform 
        hover:scale-105 
        active:scale-95 
        transition-all 
        duration-300 
        shadow-lg 
        hover:shadow-xl
        border-2 
        border-transparent 
        hover:border-blanc-kasbah/20
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default MoroccanButton;