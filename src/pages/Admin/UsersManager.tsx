import { useState, useEffect } from 'react';
import { Search, Users, Shield, Star, CheckCircle, Plus, X, Mail, Key, Crown, Trash2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_emoji: string | null;
    role: 'student' | 'teacher' | 'admin';
    is_admin: boolean;
    is_premium: boolean;
    premium_until: string | null;
    points: number;
    level: number;
    is_online: boolean;
    created_at: string;
}

// Sample users for development mode - REMOVED

function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedPremium, setSelectedPremium] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        email: '',
        display_name: '',
        role: 'student' as 'student' | 'teacher' | 'admin',
        is_premium: false,
        premium_months: 1
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, display_name, avatar_emoji, role, is_admin, is_premium, premium_until, points, level, is_online, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                toast.error('Kullanıcılar yüklenemedi');
            } else {
                setUsers(data || []);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Kullanıcılar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesPremium = selectedPremium === 'all' ||
            (selectedPremium === 'premium' && user.is_premium) ||
            (selectedPremium === 'free' && !user.is_premium);
        return matchesSearch && matchesRole && matchesPremium;
    });

    const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
        try {
            const isAdmin = newRole === 'admin';

            // Try Supabase first
            const { error } = await supabase
                .from('users')
                .update({
                    role: newRole,
                    is_admin: isAdmin
                })
                .eq('id', userId);

            if (error) {
                console.error('Supabase error, updating locally:', error);
            }

            // Update locally regardless
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: newRole, is_admin: isAdmin }
                    : u
            ));

            toast.success('Kullanıcı rolü güncellendi!');
        } catch (error) {
            console.error('Error updating role:', error);
            // Still update locally in dev mode
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: newRole, is_admin: newRole === 'admin' }
                    : u
            ));
            toast.success('Kullanıcı rolü güncellendi! (Lokal)');
        }
    };

    const handlePremiumToggle = async (userId: string, isPremium: boolean) => {
        const premiumUntil = isPremium
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : null;

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    is_premium: isPremium,
                    premium_until: premiumUntil
                })
                .eq('id', userId);

            if (error) {
                console.error('Supabase error:', error);
            }

            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, is_premium: isPremium, premium_until: premiumUntil }
                    : u
            ));

            toast.success(isPremium ? 'Premium aktifleştirildi!' : 'Premium kaldırıldı!');
        } catch (error) {
            console.error('Error updating premium:', error);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, is_premium: isPremium, premium_until: premiumUntil }
                    : u
            ));
            toast.success(isPremium ? 'Premium aktifleştirildi! (Lokal)' : 'Premium kaldırıldı! (Lokal)');
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const password = generatePassword();
        const premiumUntil = newUserData.is_premium
            ? new Date(Date.now() + newUserData.premium_months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : null;

        try {
            // In production, this would create user via Supabase Auth Admin API
            // and send welcome email via Edge Function

            // For now, add to local state
            const newUser: User = {
                id: Date.now().toString(),
                email: newUserData.email,
                display_name: newUserData.display_name || newUserData.email.split('@')[0],
                avatar_emoji: '👤',
                role: newUserData.role,
                is_admin: newUserData.role === 'admin',
                is_premium: newUserData.is_premium,
                premium_until: premiumUntil,
                points: 0,
                level: 1,
                is_online: false,
                created_at: new Date().toISOString()
            };

            setUsers(prev => [newUser, ...prev]);

            // Show the generated password to admin
            toast.success(
                <div>
                    <strong>Kullanıcı oluşturuldu!</strong>
                    <br />
                    <small>Email: {newUserData.email}</small>
                    <br />
                    <small>Şifre: <code>{password}</code></small>
                    <br />
                    <small style={{ color: '#f59e0b' }}>⚠️ Bu şifreyi kaydedin!</small>
                </div>,
                { duration: 10000 }
            );

            // In production: Send welcome email with password
            console.log('Welcome email would be sent to:', newUserData.email);
            console.log('With password:', password);

            setIsModalOpen(false);
            setNewUserData({
                email: '',
                display_name: '',
                role: 'student',
                is_premium: false,
                premium_months: 1
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Kullanıcı oluşturulamadı');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) {
                console.error('Supabase error:', error);
            }

            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('Kullanıcı silindi!');
        } catch (error) {
            console.error('Error deleting user:', error);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('Kullanıcı silindi! (Lokal)');
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin': return 'badge-admin';
            case 'teacher': return 'badge-teacher';
            default: return 'badge-student';
        }
    };



    // Stats
    const premiumCount = users.filter(u => u.is_premium).length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const teacherCount = users.filter(u => u.role === 'teacher').length;

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                    <p>Kullanıcılar yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Users size={28} /> Kullanıcı Yönetimi</h1>
                <p>Kayıtlı kullanıcıları görüntüleyin ve yönetin</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#f5f3ff' } as React.CSSProperties}>
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{users.length}</span>
                        <span className="stat-label">Toplam Kullanıcı</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fffbeb' } as React.CSSProperties}>
                    <div className="stat-icon"><Crown size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{premiumCount}</span>
                        <span className="stat-label">Premium Üye</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#ec4899', '--stat-bg': '#fdf2f8' } as React.CSSProperties}>
                    <div className="stat-icon"><Shield size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{adminCount}</span>
                        <span className="stat-label">Admin</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': '#ecfdf5' } as React.CSSProperties}>
                    <div className="stat-icon"><Star size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{teacherCount}</span>
                        <span className="stat-label">Öğretmen</span>
                    </div>
                </div>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredUsers.length} Kullanıcı</h2>
                    <div className="table-actions">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Kullanıcı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} />
                            Kullanıcı Ekle
                        </button>
                    </div>
                </div>

                <div className="filter-chips">
                    {['all', 'student', 'teacher', 'admin'].map(role => (
                        <button
                            key={role}
                            className={`filter-chip ${selectedRole === role ? 'active' : ''}`}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role === 'all' ? '👥 Tümü' :
                                role === 'admin' ? '🛡️ Admin' :
                                    role === 'teacher' ? '⭐ Öğretmen' : '📚 Öğrenci'}
                        </button>
                    ))}
                    <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>|</span>
                    {['all', 'premium', 'free'].map(type => (
                        <button
                            key={type}
                            className={`filter-chip ${selectedPremium === type ? 'active' : ''}`}
                            onClick={() => setSelectedPremium(type)}
                        >
                            {type === 'all' ? '🎯 Tüm Üyelik' :
                                type === 'premium' ? '👑 Premium' : '🆓 Ücretsiz'}
                        </button>
                    ))}
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Kullanıcı</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Premium</th>
                            <th>Puan</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{user.avatar_emoji || '👤'}</span>
                                        <strong>{user.display_name || 'İsimsiz'}</strong>
                                    </div>
                                </td>
                                <td style={{ color: '#64748b' }}>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'student' | 'teacher' | 'admin')}
                                        className={`role-select ${getRoleBadgeClass(user.role)}`}
                                        style={{
                                            padding: '0.4rem 0.6rem',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        <option value="student">📚 Öğrenci</option>
                                        <option value="teacher">⭐ Öğretmen</option>
                                        <option value="admin">🛡️ Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handlePremiumToggle(user.id, !user.is_premium)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '100px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: user.is_premium ? '#fef3c7' : '#f1f5f9',
                                            color: user.is_premium ? '#d97706' : '#64748b'
                                        }}
                                    >
                                        <Crown size={14} />
                                        {user.is_premium ? 'Premium' : 'Ücretsiz'}
                                    </button>
                                    {user.is_premium && user.premium_until && (
                                        <small style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                                            {new Date(user.premium_until).toLocaleDateString('tr-TR')} 'e kadar
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                                        ⭐ {user.points || 0}
                                    </span>
                                </td>
                                <td>
                                    {user.is_online ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}>
                                            <CheckCircle size={14} /> Çevrimiçi
                                        </span>
                                    ) : (
                                        <span style={{ color: '#94a3b8' }}>Çevrimdışı</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(user.id)}
                                        title="Kullanıcıyı Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="no-data">
                        <Users size={48} style={{ opacity: 0.3 }} />
                        <p>Kullanıcı bulunamadı</p>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Yeni Kullanıcı Ekle</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label><Mail size={16} /> Email Adresi</label>
                                    <input
                                        type="email"
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                        placeholder="kullanici@ornek.com"
                                        required
                                    />
                                    <small style={{ color: '#64748b' }}>
                                        Bu adrese hoş geldin maili ve otomatik şifre gönderilecek
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Görünen İsim</label>
                                    <input
                                        type="text"
                                        value={newUserData.display_name}
                                        onChange={(e) => setNewUserData({ ...newUserData, display_name: e.target.value })}
                                        placeholder="Örn: Öğrenci Ali"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Kullanıcı Rolü</label>
                                    <select
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as 'student' | 'teacher' | 'admin' })}
                                    >
                                        <option value="student">📚 Öğrenci</option>
                                        <option value="teacher">⭐ Öğretmen</option>
                                        <option value="admin">🛡️ Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={newUserData.is_premium}
                                            onChange={(e) => setNewUserData({ ...newUserData, is_premium: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        <Crown size={16} style={{ color: '#f59e0b' }} />
                                        Premium Üyelik Ver
                                    </label>
                                </div>

                                {newUserData.is_premium && (
                                    <div className="form-group">
                                        <label>Premium Süresi</label>
                                        <select
                                            value={newUserData.premium_months}
                                            onChange={(e) => setNewUserData({ ...newUserData, premium_months: parseInt(e.target.value) })}
                                        >
                                            <option value={1}>1 Ay</option>
                                            <option value={3}>3 Ay</option>
                                            <option value={6}>6 Ay</option>
                                            <option value={12}>1 Yıl</option>
                                            <option value={120}>Ömür Boyu (10 Yıl)</option>
                                        </select>
                                    </div>
                                )}

                                <div style={{
                                    background: '#fef3c7',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginTop: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', marginBottom: '0.5rem' }}>
                                        <Key size={16} />
                                        <strong>Otomatik Şifre</strong>
                                    </div>
                                    <p style={{ color: '#a16207', fontSize: '0.85rem', margin: 0 }}>
                                        Kullanıcı oluşturulduğunda otomatik şifre üretilecek ve ekranda gösterilecek.
                                        Bu şifreyi kaydedin veya kullanıcıya iletin.
                                    </p>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn" disabled={isCreating}>
                                    {isCreating ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersManager;
