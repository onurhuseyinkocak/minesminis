import { useState, useEffect } from 'react';
import {
    BarChart3, Users, BookOpen, Target, Flame, TrendingUp, Gamepad2, Award
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { supabase } from '../../config/supabase';
import './AdminAnalytics.css';

// Generate sample analytics data
const generateActiveUsersData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
        day,
        active: Math.floor(Math.random() * 40 + 20),
        new: Math.floor(Math.random() * 10 + 2),
    }));
};

const generateCompletionData = () => {
    const worlds = ['Hello', 'Body', 'Colors', 'Animals', 'Family', 'Food'];
    return worlds.map(world => ({
        world,
        completed: Math.floor(Math.random() * 70 + 30),
        started: Math.floor(Math.random() * 30 + 10),
    }));
};

const generateMasteryData = () => [
    { name: 'Mastered', value: 45, color: 'var(--accent-emerald)' },
    { name: 'Learning', value: 30, color: 'var(--warning)' },
    { name: 'New', value: 25, color: 'var(--cloud)' },
];

const generateStreakData = () => [
    { streak: '0 days', users: 35 },
    { streak: '1-3', users: 25 },
    { streak: '4-7', users: 18 },
    { streak: '8-14', users: 12 },
    { streak: '15-30', users: 7 },
    { streak: '30+', users: 3 },
];

const topGames = [
    { name: 'Animals Quiz', plays: 342, color: 'var(--warning)' },
    { name: 'Colors Match', plays: 289, color: 'var(--accent-purple)' },
    { name: 'Body Parts Maze', plays: 256, color: 'var(--error)' },
    { name: 'Family Words', plays: 198, color: 'var(--accent-pink)' },
    { name: 'Food Memory', plays: 167, color: 'var(--accent-emerald)' },
];

const generateMonthlyUsers = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return {
            month: months[d.getMonth()],
            users: Math.floor(Math.random() * 50 + 10 + i * 5),
        };
    });
};

function AdminAnalytics() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [avgCompletion, setAvgCompletion] = useState(0);
    const [avgStreak, setAvgStreak] = useState(0);
    const [totalLessonsCompleted, setTotalLessonsCompleted] = useState(0);
    const [loading, setLoading] = useState(true);

    const activeUsersData = generateActiveUsersData();
    const completionData = generateCompletionData();
    const masteryData = generateMasteryData();
    const streakData = generateStreakData();
    const monthlyData = generateMonthlyUsers();

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
            setTotalUsers(count || 0);
            // Simulated metrics (replace with real queries)
            setAvgCompletion(Math.floor(Math.random() * 30 + 45));
            setAvgStreak(Math.floor(Math.random() * 5 + 3));
            setTotalLessonsCompleted(Math.floor(Math.random() * 500 + 200));
        } catch {
            // Use defaults
        } finally {
            setLoading(false);
        }
    };

    const maxPlays = Math.max(...topGames.map(g => g.plays));

    if (loading) {
        return (
            <div className="adm-loading">
                <div className="adm-spinner" />
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="adm-analytics">
            <div className="adm-analytics-header">
                <h1>Analytics</h1>
                <p>User engagement, content performance, and learning metrics</p>
            </div>

            {/* Key Stats */}
            <div className="adm-analytics-stats">
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon" style={{ background: 'var(--info-pale)', color: 'var(--accent-blue)' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{totalUsers}</div>
                        <div className="adm-analytics-stat-label">Total Users</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon" style={{ background: 'var(--success-pale)', color: 'var(--accent-emerald)' }}>
                        <Target size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{avgCompletion}%</div>
                        <div className="adm-analytics-stat-label">Avg. Completion</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon" style={{ background: 'var(--warning-pale)', color: 'var(--accent-orange)' }}>
                        <Flame size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{avgStreak} days</div>
                        <div className="adm-analytics-stat-label">Avg. Streak</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon" style={{ background: 'var(--accent-purple-pale)', color: 'var(--accent-purple)' }}>
                        <Award size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{totalLessonsCompleted}</div>
                        <div className="adm-analytics-stat-label">Lessons Completed</div>
                    </div>
                </div>
            </div>

            {/* Active Users Over Time (full-width) */}
            <div className="adm-analytics-grid">
                <div className="adm-analytics-chart full">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <TrendingUp size={16} /> Active Users Over Time
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Last 12 months</span>
                    </div>
                    <div className="adm-analytics-chart-body">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={monthlyData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Area type="monotone" dataKey="users" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#usersGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Weekly Activity + Lesson Completion */}
            <div className="adm-analytics-grid">
                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <BarChart3 size={16} /> Weekly Activity
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={activeUsersData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem' }} />
                                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                                <Bar dataKey="active" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} name="Active Users" />
                                <Bar dataKey="new" fill="var(--accent-emerald)" radius={[4, 4, 0, 0]} name="New Users" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <BookOpen size={16} /> Lesson Completion by World
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={completionData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" horizontal={false} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <YAxis type="category" dataKey="world" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} width={60} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem' }} />
                                <Bar dataKey="completed" fill="var(--accent-emerald)" radius={[0, 4, 4, 0]} name="Completed" stackId="a" />
                                <Bar dataKey="started" fill="var(--accent-amber)" radius={[0, 4, 4, 0]} name="In Progress" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Word Mastery + Streak Distribution */}
            <div className="adm-analytics-grid">
                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <Target size={16} /> Word Mastery Distribution
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={masteryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {masteryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem' }} />
                                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <Flame size={16} /> Streak Distribution
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={streakData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" vertical={false} />
                                <XAxis dataKey="streak" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--stone)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem' }} />
                                <Bar dataKey="users" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} name="Users" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Popular Games */}
            <div className="adm-analytics-grid">
                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <Gamepad2 size={16} /> Most Popular Games
                        </div>
                    </div>
                    <div style={{ padding: '0.5rem 0' }}>
                        {topGames.map((game, i) => (
                            <div key={game.name} className="adm-top-item">
                                <div className={`adm-top-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                                    {i + 1}
                                </div>
                                <span className="adm-top-name">{game.name}</span>
                                <span className="adm-top-value">{game.plays} plays</span>
                                <div className="adm-top-bar">
                                    <div
                                        className="adm-top-bar-fill"
                                        style={{ width: `${(game.plays / maxPlays) * 100}%`, background: game.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement Summary */}
                <div className="adm-analytics-chart">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <Award size={16} /> Engagement Summary
                        </div>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                { label: 'Daily Active Users', value: `${Math.floor(totalUsers * 0.15)}`, sub: `${((totalUsers * 0.15 / Math.max(totalUsers, 1)) * 100).toFixed(0)}% of total`, color: 'var(--accent-blue)' },
                                { label: 'Weekly Active Users', value: `${Math.floor(totalUsers * 0.45)}`, sub: `${((totalUsers * 0.45 / Math.max(totalUsers, 1)) * 100).toFixed(0)}% of total`, color: 'var(--accent-emerald)' },
                                { label: 'Avg. Session Duration', value: '12 min', sub: 'Per user per day', color: 'var(--warning)' },
                                { label: 'Retention (7-day)', value: '68%', sub: 'Users returning within 7 days', color: 'var(--accent-purple)' },
                                { label: 'Content Engagement', value: '4.2', sub: 'Avg. items per session', color: 'var(--accent-pink)' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--admin-border-light)' }}>
                                    <div style={{ width: 4, height: 32, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.775rem', fontWeight: 500, color: 'var(--admin-text)' }}>{item.label}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>{item.sub}</div>
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)' }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAnalytics;
