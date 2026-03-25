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

const MASTERY_DATA = [
    { name: 'Mastered', value: 45, color: 'var(--accent-emerald)' },
    { name: 'Learning', value: 30, color: 'var(--warning)' },
    { name: 'New', value: 25, color: 'var(--cloud)' },
];

const STREAK_DATA = [
    { streak: '0 days', users: 0 },
    { streak: '1-3', users: 0 },
    { streak: '4-7', users: 0 },
    { streak: '8-14', users: 0 },
    { streak: '15-30', users: 0 },
    { streak: '30+', users: 0 },
];

const COMPLETION_DATA = [
    { world: 'Hello', completed: 0, started: 0 },
    { world: 'Body', completed: 0, started: 0 },
    { world: 'Colors', completed: 0, started: 0 },
    { world: 'Animals', completed: 0, started: 0 },
    { world: 'Family', completed: 0, started: 0 },
    { world: 'Food', completed: 0, started: 0 },
];

interface MonthlyPoint { month: string; users: number }
interface GameStat { name: string; plays: number; color: string }

const GAME_COLORS = [
    'var(--warning)',
    'var(--accent-purple)',
    'var(--error)',
    'var(--accent-pink)',
    'var(--accent-emerald)',
];

function buildMonthlyData(rows: { created_at: string }[]): MonthlyPoint[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const counts: Record<string, number> = {};
    for (const row of rows) {
        const d = new Date(row.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        counts[key] = (counts[key] ?? 0) + 1;
    }
    return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        return { month: months[d.getMonth()], users: counts[key] ?? 0 };
    });
}

function buildWeeklyData(rows: { created_at: string }[]): { day: string; active: number; new: number }[] {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const newCounts = new Array(7).fill(0);
    for (const row of rows) {
        const dow = (new Date(row.created_at).getDay() + 6) % 7; // 0=Mon
        newCounts[dow]++;
    }
    return dayLabels.map((day, i) => ({ day, active: 0, new: newCounts[i] }));
}

function AdminAnalytics() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalGames, setTotalGames] = useState(0);
    const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ day: string; active: number; new: number }[]>([]);
    const [topGames, setTopGames] = useState<GameStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
            twelveMonthsAgo.setDate(1);
            twelveMonthsAgo.setHours(0, 0, 0, 0);

            const [userCountRes, gamesCountRes, userRowsRes, gamesRes] = await Promise.allSettled([
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('games').select('*', { count: 'exact', head: true }),
                supabase.from('users').select('created_at').gte('created_at', twelveMonthsAgo.toISOString()),
                supabase.from('games').select('title, plays').order('plays', { ascending: false }).limit(5),
            ]);

            if (userCountRes.status === 'fulfilled' && !userCountRes.value.error) {
                setTotalUsers(userCountRes.value.count ?? 0);
            }

            if (gamesCountRes.status === 'fulfilled' && !gamesCountRes.value.error) {
                setTotalGames(gamesCountRes.value.count ?? 0);
            }

            if (userRowsRes.status === 'fulfilled' && !userRowsRes.value.error && userRowsRes.value.data) {
                const rows = userRowsRes.value.data as { created_at: string }[];
                setMonthlyData(buildMonthlyData(rows));
                setWeeklyData(buildWeeklyData(rows));
            } else {
                setMonthlyData(buildMonthlyData([]));
                setWeeklyData(buildWeeklyData([]));
            }

            if (gamesRes.status === 'fulfilled' && !gamesRes.value.error && gamesRes.value.data) {
                const games = gamesRes.value.data as { title: string; plays: number | null }[];
                setTopGames(games.map((g, i) => ({
                    name: g.title,
                    plays: g.plays ?? 0,
                    color: GAME_COLORS[i] ?? 'var(--admin-text-muted)',
                })));
            }
        } finally {
            setLoading(false);
        }
    };

    const maxPlays = topGames.length > 0 ? Math.max(...topGames.map(g => g.plays), 1) : 1;

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
                    <div className="adm-analytics-stat-icon adm-analytics-stat-icon--info">
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{totalUsers}</div>
                        <div className="adm-analytics-stat-label">Total Users</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon adm-analytics-stat-icon--success">
                        <Target size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">N/A</div>
                        <div className="adm-analytics-stat-label">Avg. Completion</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon adm-analytics-stat-icon--warning">
                        <Flame size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">N/A</div>
                        <div className="adm-analytics-stat-label">Avg. Streak</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon adm-analytics-stat-icon--purple">
                        <Award size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{totalGames}</div>
                        <div className="adm-analytics-stat-label">Total Games</div>
                    </div>
                </div>
            </div>

            {/* Active Users Over Time (full-width) */}
            <div className="adm-analytics-grid">
                <div className="adm-analytics-chart full">
                    <div className="adm-analytics-chart-header">
                        <div className="adm-analytics-chart-title">
                            <TrendingUp size={16} /> User Registrations Over Time
                        </div>
                        <span className="adm-analytics-chart-period">Last 12 months</span>
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
                            <BarChart3 size={16} /> Weekly Signups
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--stone)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--cloud)', borderRadius: 8, fontSize: '0.8rem' }} />
                                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
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
                            <BarChart data={COMPLETION_DATA} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
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
                    <div className="adm-analytics-chart-body adm-analytics-chart-body--centered">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={MASTERY_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {MASTERY_DATA.map((entry, index) => (
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
                            <BarChart data={STREAK_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
                    <div className="adm-analytics-games-list">
                        {topGames.length === 0 && (
                            <div className="adm-empty">No game data available</div>
                        )}
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
                    <div className="adm-engagement-body">
                        <div className="adm-engagement-grid">
                            {[
                                { label: 'Daily Active Users', value: 'N/A', sub: 'No activity data yet', color: 'var(--accent-blue)' },
                                { label: 'Weekly Active Users', value: 'N/A', sub: 'No activity data yet', color: 'var(--accent-emerald)' },
                                { label: 'Avg. Session Duration', value: 'N/A', sub: 'Per user per day', color: 'var(--warning)' },
                                { label: 'Retention (7-day)', value: 'N/A', sub: 'Users returning within 7 days', color: 'var(--accent-purple)' },
                                { label: 'Content Engagement', value: 'N/A', sub: 'Avg. items per session', color: 'var(--accent-pink)' },
                            ].map(item => (
                                <div key={item.label} className="adm-engagement-row">
                                    <div className="adm-engagement-bar" style={{ background: item.color }} />
                                    <div className="adm-engagement-info">
                                        <div className="adm-engagement-label">{item.label}</div>
                                        <div className="adm-engagement-sub">{item.sub}</div>
                                    </div>
                                    <div className="adm-engagement-value">{item.value}</div>
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
