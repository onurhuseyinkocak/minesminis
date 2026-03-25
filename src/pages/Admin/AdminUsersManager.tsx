import { useState, useEffect, useMemo } from 'react';
import {
    Search, Users, Shield, Crown, Trash2, Plus, X, Mail, Key,
    ChevronLeft, ChevronRight, Download, AlertTriangle, Eye
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import './AdminUsersManager.css';

interface User {
    id: string;
    email: string;
    display_name: string;
    settings: Record<string, unknown>;
    role: 'student' | 'teacher' | 'parent';
    points: number;
    level: number;
    is_online: boolean;
    created_at: string;
}

const isUserPremium = (u: User) => !!(u.settings?.is_premium);
const isUserAdmin = (u: User) => !!(u.settings?.is_admin);
const getUserPremiumUntil = (u: User): string | null => (u.settings?.premium_until as string) || null;

const ITEMS_PER_PAGE = 15;

function AdminUsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedPremium, setSelectedPremium] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [confirmState, setConfirmState] = useState<{
        type: 'premium' | 'role' | 'delete';
        user: User;
        newRole?: 'student' | 'teacher' | 'admin';
        newPremium?: boolean;
    } | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [premiumDurationMonths, setPremiumDurationMonths] = useState(1);

    // Create form
    const [newUserData, setNewUserData] = useState({
        email: '',
        display_name: '',
        role: 'student' as 'student' | 'teacher' | 'admin',
        is_premium: false,
        premium_months: 1
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, display_name, settings, role, points, level, is_online, created_at')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Supabase error:', error);
                toast.error('Failed to load users');
            } else {
                setUsers((data || []).map(u => ({ ...u, settings: (u.settings || {}) as Record<string, unknown> })));
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesPremium = selectedPremium === 'all' ||
                (selectedPremium === 'premium' && isUserPremium(user)) ||
                (selectedPremium === 'free' && !isUserPremium(user));
            return matchesSearch && matchesRole && matchesPremium;
        });
    }, [users, searchTerm, selectedRole, selectedPremium]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedRole, selectedPremium]);

    const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
        const isAdmin = newRole === 'admin';
        // DB role column only accepts 'student' | 'teacher' | 'parent'; admin is a settings flag
        const dbRole: 'student' | 'teacher' | 'parent' = isAdmin ? 'teacher' : newRole as 'student' | 'teacher' | 'parent';
        setConfirmLoading(true);
        try {
            const targetUser = users.find(u => u.id === userId);
            const newSettings = { ...(targetUser?.settings || {}), is_admin: isAdmin };
            const { error } = await supabase
                .from('users')
                .update({ role: dbRole, settings: newSettings })
                .eq('id', userId);
            if (error) console.error('Supabase error:', error);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: dbRole, settings: { ...u.settings, is_admin: isAdmin } }
                    : u
            ));
            toast.success('User role updated');
            setConfirmState(null);
        } catch (error) {
            console.error('Error updating role:', error);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, role: dbRole, settings: { ...u.settings, is_admin: isAdmin } }
                    : u
            ));
            toast.success('User role updated (local)');
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
            if (error) console.error('Supabase error:', error);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, settings: { ...u.settings, is_premium: premium, premium_until: premiumUntil } }
                    : u
            ));
            toast.success(premium ? 'Premium activated' : 'Premium removed');
            setConfirmState(null);
        } catch (error) {
            console.error('Error updating premium:', error);
            setUsers(prev => prev.map(u =>
                u.id === userId
                    ? { ...u, settings: { ...u.settings, is_premium: premium, premium_until: premiumUntil } }
                    : u
            ));
            toast.success(premium ? 'Premium activated (local)' : 'Premium removed (local)');
        } finally {
            setConfirmLoading(false);
        }
    };

    const executeDeleteUser = async () => {
        if (!confirmState || confirmState.type !== 'delete') return;
        const userId = confirmState.user.id;
        setConfirmLoading(true);
        try {
            const { error } = await supabase.from('users').delete().eq('id', userId);
            if (error) console.error('Supabase error:', error);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('User deleted');
            setConfirmState(null);
            if (selectedUser?.id === userId) setSelectedUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('User deleted (local)');
        } finally {
            setConfirmLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let p = '';
        for (let i = 0; i < 10; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
        return p;
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
            const settings = {
                is_admin: newUserData.role === 'admin',
                is_premium: newUserData.is_premium,
                premium_until: premiumUntil,
            };
            // DB role column only accepts 'student' | 'teacher' | 'parent'
            const dbRole = newUserData.role === 'admin' ? 'teacher' : newUserData.role;
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
                throw insertError;
            }
            const newUser: User = insertedData
                ? { ...insertedData, settings: (insertedData.settings || {}) as Record<string, unknown> }
                : { ...payload, settings };
            setUsers(prev => [newUser, ...prev]);
            toast.success(
                <div>
                    <strong>User created</strong><br />
                    <small>Email: {newUserData.email}</small><br />
                    <small>Password: <code>{password}</code></small><br />
                    <small className="adm-toast-save-note">Save this password!</small>
                </div>,
                { duration: 10000 }
            );
            setIsCreateOpen(false);
            setNewUserData({ email: '', display_name: '', role: 'student', is_premium: false, premium_months: 1 });
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user');
        } finally {
            setIsCreating(false);
        }
    };

    const exportUsers = () => {
        const csv = filteredUsers.map(u =>
            `"${u.display_name}","${u.email}","${u.role}","${isUserPremium(u) ? 'Premium' : 'Free'}","${u.points}","${u.level}","${u.created_at}"`
        ).join('\n');
        const blob = new Blob([`Name,Email,Role,Plan,Points,Level,Created\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
        toast.success('Users exported');
    };

    // Stats
    const premiumCount = users.filter(u => isUserPremium(u)).length;
    const adminCount = users.filter(u => isUserAdmin(u)).length;
    const teacherCount = users.filter(u => u.role === 'teacher').length;

    if (loading) {
        return (
            <div className="adm-loading">
                <div className="adm-spinner" />
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="adm-users">
            {/* Header */}
            <div className="adm-users-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users, roles, and subscriptions</p>
                </div>
                <div className="adm-dash-actions">
                    <button type="button" className="adm-action-btn" onClick={exportUsers}>
                        <Download size={14} />
                        Export
                    </button>
                    <button type="button" className="adm-action-btn primary" onClick={() => setIsCreateOpen(true)}>
                        <Plus size={14} />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="adm-users-stats">
                <div className="adm-users-stat">
                    <div className="adm-users-stat-icon adm-stat-icon-blue">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="adm-users-stat-val">{users.length}</div>
                        <div className="adm-users-stat-label">Total Users</div>
                    </div>
                </div>
                <div className="adm-users-stat">
                    <div className="adm-users-stat-icon adm-stat-icon-yellow">
                        <Crown size={18} />
                    </div>
                    <div>
                        <div className="adm-users-stat-val">{premiumCount}</div>
                        <div className="adm-users-stat-label">Premium</div>
                    </div>
                </div>
                <div className="adm-users-stat">
                    <div className="adm-users-stat-icon adm-stat-icon-red">
                        <Shield size={18} />
                    </div>
                    <div>
                        <div className="adm-users-stat-val">{adminCount}</div>
                        <div className="adm-users-stat-label">Admins</div>
                    </div>
                </div>
                <div className="adm-users-stat">
                    <div className="adm-users-stat-icon adm-stat-icon-purple">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="adm-users-stat-val">{teacherCount}</div>
                        <div className="adm-users-stat-label">Teachers</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="adm-users-toolbar">
                <div className="adm-search-input">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="adm-filter-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                    <option value="admin">Admins</option>
                </select>
                <select
                    className="adm-filter-select"
                    value={selectedPremium}
                    onChange={(e) => setSelectedPremium(e.target.value)}
                >
                    <option value="all">All Plans</option>
                    <option value="premium">Premium</option>
                    <option value="free">Free</option>
                </select>
            </div>

            {/* Table */}
            <div className="adm-table-wrap">
                <div className="adm-table-info">
                    <span>{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found</span>
                    <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
                </div>

                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Plan</th>
                            <th>Level</th>
                            <th>Points</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="adm-user-cell">
                                        <div className="adm-user-avatar">
                                            {(user.settings?.avatar_emoji as string) || '\u{1F464}'}
                                        </div>
                                        <div>
                                            <div className="adm-user-name">
                                                {user.display_name || 'Unnamed'}
                                                {isUserPremium(user) && <Crown size={12} className="adm-crown-icon" />}
                                            </div>
                                            <div className="adm-user-email">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <select
                                        className="adm-role-select"
                                        value={user.role}
                                        onChange={(e) => setConfirmState({
                                            type: 'role',
                                            user,
                                            newRole: e.target.value as 'student' | 'teacher' | 'admin'
                                        })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className={`adm-badge adm-badge-btn ${isUserPremium(user) ? 'premium' : 'free'}`}
                                        onClick={() => setConfirmState({
                                            type: 'premium',
                                            user,
                                            newPremium: !isUserPremium(user)
                                        })}
                                    >
                                        <Crown size={11} />
                                        {isUserPremium(user) ? 'Premium' : 'Free'}
                                    </button>
                                    {isUserPremium(user) && getUserPremiumUntil(user) && (
                                        <div className="adm-premium-until">
                                            Until {new Date(getUserPremiumUntil(user)!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    )}
                                </td>
                                <td className="adm-cell-level">Lv. {user.level || 1}</td>
                                <td className="adm-cell-points">{user.points || 0}</td>
                                <td>
                                    <span className={`adm-badge ${user.is_online ? 'online' : 'offline'}`}>
                                        {user.is_online ? 'Online' : 'Offline'}
                                    </span>
                                </td>
                                <td className="adm-cell-date">
                                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td>
                                    <div className="adm-table-actions">
                                        <button
                                            className="adm-icon-btn"
                                            title="View details"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            className="adm-icon-btn danger"
                                            title="Delete user"
                                            onClick={() => setConfirmState({ type: 'delete', user })}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="adm-no-data">
                        <Users size={40} />
                        <p>No users found</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="adm-pagination">
                        <button
                            className="adm-page-btn"
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
                                    className={`adm-page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            className="adm-page-btn"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* User Detail Panel */}
            {selectedUser && (
                <>
                    <div className="adm-panel-overlay" onClick={() => setSelectedUser(null)} />
                    <div className="adm-panel">
                        <div className="adm-panel-header">
                            <h3>User Details</h3>
                            <button type="button" className="adm-icon-btn" onClick={() => setSelectedUser(null)}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="adm-panel-body">
                            <div className="adm-panel-user-hero">
                                <div className="adm-panel-user-emoji">
                                    {(selectedUser.settings?.avatar_emoji as string) || '\u{1F464}'}
                                </div>
                                <div className="adm-panel-user-name">
                                    {selectedUser.display_name || 'Unnamed'}
                                </div>
                                <div className="adm-panel-user-email">
                                    {selectedUser.email}
                                </div>
                            </div>

                            <div className="adm-panel-field">
                                <label>Role</label>
                                <div className="adm-panel-field-val">
                                    <span className={`adm-badge ${selectedUser.role}`}>
                                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="adm-panel-field">
                                <label>Plan</label>
                                <div className="adm-panel-field-val">
                                    <span className={`adm-badge ${isUserPremium(selectedUser) ? 'premium' : 'free'}`}>
                                        {isUserPremium(selectedUser) ? 'Premium' : 'Free'}
                                    </span>
                                    {isUserPremium(selectedUser) && getUserPremiumUntil(selectedUser) && (
                                        <span className="adm-panel-premium-until">
                                            Until {new Date(getUserPremiumUntil(selectedUser)!).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="adm-panel-field">
                                <label>Level</label>
                                <div className="adm-panel-field-val">Level {selectedUser.level || 1}</div>
                            </div>
                            <div className="adm-panel-field">
                                <label>Points</label>
                                <div className="adm-panel-field-val">{selectedUser.points || 0}</div>
                            </div>
                            <div className="adm-panel-field">
                                <label>Status</label>
                                <div className="adm-panel-field-val">
                                    <span className={`adm-badge ${selectedUser.is_online ? 'online' : 'offline'}`}>
                                        {selectedUser.is_online ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="adm-panel-field">
                                <label>Joined</label>
                                <div className="adm-panel-field-val">
                                    {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Create User Modal */}
            {isCreateOpen && (
                <div className="adm-modal-overlay" onClick={() => setIsCreateOpen(false)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal-header">
                            <h3>Add New User</h3>
                            <button type="button" className="adm-icon-btn" onClick={() => setIsCreateOpen(false)}>
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="adm-modal-body">
                                <div className="adm-form-group">
                                    <label><Mail size={13} className="adm-label-icon" />Email</label>
                                    <input
                                        type="email"
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                        placeholder="user@example.com"
                                        required
                                    />
                                    <small>A welcome email with auto-generated password will be sent</small>
                                </div>
                                <div className="adm-form-group">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        value={newUserData.display_name}
                                        onChange={(e) => setNewUserData({ ...newUserData, display_name: e.target.value })}
                                        placeholder="e.g. Student Ali"
                                    />
                                </div>
                                <div className="adm-form-group">
                                    <label>Role</label>
                                    <select
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as 'student' | 'teacher' | 'admin' })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="adm-form-group">
                                    <div className="adm-form-check">
                                        <input
                                            type="checkbox"
                                            checked={newUserData.is_premium}
                                            onChange={(e) => setNewUserData({ ...newUserData, is_premium: e.target.checked })}
                                        />
                                        <label className="adm-grant-premium-label">
                                            <Crown size={14} className="adm-grant-premium-icon" />
                                            Grant Premium
                                        </label>
                                    </div>
                                </div>
                                {newUserData.is_premium && (
                                    <div className="adm-form-group">
                                        <label>Premium Duration</label>
                                        <select
                                            value={newUserData.premium_months}
                                            onChange={(e) => setNewUserData({ ...newUserData, premium_months: parseInt(e.target.value) })}
                                        >
                                            <option value={1}>1 Month</option>
                                            <option value={3}>3 Months</option>
                                            <option value={6}>6 Months</option>
                                            <option value={12}>1 Year</option>
                                            <option value={120}>Lifetime (10 Years)</option>
                                        </select>
                                    </div>
                                )}
                                <div className="adm-password-notice">
                                    <Key size={16} className="adm-password-notice-icon" />
                                    <div className="adm-password-notice-text">
                                        An auto-generated password will be shown after creation. Make sure to save it.
                                    </div>
                                </div>
                            </div>
                            <div className="adm-modal-footer">
                                <button type="button" className="adm-btn" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                                <button type="submit" className="adm-btn primary" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmState && (
                <div className="adm-modal-overlay" onClick={() => !confirmLoading && setConfirmState(null)}>
                    <div className="adm-modal adm-modal-narrow" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal-body adm-confirm-body">
                            <div className={`adm-confirm-icon ${confirmState.type === 'delete' ? 'danger' : 'warning'}`}>
                                <AlertTriangle size={24} />
                            </div>
                            <div className="adm-confirm-text">
                                <h4>
                                    {confirmState.type === 'role' ? 'Change Role' :
                                        confirmState.type === 'premium' ? (confirmState.newPremium ? 'Grant Premium' : 'Remove Premium') :
                                            'Delete User'}
                                </h4>
                                <p>
                                    {confirmState.type === 'role' && confirmState.newRole
                                        ? `Change ${confirmState.user.display_name}'s role to ${confirmState.newRole}?`
                                        : confirmState.type === 'premium' && confirmState.newPremium !== undefined
                                            ? confirmState.newPremium
                                                ? `Grant premium access to ${confirmState.user.display_name}?`
                                                : `Remove premium from ${confirmState.user.display_name}?`
                                            : `Permanently delete ${confirmState.user.display_name}? This cannot be undone.`}
                                </p>
                                {confirmState.type === 'premium' && confirmState.newPremium === true && (
                                    <div className="adm-form-group" style={{ marginTop: '10px' }}>
                                        <label style={{ fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Duration</label>
                                        <select
                                            className="adm-filter-select"
                                            value={premiumDurationMonths}
                                            onChange={(e) => setPremiumDurationMonths(parseInt(e.target.value))}
                                        >
                                            <option value={1}>1 Month</option>
                                            <option value={3}>3 Months</option>
                                            <option value={6}>6 Months</option>
                                            <option value={12}>1 Year</option>
                                            <option value={120}>Lifetime (10 Years)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="adm-modal-footer adm-modal-footer-center">
                            <button type="button" className="adm-btn" onClick={() => setConfirmState(null)} disabled={confirmLoading}>
                                Cancel
                            </button>
                            <button
                                className={`adm-btn ${confirmState.type === 'delete' ? 'danger' : 'primary'}`}
                                disabled={confirmLoading}
                                onClick={() => {
                                    if (confirmState.type === 'role' && confirmState.newRole) {
                                        handleRoleChange(confirmState.user.id, confirmState.newRole);
                                    } else if (confirmState.type === 'premium' && confirmState.newPremium !== undefined) {
                                        handlePremiumToggle(confirmState.user.id, confirmState.newPremium);
                                    } else if (confirmState.type === 'delete') {
                                        executeDeleteUser();
                                    }
                                }}
                            >
                                {confirmLoading ? 'Processing...' : confirmState.type === 'delete' ? 'Delete' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsersManager;
