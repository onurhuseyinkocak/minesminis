import React from 'react';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const style: React.CSSProperties = {};

  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  // Circle defaults to equal width/height
  if (variant === 'circle') {
    const size = width || height || 40;
    style.width = typeof size === 'number' ? `${size}px` : size;
    style.height = style.width;
  }

  const classes = ['mm-skeleton', `mm-skeleton--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  if (count <= 1) {
    return <div className={classes} style={style} aria-hidden="true" />;
  }

  return (
    <div className="mm-skeleton-group" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={classes}
          style={{
            ...style,
            // Vary width slightly for text to look natural
            ...(variant === 'text' && i === count - 1 && !width
              ? { width: '70%' }
              : {}),
          }}
        />
      ))}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
