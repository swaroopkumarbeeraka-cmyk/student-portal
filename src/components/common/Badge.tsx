import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md'
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#2E7D4F]/10 text-[#2E7D4F] border-[#2E7D4F]/20',
    warning: 'bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20',
    danger: 'bg-[#B42318]/10 text-[#B42318] border-[#B42318]/20',
    neutral: 'bg-app-muted/10 text-app-text border-app-border',
    accent: 'bg-app-accent/10 text-app-accent border-app-accent/25'
  };

  const sizeStyles = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-[4px] leading-tight ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
