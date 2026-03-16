import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import './Card.css';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      children,
      className = '',
      onClick,
      ...rest
    },
    ref
  ) => {
    const isInteractive = variant === 'interactive' || !!onClick;
    const resolvedVariant = isInteractive ? 'interactive' : variant;

    const classes = [
      'mm-card',
      `mm-card--${resolvedVariant}`,
      `mm-card--padding-${padding}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        onClick={onClick}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
