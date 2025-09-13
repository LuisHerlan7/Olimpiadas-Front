import React from 'react';
import { clsx } from 'clsx';

const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error, 
  success,
  required = false,
  disabled = false,
  placeholder = 'Seleccionar...',
  className = '',
  helperText,
  ...props 
}) => {
  const selectClasses = clsx(
    'input-field',
    {
      'error': error,
      'success': success
    },
    className
  );

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-success">{success}</p>
      )}
      
      {helperText && !error && !success && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;

