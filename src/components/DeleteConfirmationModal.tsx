import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Gönderiyi Sil',
  message = 'Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="delete-modal-overlay"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="delete-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">🗑️</div>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="delete-modal-actions">
              <button className="cancel-btn" onClick={onCancel}>
                İptal
              </button>
              <button className="confirm-btn" onClick={onConfirm}>
                Evet, Sil
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;