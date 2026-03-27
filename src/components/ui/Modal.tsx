import React, { useEffect, useCallback, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Modal.css';

/**
 * Traps keyboard focus inside a container element.
 * Returns a keydown handler that should be attached to the container.
 */
function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isActive || e.key !== 'Tab' || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [containerRef, isActive]
  );

  return handleKeyDown;
}

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
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const handleFocusTrap = useFocusTrap(modalRef, isOpen);

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

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="mm-modal-overlay mm-modal-overlay--open"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`mm-modal mm-modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={handleFocusTrap}
      >
        <div className="mm-modal__header">
          {title && <h2 className="mm-modal__title">{title}</h2>}
          <button
            className="mm-modal__close"
            onClick={onClose}
            aria-label={t('common.close')}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mm-modal__body">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
