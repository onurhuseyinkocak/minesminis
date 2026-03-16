import React, { ReactNode } from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const classes = [
    'mm-badge',
    `mm-badge--${variant}`,
    `mm-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon && <span className="mm-badge__icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
