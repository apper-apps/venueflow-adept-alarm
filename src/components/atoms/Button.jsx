import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-primary-500",
    secondary: "bg-surface hover:bg-surface-light text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500",
    accent: "bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-accent-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-red-500",
    ghost: "hover:bg-surface text-gray-400 hover:text-white",
    outline: "border border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;