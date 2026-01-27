import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', className = '', block = false, ...props }) => {
  const variantClass = `btn-${variant}`;
  const blockClass = block ? 'btn-block' : '';
  
  return (
    <button 
      className={`btn ${variantClass} ${blockClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
