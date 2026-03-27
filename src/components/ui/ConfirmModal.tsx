/**
 * ConfirmModal
 * Reusable confirmation dialog — replaces all window.confirm() calls.
 * Supports danger/warning/primary variants, Escape to cancel, backdrop click to cancel.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading = false,
}) => {
  const { t } = useLanguage();

  const resolvedCancelLabel = cancelLabel ?? t('common.cancel');
  const resolvedConfirmLabel = confirmLabel ?? t('common.confirm');

  const variantClass =
    variant === 'danger'
      ? 'confirm-modal__confirm-btn--danger'
      : variant === 'warning'
      ? 'confirm-modal__confirm-btn--warning'
      : 'confirm-modal__confirm-btn--primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="confirm-modal__body">
        <div className="confirm-modal__icon-wrap" data-variant={variant}>
          <AlertTriangle size={28} />
        </div>
        <h3 className="confirm-modal__title">{title}</h3>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            {resolvedCancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal__confirm-btn ${variantClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('common.processing') : resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmModal.displayName = 'ConfirmModal';
