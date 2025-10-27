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
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    'English Grammar',
    'Vocabulary',
    'Reading',
    'Writing',
    'Speaking',
    'Listening',
    'Pronunciation',
  ];

  const gradeOptions = [
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];

  const toggleSubject = (subject: string) => {
    setSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert('Please enter your display name.');
      return;
    }

    if (role === 'student' && !grade) {
      alert('Please select your grade level.');
      return;
    }

    if (role === 'teacher' && subjects.length === 0) {
      alert('Please select at least one subject you teach.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createOrUpdateUserProfile(user, {
        role,
        displayName: displayName.trim(),
        grade: role === 'student' ? grade : undefined,
        subjects: role === 'teacher' ? subjects : undefined,
        bio: bio.trim(),
      });
      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error creating profile. Please try again.');
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
            <h2>Welcome! Complete Your Profile</h2>
            <p>Let's set up your account to get started</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>I am a *</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                    onClick={() => setRole('teacher')}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should we call you?"
                  required
                />
              </div>

              {role === 'student' && (
                <div className="form-group">
                  <label>Grade Level *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                  >
                    <option value="">Select your grade</option>
                    {gradeOptions.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}

              {role === 'teacher' && (
                <div className="form-group">
                  <label>Subjects You Teach *</label>
                  <div className="subjects-grid">
                    {subjectOptions.map(subject => (
                      <button
                        key={subject}
                        type="button"
                        className={`subject-chip ${subjects.includes(subject) ? 'selected' : ''}`}
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Bio (Optional)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting || !displayName.trim()}
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
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