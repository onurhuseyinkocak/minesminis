import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Search, Users, Shield, Star, CheckCircle, Plus, X, Mail, Key, Crown,
    Trash2, AlertTriangle, Ban, ChevronLeft, ChevronRight, Eye,
    ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import './UsersManager.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
    loading?: boolean;
    children?: React.ReactNode;
}
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmVariant = 'primary', loading, children }: ConfirmModalProps) {
    if (!isOpen) return null;
    const btnClass = confirmVariant === 'danger' ? 'confirm-btn-danger' : confirmVariant === 'warning' ? 'confirm-btn-warning' : 'confirm-btn-primary';
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal confirm-modal um-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <div className="confirm-modal-icon">
                        <AlertTriangle size={28} />
                    </div>
                    <h3>{title}</h3>
                    <p>{message}</p>
                    {children}
                </div>
                <div className="modal-footer um-modal-footer">
                    <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Iptal</button>
                    <button type="button" className={`save-btn ${btnClass}`} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Isleniyor...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

type DbRole = 'student' | 'teacher' | 'parent';
type DisplayRole = 'student' | 'teacher' | 'admin';

interface User {
    id: string;
    email: string;
    display_name: string;
    settings: Record<string, unknown>;
    role: DbRole;
    points: number;
    level: number;
    is_online: boolean;
    created_at: string;
}

type SortField = 'display_name' | 'email' | 'role' | 'level' | 'points' | 'created_at';
type SortDirection = 'asc' | 'desc';

// Helper: read premium/admin/ban info from settings JSONB
const isUserPremium = (u: User): boolean => !!(u.settings?.is_premium);
const isUserAdmin = (u: User): boolean => !!(u.settings?.is_admin);
const isUserBanned = (u: User): boolean => !!(u.settings?.is_banned);
const getUserPremiumUntil = (u: User): string | null => (u.settings?.premium_until as string) || null;

const getDisplayRole = (u: User): DisplayRole => {
    if (isUserAdmin(u)) return 'admin';
    if (u.role === 'teacher') return 'teacher';
    return 'student';
};

const ITEMS_PER_PAGE = 20;

function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedPremium, setSelectedPremium] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newUserData, setNewUserData] = useState({
        email: '',
        display_name: '',
        role: 'student' as DisplayRole,
        is_premium: false,
        premium_months: 1
    });
    const [isCreating, setIsCreating] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        type: 'premium' | 'role' | 'delete' | 'ban';
        user: User;
        newRole?: DisplayRole;
        newPremium?: boolean;
        newBanned?: boolean;
    } | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [premiumDurationMonths, setPremiumDurationMonths] = useState(1);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, display_name, settings, role, points, level, is_online, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                toast.error('Kullanicilar yuklenemedi');
                return;
            }
            setUsers((data || []).map(u => ({ ...u, settings: (u.settings || {}) as Record<string, unknown> })));
        } catch {
            toast.error('Kullanicilar yuklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = useCallback((field: SortField) => {
        setSortDirection(prev => sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc');
        setSortField(field);
    }, [sortField]);

    const filteredUsers = useMemo(() => {
        const filtered = users.filter(user => {
            const matchesSearch =
                user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const displayRole = getDisplayRole(user);
            const matchesRole = selectedRole === 'all' || displayRole === selectedRole;
            const matchesPremium = selectedPremium === 'all' ||
                (selectedPremium === 'premium' && isUserPremium(user)) ||
                (selectedPremium === 'free' && !isUserPremium(user));
            return matchesSearch && matchesRole && matchesPremium;
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'display_name':
                    comparison = (a.display_name || '').localeCompare(b.display_name || '');
                    break;
                case 'email':
                    comparison = (a.email || '').localeCompare(b.email || '');
                    break;
                case 'role':
                    comparison = getDisplayRole(a).localeCompare(getDisplayRole(b));
                    break;
                case 'level':
                    comparison = (a.level || 0) - (b.level || 0);
                    break;
                case 'points':
                    comparison = (a.points || 0) - (b.points || 0);
                    break;
                case 'created_at':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [users, searchTerm, selectedRole, selectedPremium, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedRole, selectedPremium]);

    const handleRoleChange = async (userId: string, newRole: DisplayRole) => {
        setConfirmLoading(true);
        try {
            const isAdmin = newRole === 'admin';
            const targetUser = users.find(u => u.id === userId);
            const newSettings = { ...(targetUser?.settings || {}), is_admin: isAdmin };
            // DB role column only accepts 'student' | 'teacher' | 'parent'; admin is a settings flag
            const dbRole: DbRole = isAdmin ? 'teacher' : (newRole as DbRole);

            const { error } = await supabase
                .from('users')
                .update({
                    role: dbRole,
                    settings: newSettings
                })
                .eq('id', userId);

            if (error) {
                toast.error('Rol guncellenemedi');
                return;
            }

            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: dbRole, settings: { ...u.settings, is_admin: isAdmin } }
                    : u
            ));

            toast.success('Kullanici rolu guncellendi!');
            setConfirmState(null);
        } catch {
            toast.error('Rol guncellenemedi');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handlePremiumToggle = async (userId: string, premium: boolean) => {
        setConfirmLoading(true);
        const premiumUntil = premium
            ? new Date(Date.now() + premiumDurationMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : null;

        const targetUser = users.find(u => u.id === userId);
        const newSettings = { ...(targetUser?.settings || {}), is_premium: premium, premium_until: premiumUntil };

        try {
            const { error } = await supabase
                .from('users')
                .update({ settings: newSettings })
                .eq('id', userId);

            if (error) {
                toast.error('Premium durumu guncellenemedi');
                return;
            }

            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, settings: { ...u.settings, is_premium: premium, premium_until: premiumUntil } }
                    : u
            ));

            toast.success(premium ? 'Premium aktiflestirildi!' : 'Premium kaldirildi!');
            setConfirmState(null);
        } catch {
            toast.error('Premium durumu guncellenemedi');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleBanToggle = async (userId: string, banned: boolean) => {
        setConfirmLoading(true);
        const targetUser = users.find(u => u.id === userId);
        const newSettings = { ...(targetUser?.settings || {}), is_banned: banned, banned_at: banned ? new Date().toISOString() : null };

        try {
            const { error } = await supabase
                .from('users')
                .update({ settings: newSettings })
                .eq('id', userId);

            if (error) {
                toast.error(`Kullanici ${banned ? 'banlanamadi' : 'ban kaldirilamadi'}`);
                return;
            }

            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, settings: newSettings }
                    : u
            ));

            toast.success(banned ? 'Kullanici banlandi!' : 'Kullanici bani kaldirildi!');
            setConfirmState(null);
        } catch {
            toast.error(`Kullanici ${banned ? 'banlanamadi' : 'ban kaldirilamadi'}`);
        } finally {
            setConfirmLoading(false);
        }
    };

    const generatePassword = (): string => {
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
            const newId = crypto.randomUUID();
            const now = new Date().toISOString();
            const isAdmin = newUserData.role === 'admin';
            const settings: Record<string, unknown> = {
                is_admin: isAdmin,
                is_premium: newUserData.is_premium,
                premium_until: premiumUntil,
            };
            // DB role column only accepts 'student' | 'teacher' | 'parent'
            const dbRole: DbRole = isAdmin ? 'teacher' : (newUserData.role as DbRole);

            const payload = {
                id: newId,
                email: newUserData.email,
                display_name: newUserData.display_name || newUserData.email.split('@')[0],
                settings,
                role: dbRole,
                points: 0,
                level: 1,
                is_online: false,
                created_at: now,
            };

            const { data: insertedData, error: insertError } = await supabase
                .from('users')
                .insert(payload)
                .select()
                .single();

            if (insertError) {
                toast.error('Kullanici olusturulamadi');
                return;
            }

            const newUser: User = insertedData
                ? { ...insertedData, settings: (insertedData.settings || {}) as Record<string, unknown> }
                : { ...payload, settings };

            setUsers(prev => [newUser, ...prev]);

            // Show the generated password to admin
            toast.success(
                <div>
                    <strong>Kullanici olusturuldu!</strong>
                    <br />
                    <small>Email: {newUserData.email}</small>
                    <br />
                    <small>Sifre: <code>{password}</code></small>
                    <br />
                    <small className="um-toast-warning">Bu sifreyi kaydedin!</small>
                </div>,
                { duration: 10000 }
            );

            setIsModalOpen(false);
            setNewUserData({
                email: '',
                display_name: '',
                role: 'student',
                is_premium: false,
                premium_months: 1
            });
        } catch {
            toast.error('Kullanici olusturulamadi');
        } finally {
            setIsCreating(false);
        }
    };

    const executeDeleteUser = async () => {
        if (!confirmState || confirmState.type !== 'delete') return;
        const userId = confirmState.user.id;
        setConfirmLoading(true);
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) {
                toast.error('Kullanici silinemedi');
                return;
            }

            setUsers(prev => prev.filter(u => u.id !== userId));
            if (selectedUser?.id === userId) setSelectedUser(null);
            toast.success('Kullanici silindi!');
            setConfirmState(null);
        } catch {
            toast.error('Kullanici silinemedi');
        } finally {
            setConfirmLoading(false);
        }
    };

    const getRoleBadgeClass = (role: DisplayRole): string => {
        switch (role) {
            case 'admin': return 'badge-admin';
            case 'teacher': return 'badge-teacher';
            default: return 'badge-student';
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="um-sort-icon-inactive" />;
        return sortDirection === 'asc'
            ? <ArrowUp size={12} className="um-sort-icon-active" />
            : <ArrowDown size={12} className="um-sort-icon-active" />;
    };

    // Stats
    const premiumCount = users.filter(u => isUserPremium(u)).length;
    const adminCount = users.filter(u => isUserAdmin(u)).length;
    const teacherCount = users.filter(u => u.role === 'teacher' && !isUserAdmin(u)).length;
    const bannedCount = users.filter(u => isUserBanned(u)).length;

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                    <p>Kullanicilar yukleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Users size={28} /> Kullanici Yonetimi</h1>
                <p>Kayitli kullanicilari goruntuleyin ve yonetin</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid um-stats-row">
                <div className="stat-card" style={{ '--stat-color': 'var(--accent-purple)', '--stat-bg': 'var(--accent-purple-pale)' } as React.CSSProperties}>
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{users.length}</span>
                        <span className="stat-label">Toplam Kullanici</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--warning)', '--stat-bg': 'var(--warning-pale)' } as React.CSSProperties}>
                    <div className="stat-icon"><Crown size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{premiumCount}</span>
                        <span className="stat-label">Premium Uye</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--accent-pink)', '--stat-bg': 'var(--accent-pink-pale)' } as React.CSSProperties}>
                    <div className="stat-icon"><Shield size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{adminCount}</span>
                        <span className="stat-label">Admin</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--success)', '--stat-bg': 'var(--success-pale)' } as React.CSSProperties}>
                    <div className="stat-icon"><Star size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{teacherCount}</span>
                        <span className="stat-label">Ogretmen</span>
                    </div>
                </div>
                {bannedCount > 0 && (
                    <div className="stat-card" style={{ '--stat-color': 'var(--error)', '--stat-bg': 'var(--error-pale)' } as React.CSSProperties}>
                        <div className="stat-icon"><Ban size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{bannedCount}</span>
                            <span className="stat-label">Banlanan</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredUsers.length} Kullanici</h2>
                    <div className="table-actions">
                        <div className="um-search-wrap">
                            <Search size={18} className="um-search-icon" />
                            <input
                                type="text"
                                placeholder="Kullanici ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input um-search-input"
                            />
                        </div>
                        <button type="button" className="add-btn" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} />
                            Kullanici Ekle
                        </button>
                    </div>
                </div>

                <div className="filter-chips">
                    {(['all', 'student', 'teacher', 'admin'] as const).map(role => (
                        <button
                            key={role}
                            className={`filter-chip ${selectedRole === role ? 'active' : ''}`}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role === 'all' ? 'Tumu' :
                                role === 'admin' ? 'Admin' :
                                    role === 'teacher' ? 'Ogretmen' : 'Ogrenci'}
                        </button>
                    ))}
                    <span className="um-filter-sep">|</span>
                    {(['all', 'premium', 'free'] as const).map(type => (
                        <button
                            key={type}
                            className={`filter-chip ${selectedPremium === type ? 'active' : ''}`}
                            onClick={() => setSelectedPremium(type)}
                        >
                            {type === 'all' ? 'Tum Uyelik' :
                                type === 'premium' ? 'Premium' : 'Ucretsiz'}
                        </button>
                    ))}
                </div>

                <div className="um-table-info">
                    <span>{filteredUsers.length} kullanici bulundu</span>
                    <span>Sayfa {currentPage} / {Math.max(1, totalPages)}</span>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="um-th-sortable" onClick={() => handleSort('display_name')}>
                                Kullanici {getSortIcon('display_name')}
                            </th>
                            <th className="um-th-sortable" onClick={() => handleSort('email')}>
                                Email {getSortIcon('email')}
                            </th>
                            <th className="um-th-sortable" onClick={() => handleSort('role')}>
                                Rol {getSortIcon('role')}
                            </th>
                            <th>Premium</th>
                            <th className="um-th-sortable" onClick={() => handleSort('points')}>
                                Puan {getSortIcon('points')}
                            </th>
                            <th>Durum</th>
                            <th className="um-th-sortable" onClick={() => handleSort('created_at')}>
                                Katilim {getSortIcon('created_at')}
                            </th>
                            <th>Islemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => {
                            const banned = isUserBanned(user);
                            const displayRole = getDisplayRole(user);
                            return (
                                <tr key={user.id} className={banned ? 'um-row-banned' : ''}>
                                    <td>
                                        <div className="um-user-cell">
                                            {(user.settings?.avatar_emoji as string) ? (
                                                <span className="um-avatar-emoji">{user.settings.avatar_emoji as string}</span>
                                            ) : (
                                                <div className="um-avatar-initial">
                                                    {(user.display_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <strong>
                                                    {user.display_name || 'Isimsiz'}
                                                    {banned && <Ban size={12} className="um-ban-icon" />}
                                                </strong>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="um-email-cell">{user.email}</td>
                                    <td>
                                        <select
                                            value={displayRole}
                                            onChange={(e) => {
                                                const newRole = e.target.value as DisplayRole;
                                                if (newRole !== displayRole) {
                                                    setConfirmState({
                                                        type: 'role',
                                                        user,
                                                        newRole
                                                    });
                                                }
                                            }}
                                            className={`role-select um-role-select ${getRoleBadgeClass(displayRole)}`}
                                        >
                                            <option value="student">Ogrenci</option>
                                            <option value="teacher">Ogretmen</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmState({
                                                type: 'premium',
                                                user,
                                                newPremium: !isUserPremium(user)
                                            })}
                                            className={`um-premium-btn ${isUserPremium(user) ? 'um-premium-btn--active' : 'um-premium-btn--inactive'}`}
                                        >
                                            <Crown size={14} />
                                            {isUserPremium(user) ? 'Premium' : 'Ucretsiz'}
                                        </button>
                                        {isUserPremium(user) && getUserPremiumUntil(user) && (
                                            <small className="um-premium-expiry">
                                                {new Date(getUserPremiumUntil(user)!).toLocaleDateString('tr-TR')} &apos;e kadar
                                            </small>
                                        )}
                                    </td>
                                    <td>
                                        <span className="um-points">
                                            {user.points || 0}
                                        </span>
                                    </td>
                                    <td>
                                        {banned ? (
                                            <span className="um-status-banned">
                                                <Ban size={14} /> Banlandi
                                            </span>
                                        ) : user.is_online ? (
                                            <span className="um-status-online">
                                                <CheckCircle size={14} /> Cevrimici
                                            </span>
                                        ) : (
                                            <span className="um-status-offline">Cevrimdisi</span>
                                        )}
                                    </td>
                                    <td className="um-cell-date">
                                        {new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <div className="um-table-actions">
                                            <button
                                                className="um-icon-btn"
                                                title="Detay"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className={`um-icon-btn ${banned ? 'um-icon-btn-success' : 'um-icon-btn-warning'}`}
                                                title={banned ? 'Bani Kaldir' : 'Banla'}
                                                onClick={() => setConfirmState({
                                                    type: 'ban',
                                                    user,
                                                    newBanned: !banned
                                                })}
                                            >
                                                {banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => setConfirmState({ type: 'delete', user })}
                                                title="Kullaniciyi Sil"
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
                        <Users size={48} style={{ opacity: 0.3 }} />
                        <p>Kullanici bulunamadi</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="um-pagination">
                        <button
                            className="um-page-btn"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 7) {
                                page = i + 1;
                            } else if (currentPage <= 4) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                                page = totalPages - 6 + i;
                            } else {
                                page = currentPage - 3 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    className={`um-page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            className="um-page-btn"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* User Detail Side Panel */}
            {selectedUser && (
                <>
                    <div className="modal-overlay" onClick={() => setSelectedUser(null)} />
                    <div className="um-detail-panel">
                        <div className="um-detail-panel-header">
                            <h3>Kullanici Detayi</h3>
                            <button type="button" className="modal-close" onClick={() => setSelectedUser(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="um-detail-panel-body">
                            <div className="um-detail-hero">
                                {(selectedUser.settings?.avatar_emoji as string) ? (
                                    <span className="um-detail-avatar-emoji">{selectedUser.settings.avatar_emoji as string}</span>
                                ) : (
                                    <div className="um-detail-avatar-initial">
                                        {(selectedUser.display_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="um-detail-name">{selectedUser.display_name || 'Isimsiz'}</div>
                                <div className="um-detail-email">{selectedUser.email}</div>
                            </div>

                            <div className="um-detail-field">
                                <label>Rol</label>
                                <span className={`um-detail-badge ${getRoleBadgeClass(getDisplayRole(selectedUser))}`}>
                                    {getDisplayRole(selectedUser) === 'admin' ? 'Admin' :
                                        getDisplayRole(selectedUser) === 'teacher' ? 'Ogretmen' : 'Ogrenci'}
                                </span>
                            </div>
                            <div className="um-detail-field">
                                <label>Plan</label>
                                <span className={`um-detail-badge ${isUserPremium(selectedUser) ? 'badge-premium' : 'badge-free'}`}>
                                    {isUserPremium(selectedUser) ? 'Premium' : 'Ucretsiz'}
                                </span>
                                {isUserPremium(selectedUser) && getUserPremiumUntil(selectedUser) && (
                                    <small className="um-detail-premium-until">
                                        {new Date(getUserPremiumUntil(selectedUser)!).toLocaleDateString('tr-TR')} tarihine kadar
                                    </small>
                                )}
                            </div>
                            <div className="um-detail-field">
                                <label>Seviye</label>
                                <span>Seviye {selectedUser.level || 1}</span>
                            </div>
                            <div className="um-detail-field">
                                <label>Puan</label>
                                <span>{selectedUser.points || 0}</span>
                            </div>
                            <div className="um-detail-field">
                                <label>Durum</label>
                                {isUserBanned(selectedUser) ? (
                                    <span className="um-status-banned"><Ban size={14} /> Banlandi</span>
                                ) : (
                                    <span className={selectedUser.is_online ? 'um-status-online' : 'um-status-offline'}>
                                        {selectedUser.is_online ? 'Cevrimici' : 'Cevrimdisi'}
                                    </span>
                                )}
                            </div>
                            <div className="um-detail-field">
                                <label>Katilim</label>
                                <span>
                                    {new Date(selectedUser.created_at).toLocaleDateString('tr-TR', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="um-detail-actions">
                                <button
                                    type="button"
                                    className={`um-detail-action-btn ${isUserBanned(selectedUser) ? 'um-btn-success' : 'um-btn-warning'}`}
                                    onClick={() => setConfirmState({
                                        type: 'ban',
                                        user: selectedUser,
                                        newBanned: !isUserBanned(selectedUser)
                                    })}
                                >
                                    {isUserBanned(selectedUser) ? <CheckCircle size={14} /> : <Ban size={14} />}
                                    {isUserBanned(selectedUser) ? 'Bani Kaldir' : 'Banla'}
                                </button>
                                <button
                                    type="button"
                                    className="um-detail-action-btn um-btn-danger"
                                    onClick={() => setConfirmState({ type: 'delete', user: selectedUser })}
                                >
                                    <Trash2 size={14} />
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Yeni Kullanici Ekle</h3>
                            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
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
                                    <small className="um-small-muted">
                                        Bu adrese hos geldin maili ve otomatik sifre gonderilecek
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Gorunen Isim</label>
                                    <input
                                        type="text"
                                        value={newUserData.display_name}
                                        onChange={(e) => setNewUserData({ ...newUserData, display_name: e.target.value })}
                                        placeholder="Orn: Ogrenci Ali"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Kullanici Rolu</label>
                                    <select
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as DisplayRole })}
                                    >
                                        <option value="student">Ogrenci</option>
                                        <option value="teacher">Ogretmen</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="um-premium-label">
                                        <input
                                            type="checkbox"
                                            checked={newUserData.is_premium}
                                            onChange={(e) => setNewUserData({ ...newUserData, is_premium: e.target.checked })}
                                        />
                                        <Crown size={16} className="um-premium-icon" />
                                        Premium Uyelik Ver
                                    </label>
                                </div>

                                {newUserData.is_premium && (
                                    <div className="form-group">
                                        <label>Premium Suresi</label>
                                        <select
                                            value={newUserData.premium_months}
                                            onChange={(e) => setNewUserData({ ...newUserData, premium_months: parseInt(e.target.value) })}
                                        >
                                            <option value={1}>1 Ay</option>
                                            <option value={3}>3 Ay</option>
                                            <option value={6}>6 Ay</option>
                                            <option value={12}>1 Yil</option>
                                            <option value={120}>Omur Boyu (10 Yil)</option>
                                        </select>
                                    </div>
                                )}

                                <div className="um-password-info">
                                    <div className="um-password-info-header">
                                        <Key size={16} />
                                        <strong>Otomatik Sifre</strong>
                                    </div>
                                    <p className="um-password-info-text">
                                        Kullanici olusturuldugunda otomatik sifre uretilecek ve ekranda gosterilecek.
                                        Bu sifreyi kaydedin veya kullaniciya iletin.
                                    </p>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    Iptal
                                </button>
                                <button type="submit" className="save-btn" disabled={isCreating}>
                                    {isCreating ? 'Olusturuluyor...' : 'Kullanici Olustur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={!!confirmState}
                onClose={() => !confirmLoading && setConfirmState(null)}
                onConfirm={() => {
                    if (!confirmState) return;
                    if (confirmState.type === 'role' && confirmState.newRole) {
                        handleRoleChange(confirmState.user.id, confirmState.newRole);
                    } else if (confirmState.type === 'premium' && confirmState.newPremium !== undefined) {
                        handlePremiumToggle(confirmState.user.id, confirmState.newPremium);
                    } else if (confirmState.type === 'ban' && confirmState.newBanned !== undefined) {
                        handleBanToggle(confirmState.user.id, confirmState.newBanned);
                    } else if (confirmState.type === 'delete') {
                        executeDeleteUser();
                    }
                }}
                title={
                    confirmState?.type === 'role' ? 'Rol Degisikligi' :
                    confirmState?.type === 'premium' ? (confirmState.newPremium ? 'Premium Ver' : 'Premium Kaldir') :
                    confirmState?.type === 'ban' ? (confirmState.newBanned ? 'Kullaniciyi Banla' : 'Bani Kaldir') :
                    'Kullaniciyi Sil'
                }
                message={
                    confirmState?.type === 'role' && confirmState.newRole
                        ? `${confirmState.user.display_name} (${confirmState.user.email}) kullanicisinin rolunu ${confirmState.newRole === 'admin' ? 'Admin' : confirmState.newRole === 'teacher' ? 'Ogretmen' : 'Ogrenci'} yapmak istediginize emin misiniz?`
                        : confirmState?.type === 'premium' && confirmState.newPremium !== undefined
                            ? confirmState.newPremium
                                ? `${confirmState.user.display_name} (${confirmState.user.email}) kullanicisina premium vermek istediginize emin misiniz?`
                                : `${confirmState.user.display_name} (${confirmState.user.email}) kullanicisinin premium uyeligini kaldirmak istediginize emin misiniz?`
                            : confirmState?.type === 'ban'
                                ? confirmState.newBanned
                                    ? `${confirmState.user.display_name} (${confirmState.user.email}) kullanicisini banlamak istediginize emin misiniz? Platforma erisimi engellenecek.`
                                    : `${confirmState.user.display_name} (${confirmState.user.email}) kullanicisinin banini kaldirmak istediginize emin misiniz?`
                                : confirmState?.type === 'delete'
                                    ? `${confirmState?.user.display_name} (${confirmState?.user.email}) kullanicisini kalici olarak silmek istediginize emin misiniz? Bu islem geri alinamaz.`
                                    : ''
                }
                confirmLabel={
                    confirmState?.type === 'delete' ? 'Sil' :
                    confirmState?.type === 'ban' ? (confirmState.newBanned ? 'Banla' : 'Bani Kaldir') :
                    confirmState?.type === 'premium' && confirmState.newPremium ? 'Premium Ver' :
                    confirmState?.type === 'premium' ? 'Premium Kaldir' : 'Onayla'
                }
                confirmVariant={
                    confirmState?.type === 'delete' ? 'danger' :
                    confirmState?.type === 'ban' && confirmState.newBanned ? 'danger' :
                    confirmState?.type === 'premium' && !confirmState.newPremium ? 'warning' : 'primary'
                }
                loading={confirmLoading}
            >
                {confirmState?.type === 'premium' && confirmState.newPremium === true && (
                    <div className="form-group" style={{ marginTop: '10px', textAlign: 'left' }}>
                        <label style={{ fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Sure</label>
                        <select
                            className="role-select"
                            value={premiumDurationMonths}
                            onChange={(e) => setPremiumDurationMonths(parseInt(e.target.value))}
                        >
                            <option value={1}>1 Ay</option>
                            <option value={3}>3 Ay</option>
                            <option value={6}>6 Ay</option>
                            <option value={12}>1 Yil</option>
                            <option value={120}>Omur Boyu (10 Yil)</option>
                        </select>
                    </div>
                )}
            </ConfirmModal>
        </div>
    );
}

export default UsersManager;
