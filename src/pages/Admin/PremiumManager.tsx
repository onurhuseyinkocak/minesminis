import { useState, useEffect } from 'react';
import { Crown, Users, CreditCard, TrendingUp, Calendar, Gift, Trash2, Plus, X, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import './PremiumManager.css';

interface PremiumUser {
    id: string;
    email: string;
    display_name: string;
    settings: Record<string, unknown>;
    premium_plan: string;
    created_at: string;
}

// Helper: read premium info from settings JSONB
const isPremium = (u: PremiumUser) => !!(u.settings?.is_premium);
const getPremiumUntil = (u: PremiumUser): string | null => (u.settings?.premium_until as string) || null;

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
                .select('id, email, display_name, settings, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                toast.error('Veritabanı hatası: ' + (error.message || 'Bilinmeyen hata'));
            } else {
                const allUsers = (data || []).map(u => {
                    const settings = (u.settings || {}) as Record<string, unknown>;
                    const planName = (settings.premium_plan as string) || 'Yıllık';
                    return { ...u, settings, premium_plan: planName };
                });
                setPremiumUsers(allUsers.filter(u => isPremium(u)));
            }
        } catch {
            toast.error('Premium kullanıcılar yüklenemedi');
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

        const pu = getPremiumUntil(user);
        const currentDate = pu ? new Date(pu) : new Date();
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + months);
        const newPremiumUntil = newDate.toISOString().split('T')[0];

        try {
            const newSettings = { ...user.settings, premium_until: newPremiumUntil };
            const { error } = await supabase
                .from('users')
                .update({ settings: newSettings })
                .eq('id', userId);

            if (error) {
                toast.error('Premium süre uzatılamadı: ' + error.message);
                return;
            }

            setPremiumUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, settings: { ...u.settings, premium_until: newPremiumUntil } } : u
            ));
            toast.success(`Premium ${months} ay uzatıldı!`);
        } catch {
            toast.error('Premium süre uzatılamadı');
        }
    };

    const handleRevokePremium = async (userId: string) => {
        if (!confirm('Bu kullanıcının premium üyeliğini iptal etmek istediğinize emin misiniz?')) return;

        try {
            const revokedUser = premiumUsers.find(u => u.id === userId);
            const newSettings = { ...(revokedUser?.settings || {}), is_premium: false, premium_until: null };
            const { error } = await supabase
                .from('users')
                .update({ settings: newSettings })
                .eq('id', userId);

            if (error) {
                toast.error('Premium iptal edilemedi: ' + error.message);
                return;
            }

            setPremiumUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('Premium üyelik iptal edildi');
        } catch {
            toast.error('Premium iptal edilemedi');
        }
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

    // Stats calculations — per-user plan-based revenue estimation
    const planPriceMap: Record<string, number> = {
        'Aylık Plan': 49.99,
        'Aylık': 49.99,
        '3 Aylık Plan': 129.99,
        '3 Aylık': 129.99,
        'Yıllık Plan': 399.99,
        'Yıllık': 399.99,
        'Ömür Boyu': 999.99,
    };
    const totalRevenue = premiumUsers.reduce((sum, u) => sum + (planPriceMap[u.premium_plan] ?? 399.99), 0);
    const lifetimeMembers = premiumUsers.filter(u => u.premium_plan === 'Ömür Boyu').length;
    const expiringThisMonth = premiumUsers.filter(u => {
        const pu = getPremiumUntil(u);
        if (!pu) return false;
        const expDate = new Date(pu);
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
            <div className="stats-grid adm-stats-mb">
                <div className="stat-card adm-stat-amber">
                    <div className="stat-icon"><Crown size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{premiumUsers.length}</span>
                        <span className="stat-label">Premium Üye</span>
                    </div>
                </div>
                <div className="stat-card adm-stat-green">
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">₺{totalRevenue.toLocaleString()}</span>
                        <span className="stat-label">Tahmini Gelir</span>
                    </div>
                </div>
                <div className="stat-card adm-stat-violet">
                    <div className="stat-icon"><Gift size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{lifetimeMembers}</span>
                        <span className="stat-label">Ömür Boyu Üye</span>
                    </div>
                </div>
                <div className="stat-card adm-stat-red">
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{expiringThisMonth}</span>
                        <span className="stat-label">Bu Ay Sona Eren</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="filter-chips adm-tabs">
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
                            <div className="adm-search-wrap">
                                <Search size={18} className="adm-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Üye ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input adm-search-input"
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
                                const pu = getPremiumUntil(user);
                                const daysRemaining = pu
                                    ? Math.ceil((new Date(pu).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                    : 0;
                                const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;
                                const isExpired = daysRemaining <= 0;

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="adm-user-row">
                                                {(user.settings?.avatar_emoji as string) ? (
                                                    <span className="adm-avatar-emoji">{user.settings.avatar_emoji as string}</span>
                                                ) : (
                                                    <div className="adm-avatar-circle">
                                                        {(user.display_name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <strong>{user.display_name}</strong>
                                            </div>
                                        </td>
                                        <td className="adm-cell-muted">{user.email}</td>
                                        <td>
                                            <span className="adm-badge-premium">
                                                {user.premium_plan}
                                            </span>
                                        </td>
                                        <td>{getPremiumUntil(user) ? new Date(getPremiumUntil(user)!).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>
                                            <span className={isExpired ? 'adm-expiry-expired' : isExpiringSoon ? 'adm-expiry-soon' : 'adm-expiry-ok'}>
                                                {isExpired ? 'Süresi Doldu' : `${daysRemaining} gün`}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="adm-action-row">
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleExtendPremium(user.id, parseInt(e.target.value));
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    className="adm-extend-select"
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
                        <button type="button" className="add-btn" onClick={() => {
                            setEditingPlan(null);
                            setPlanFormData({ name: '', price: 0, duration_months: 1, features: '', is_popular: false });
                            setIsModalOpen(true);
                        }}>
                            <Plus size={18} />
                            Plan Ekle
                        </button>
                    </div>

                    <div className="adm-plans-grid">
                        {plans.map(plan => (
                            <div
                                key={plan.id}
                                className={`adm-plan-card${plan.is_popular ? ' adm-plan-card--popular' : ''}`}
                            >
                                {plan.is_popular && (
                                    <span className="adm-plan-popular-badge">POPÜLER</span>
                                )}
                                <h3 className="adm-plan-title">{plan.name}</h3>
                                <p className="adm-plan-price">
                                    ₺{plan.price}
                                    <span className="adm-plan-price-unit">
                                        /{plan.duration_months === 1 ? 'ay' : plan.duration_months === 12 ? 'yıl' : `${plan.duration_months} ay`}
                                    </span>
                                </p>
                                <ul className="adm-plan-features">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="adm-plan-feature">
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="adm-plan-actions">
                                    <button
                                        className="edit-btn adm-plan-edit-btn"
                                        onClick={() => openEditPlanModal(plan)}
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
                            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
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
                                    <label className="adm-check-label" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={planFormData.is_popular}
                                            onChange={(e) => setPlanFormData({ ...planFormData, is_popular: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        Popüler Plan Olarak İşaretle
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
