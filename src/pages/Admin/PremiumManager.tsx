import { useState, useEffect } from 'react';
import { Crown, Users, CreditCard, TrendingUp, Calendar, Gift, Trash2, Plus, X, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

interface PremiumUser {
    id: string;
    email: string;
    display_name: string;
    avatar_emoji: string | null;
    is_premium: boolean;
    premium_until: string | null;
    premium_plan: string;
    created_at: string;
}

interface PremiumPlan {
    id: string;
    name: string;
    price: number;
    duration_months: number;
    features: string[];
    is_popular: boolean;
}

// Sample data for development - REMOVED

const defaultPlans: PremiumPlan[] = [
    {
        id: 'monthly',
        name: 'Aylık Plan',
        price: 49.99,
        duration_months: 1,
        features: ['Tüm oyunlara erişim', 'Reklamsız deneyim', 'İlerleme takibi'],
        is_popular: false
    },
    {
        id: 'quarterly',
        name: '3 Aylık Plan',
        price: 129.99,
        duration_months: 3,
        features: ['Tüm oyunlara erişim', 'Reklamsız deneyim', 'İlerleme takibi', 'Özel rozetler'],
        is_popular: false
    },
    {
        id: 'yearly',
        name: 'Yıllık Plan',
        price: 399.99,
        duration_months: 12,
        features: ['Tüm oyunlara erişim', 'Reklamsız deneyim', 'İlerleme takibi', 'Özel rozetler', 'Öncelikli destek'],
        is_popular: true
    },
    {
        id: 'lifetime',
        name: 'Ömür Boyu',
        price: 999.99,
        duration_months: 120,
        features: ['Sınırsız erişim', 'Tüm özellikler', 'Yeni içerikler', 'VIP destek', 'Aile paylaşımı'],
        is_popular: false
    }
];

function PremiumManager() {
    const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
    const [plans, setPlans] = useState<PremiumPlan[]>(defaultPlans);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'plans' | 'stats'>('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PremiumPlan | null>(null);
    const [planFormData, setPlanFormData] = useState({
        name: '',
        price: 0,
        duration_months: 1,
        features: '',
        is_popular: false
    });

    useEffect(() => {
        loadPremiumUsers();
    }, []);

    const loadPremiumUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, display_name, avatar_emoji, is_premium, premium_until, created_at')
                .eq('is_premium', true)
                .order('premium_until', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
            } else {
                setPremiumUsers(data?.map(u => ({ ...u, premium_plan: 'Yıllık' })) || []);
            }
        } catch (error) {
            console.error('Error loading premium users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = premiumUsers.filter(user =>
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExtendPremium = async (userId: string, months: number) => {
        const user = premiumUsers.find(u => u.id === userId);
        if (!user) return;

        const currentDate = user.premium_until ? new Date(user.premium_until) : new Date();
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + months);
        const newPremiumUntil = newDate.toISOString().split('T')[0];

        try {
            await supabase
                .from('users')
                .update({ premium_until: newPremiumUntil })
                .eq('id', userId);
        } catch (error) {
            console.error('Error extending premium:', error);
        }

        setPremiumUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, premium_until: newPremiumUntil } : u
        ));

        toast.success(`Premium ${months} ay uzatıldı!`);
    };

    const handleRevokePremium = async (userId: string) => {
        if (!confirm('Bu kullanıcının premium üyeliğini iptal etmek istediğinize emin misiniz?')) return;

        try {
            await supabase
                .from('users')
                .update({ is_premium: false, premium_until: null })
                .eq('id', userId);
        } catch (error) {
            console.error('Error revoking premium:', error);
        }

        setPremiumUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('Premium üyelik iptal edildi');
    };

    const handleSavePlan = (e: React.FormEvent) => {
        e.preventDefault();

        const newPlan: PremiumPlan = {
            id: editingPlan?.id || Date.now().toString(),
            name: planFormData.name,
            price: planFormData.price,
            duration_months: planFormData.duration_months,
            features: planFormData.features.split('\n').filter(f => f.trim()),
            is_popular: planFormData.is_popular
        };

        if (editingPlan) {
            setPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
            toast.success('Plan güncellendi!');
        } else {
            setPlans(prev => [...prev, newPlan]);
            toast.success('Yeni plan eklendi!');
        }

        setIsModalOpen(false);
        setEditingPlan(null);
        setPlanFormData({ name: '', price: 0, duration_months: 1, features: '', is_popular: false });
    };

    const openEditPlanModal = (plan: PremiumPlan) => {
        setEditingPlan(plan);
        setPlanFormData({
            name: plan.name,
            price: plan.price,
            duration_months: plan.duration_months,
            features: plan.features.join('\n'),
            is_popular: plan.is_popular
        });
        setIsModalOpen(true);
    };

    const handleDeletePlan = (planId: string) => {
        if (!confirm('Bu planı silmek istediğinize emin misiniz?')) return;
        setPlans(prev => prev.filter(p => p.id !== planId));
        toast.success('Plan silindi!');
    };

    // Stats calculations
    const totalRevenue = premiumUsers.length * 399.99; // Estimate
    const lifetimeMembers = premiumUsers.filter(u => u.premium_plan === 'Ömür Boyu').length;
    const expiringThisMonth = premiumUsers.filter(u => {
        if (!u.premium_until) return false;
        const expDate = new Date(u.premium_until);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }).length;

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                    <p>Premium veriler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Crown size={28} style={{ color: '#f59e0b' }} /> Premium Yönetimi</h1>
                <p>Premium üyelikleri ve planları yönetin</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fffbeb' } as React.CSSProperties}>
                    <div className="stat-icon"><Crown size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{premiumUsers.length}</span>
                        <span className="stat-label">Premium Üye</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': '#ecfdf5' } as React.CSSProperties}>
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">₺{totalRevenue.toLocaleString()}</span>
                        <span className="stat-label">Tahmini Gelir</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#f5f3ff' } as React.CSSProperties}>
                    <div className="stat-icon"><Gift size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{lifetimeMembers}</span>
                        <span className="stat-label">Ömür Boyu Üye</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#ef4444', '--stat-bg': '#fef2f2' } as React.CSSProperties}>
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{expiringThisMonth}</span>
                        <span className="stat-label">Bu Ay Sona Eren</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="filter-chips" style={{ marginBottom: '1rem' }}>
                <button
                    className={`filter-chip ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={16} /> Premium Üyeler
                </button>
                <button
                    className={`filter-chip ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                >
                    <CreditCard size={16} /> Planlar
                </button>
            </div>

            {/* Premium Users Tab */}
            {activeTab === 'users' && (
                <div className="data-table-container">
                    <div className="table-header">
                        <h2>{filteredUsers.length} Premium Üye</h2>
                        <div className="table-actions">
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Üye ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Üye</th>
                                <th>Email</th>
                                <th>Plan</th>
                                <th>Bitiş Tarihi</th>
                                <th>Kalan Süre</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => {
                                const daysRemaining = user.premium_until
                                    ? Math.ceil((new Date(user.premium_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                    : 0;
                                const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;
                                const isExpired = daysRemaining <= 0;

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{user.avatar_emoji || '👤'}</span>
                                                <strong>{user.display_name}</strong>
                                            </div>
                                        </td>
                                        <td style={{ color: '#64748b' }}>{user.email}</td>
                                        <td>
                                            <span style={{
                                                background: '#fef3c7',
                                                color: '#d97706',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                👑 {user.premium_plan}
                                            </span>
                                        </td>
                                        <td>{user.premium_until ? new Date(user.premium_until).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>
                                            <span style={{
                                                color: isExpired ? '#ef4444' : isExpiringSoon ? '#f59e0b' : '#22c55e',
                                                fontWeight: 600
                                            }}>
                                                {isExpired ? 'Süresi Doldu' : `${daysRemaining} gün`}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleExtendPremium(user.id, parseInt(e.target.value));
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '0.4rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e2e8f0',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Uzat</option>
                                                    <option value="1">+1 Ay</option>
                                                    <option value="3">+3 Ay</option>
                                                    <option value="6">+6 Ay</option>
                                                    <option value="12">+1 Yıl</option>
                                                </select>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleRevokePremium(user.id)}
                                                    title="Premium İptal"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="no-data">
                            <Crown size={48} style={{ opacity: 0.3 }} />
                            <p>Premium üye bulunamadı</p>
                        </div>
                    )}
                </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className="data-table-container">
                    <div className="table-header">
                        <h2>Premium Planlar</h2>
                        <button className="add-btn" onClick={() => {
                            setEditingPlan(null);
                            setPlanFormData({ name: '', price: 0, duration_months: 1, features: '', is_popular: false });
                            setIsModalOpen(true);
                        }}>
                            <Plus size={18} />
                            Plan Ekle
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {plans.map(plan => (
                            <div
                                key={plan.id}
                                style={{
                                    background: plan.is_popular ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'white',
                                    border: plan.is_popular ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    position: 'relative'
                                }}
                            >
                                {plan.is_popular && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '10px',
                                        background: '#f59e0b',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '100px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700
                                    }}>
                                        ⭐ POPÜLER
                                    </span>
                                )}
                                <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b' }}>{plan.name}</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#6366f1', margin: '0.5rem 0' }}>
                                    ₺{plan.price}
                                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 400 }}>
                                        /{plan.duration_months === 1 ? 'ay' : plan.duration_months === 12 ? 'yıl' : `${plan.duration_months} ay`}
                                    </span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} style={{ padding: '0.25rem 0', color: '#475569', fontSize: '0.875rem' }}>
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        className="edit-btn"
                                        onClick={() => openEditPlanModal(plan)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeletePlan(plan.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Plan Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePlan}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Plan Adı</label>
                                    <input
                                        type="text"
                                        value={planFormData.name}
                                        onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                                        placeholder="Örn: Yıllık Plan"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={planFormData.price}
                                        onChange={(e) => setPlanFormData({ ...planFormData, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Süre (Ay)</label>
                                    <select
                                        value={planFormData.duration_months}
                                        onChange={(e) => setPlanFormData({ ...planFormData, duration_months: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1 Ay</option>
                                        <option value={3}>3 Ay</option>
                                        <option value={6}>6 Ay</option>
                                        <option value={12}>1 Yıl</option>
                                        <option value={120}>Ömür Boyu (10 Yıl)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Özellikler (Her satıra bir özellik)</label>
                                    <textarea
                                        value={planFormData.features}
                                        onChange={(e) => setPlanFormData({ ...planFormData, features: e.target.value })}
                                        placeholder="Tüm oyunlara erişim&#10;Reklamsız deneyim&#10;..."
                                        rows={4}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={planFormData.is_popular}
                                            onChange={(e) => setPlanFormData({ ...planFormData, is_popular: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        ⭐ Popüler Plan Olarak İşaretle
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingPlan ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PremiumManager;
