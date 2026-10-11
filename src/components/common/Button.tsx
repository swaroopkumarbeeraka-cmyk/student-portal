import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-2.5 text-xs gap-1.5 min-h-[32px]',
    md: 'h-9 px-3.5 text-sm gap-2 min-h-[36px] sm:min-h-[36px]',
    lg: 'h-11 px-5 text-base gap-2.5 min-h-[44px]' // 44px touch target
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-app-accent text-white hover:bg-app-accent-hover active:bg-app-accent border border-transparent',
    secondary: 'bg-app-surface text-app-text border border-app-border hover:bg-app-bg active:bg-app-surface',
    outline: 'bg-transparent text-app-text border border-app-border hover:bg-app-bg hover:border-app-muted',
    danger: 'bg-app-danger text-white hover:opacity-90 active:opacity-100 border border-transparent',
    ghost: 'bg-transparent text-app-text hover:bg-app-surface hover:text-app-accent border border-transparent'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
