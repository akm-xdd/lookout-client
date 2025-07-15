import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'brand';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'span'
}) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-white via-blue-100 to-purple-100',
    secondary: 'bg-gradient-to-r from-white to-gray-300',
    accent: 'bg-gradient-to-r from-blue-400 to-purple-400',
    brand: 'bg-gradient-to-r from-blue-400 to-purple-400'
  };

  const classes = `${gradientClasses[variant]} bg-clip-text text-transparent ${className}`;

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};

export default GradientText;