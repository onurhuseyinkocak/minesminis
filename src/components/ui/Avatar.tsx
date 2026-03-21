import React, { useState } from 'react';
import './Avatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  const classes = [
    'mm-avatar',
    `mm-avatar--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="img" aria-label={alt || fallback || 'Avatar'}>
      {showImage ? (
        <img
          className="mm-avatar__image"
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="mm-avatar__fallback" aria-hidden="true">
          {fallback || '?'}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
