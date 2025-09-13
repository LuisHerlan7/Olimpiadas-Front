import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  hoverable = false,
  padding = 'default',
  ...props 
}) => {
  const variants = {
    default: 'card',
    elevated: 'card-elevated',
    hover: 'card-hover'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const classes = clsx(
    variants[variant],
    paddings[padding],
    {
      'hover:shadow-medium transition-all duration-200 hover:-translate-y-1': hoverable
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-gray-600 mt-1', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('mt-6 pt-4 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;

