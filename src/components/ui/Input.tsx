import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import './Input.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  /** Accessible label for the right-icon button (required when onRightIconClick is provided) */
  rightIconAriaLabel?: string;
  size?: InputSize;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      rightIcon,
      onRightIconClick,
      rightIconAriaLabel,
      size = 'lg',
      disabled = false,
      className = '',
      id: externalId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const inputClasses = [
      'mm-input',
      `mm-input--${size}`,
      icon && 'mm-input--has-icon',
      rightIcon && 'mm-input--has-right-icon',
      error && 'mm-input--error',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`mm-input-wrapper ${className}`}>
        {label && (
          <label className="mm-input-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className="mm-input-container">
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              [errorId, helperId].filter(Boolean).join(' ') || undefined
            }
            {...rest}
          />
          {icon && <span className="mm-input-icon" aria-hidden="true">{icon}</span>}
          {rightIcon && onRightIconClick ? (
            <button
              type="button"
              className="mm-input-icon mm-input-icon--right mm-input-icon--btn"
              onClick={onRightIconClick}
              aria-label={rightIconAriaLabel ?? 'Toggle input'}
            >
              {rightIcon}
            </button>
          ) : rightIcon ? (
            <span className="mm-input-icon mm-input-icon--right" aria-hidden="true">{rightIcon}</span>
          ) : null}
        </div>
        {error && (
          <span className="mm-input-error-text" id={errorId} role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="mm-input-helper-text" id={helperId}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
