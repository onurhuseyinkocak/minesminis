import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconOnly = false,
      children,
      fullWidth = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'mm-button',
      `mm-button--${variant}`,
      `mm-button--${size}`,
      loading && 'mm-button--loading',
      fullWidth && 'mm-button--full-width',
      iconOnly && 'mm-button--icon-only',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...rest}
      >
        {loading && <span className="mm-button__spinner" aria-hidden="true" />}
        {!loading && icon && <span className="mm-button__icon" aria-hidden="true">{icon}</span>}
        {!iconOnly && children && <span className="mm-button__label">{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
