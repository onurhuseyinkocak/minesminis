import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../services/userService';
import './ProfileSetupModal.css';

interface ProfileSetupModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ user, isOpen, onClose, onProfileUpdated }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert('Lütfen isim ve soyisim giriniz.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createOrUpdateUserProfile(user, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName.trim() || `${firstName.trim()} ${lastName.trim()}`,
      });
      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-content"
          >
            <h2>👋 Profilini Tamamla</h2>
            <p>Discover bölümünde kullanmak için profil bilgilerini tamamla</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>İsim *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="İsmin"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Soyisim *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyismin"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Görünen İsim (Opsiyonel)</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={`${firstName} ${lastName}`.trim() || "Görünen ismin"}
                />
                <small>Bu isim Discover'da görünecek</small>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Profilimi Tamamla'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSetupModal;