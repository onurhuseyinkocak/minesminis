import React, { useEffect, useCallback, useRef, ReactNode } from 'react';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.classList.add('mm-modal-open');
      document.addEventListener('keydown', handleEscape);
      // Focus the modal after open
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
    } else {
      document.body.classList.remove('mm-modal-open');
      document.removeEventListener('keydown', handleEscape);
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.classList.remove('mm-modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`mm-modal-overlay ${isOpen ? 'mm-modal-overlay--open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={`mm-modal mm-modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
                <div className="mm-modal__header">
            {title && <h2 className="mm-modal__title">{title}</h2>}
            <button
              className="mm-modal__close"
              onClick={onClose}
              aria-label="Close dialog"
              type="button"
            >
              &#x2715;
            </button>
          </div>
        <div className="mm-modal__body">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
