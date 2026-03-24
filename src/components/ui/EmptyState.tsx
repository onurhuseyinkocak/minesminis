import React, { ReactNode } from 'react';
import LottieCharacter from '../LottieCharacter';
import './EmptyState.css';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  mimiMessage?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  mimiMessage,
  className = '',
}) => {
  return (
    <div className={`mm-empty-state ${className}`}>
      {icon && (
        <div className="mm-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="mm-empty-state__title">{title}</h3>
      {description && (
        <p className="mm-empty-state__description">{description}</p>
      )}
      {mimiMessage && (
        <div className="mm-empty-state__mimi" role="status">
          <span aria-hidden="true"><LottieCharacter state="happy" size={24} /></span>
          <span>{mimiMessage}</span>
        </div>
      )}
      {action && <div className="mm-empty-state__action">{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
