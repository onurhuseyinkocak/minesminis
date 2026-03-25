import React from 'react';
import './ProgressBar.css';

export type ProgressBarVariant = 'default' | 'success' | 'warning';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = false,
  className = '',
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  const classes = [
    'mm-progress',
    `mm-progress--${variant}`,
    `mm-progress--${size}`,
    animated && 'mm-progress--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${Math.round(clampedValue)}%`}
    >
      <div className="mm-progress__track">
        <div
          className="mm-progress__fill"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="mm-progress__label">{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
