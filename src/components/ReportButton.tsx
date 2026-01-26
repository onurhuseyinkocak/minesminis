import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Send, X, Bug } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ReportButton.css';

const ReportButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [report, setReport] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!report.trim()) {
            toast.error('Lütfen bir rapor detayı girin.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('reports')
                .insert({
                    user_id: user?.id || null,
                    page_url: window.location.href,
                    content: report,
                    status: 'open',
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Raporunuz başarıyla gönderildi. Teşekkürler! 🛡️');
            setReport('');
            setIsOpen(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            // Even if table doesn't exist, we fallback to a simulated success for dev experience
            // if it's a "table not found" error. But let's assume it works.
            toast.error('Rapor gönderilemedi. Lütfen sonra tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Blinking Report Button */}
            <motion.button
                className="report-fab"
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Sorun Bildir"
            >
                <motion.div
                    className="report-dot"
                    animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <Bug size={18} className="report-icon" />
            </motion.button>

            {/* Report Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="report-modal-overlay" onClick={() => setIsOpen(false)}>
                        <motion.div
                            className="report-modal"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        >
                            <div className="report-modal-header">
                                <div className="report-header-title">
                                    <AlertCircle size={20} className="header-icon" />
                                    <h3>Sorun Bildir</h3>
                                </div>
                                <button className="close-btn" onClick={() => setIsOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="report-form">
                                <p className="report-info">
                                    Karşılaştığın sorunu kısaca anlatır mısın? 🐻
                                </p>
                                <div className="page-info">
                                    <span className="info-label">Sayfa:</span>
                                    <code className="info-value">{location.pathname}</code>
                                </div>
                                <textarea
                                    value={report}
                                    onChange={(e) => setReport(e.target.value)}
                                    placeholder="Neler oluyor?..."
                                    className="report-textarea"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="submit-report-btn"
                                    disabled={isSubmitting || !report.trim()}
                                >
                                    {isSubmitting ? (
                                        <div className="spinner-small" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Gönder</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ReportButton;
