import { useState, useEffect, useCallback } from 'react';
import {
    BarChart3, Users, BookOpen, Target, Flame, TrendingUp, Gamepad2, Award,
    Download, RefreshCw, Calendar,
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import './AdminAnalytics.css';

interface MonthlyPoint { month: string; users: number }
interface GameStat { name: string; plays: number; color: string }
interface MasteryPoint { name: string; value: number; color: string }
interface StreakPoint { streak: string; users: number }
interface CompletionPoint { world: string; completed: number; started: number }
interface WeeklyPoint { day: string; active: number; new: number }

type DateRange = '7d' | '30d' | '90d' | '12m';

const DATE_RANGE_LABELS: Record<DateRange, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '12m': 'Last 12 Months',
};

const GAME_COLORS = [
    'var(--warning)',
    'var(--accent-purple)',
    'var(--error)',
    'var(--accent-pink)',
    'var(--accent-emerald)',
];

function getDateRangeStart(range: DateRange): Date {
    const now = new Date();
    switch (range) {
        case '7d': { const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(0, 0, 0, 0); return d; }
        case '30d': { const d = new Date(); d.setDate(d.getDate() - 30); d.setHours(0, 0, 0, 0); return d; }
        case '90d': { const d = new Date(); d.setDate(d.getDate() - 90); d.setHours(0, 0, 0, 0); return d; }
        case '12m': { const d = new Date(now.getFullYear(), now.getMonth() - 11, 1); d.setHours(0, 0, 0, 0); return d; }
    }
}

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

function buildWeeklyData(
    signupRows: { created_at: string }[],
    activityRows: { user_id: string; created_at: string }[],
): WeeklyPoint[] {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const newCounts = new Array(7).fill(0) as number[];
    const activeSets: Set<string>[] = Array.from({ length: 7 }, () => new Set<string>());
    for (const row of signupRows) {
        const dow = (new Date(row.created_at).getDay() + 6) % 7;
        newCounts[dow]++;
    }
    for (const row of activityRows) {
        const dow = (new Date(row.created_at).getDay() + 6) % 7;
        if (row.user_id) activeSets[dow].add(row.user_id);
    }
    return dayLabels.map((day, i) => ({ day, active: activeSets[i].size, new: newCounts[i] }));
}

function buildStreakData(users: { streak_days: number | null }[]): StreakPoint[] {
    const buckets: StreakPoint[] = [
        { streak: '0 days', users: 0 },
        { streak: '1-3', users: 0 },
        { streak: '4-7', users: 0 },
        { streak: '8-14', users: 0 },
        { streak: '15-30', users: 0 },
        { streak: '30+', users: 0 },
    ];
    for (const u of users) {
        const d = u.streak_days ?? 0;
        if (d === 0) buckets[0].users++;
        else if (d <= 3) buckets[1].users++;
        else if (d <= 7) buckets[2].users++;
        else if (d <= 14) buckets[3].users++;
        else if (d <= 30) buckets[4].users++;
        else buckets[5].users++;
    }
    return buckets;
}

function buildMasteryData(rows: { mastery: number | null }[]): MasteryPoint[] {
    let mastered = 0;
    let learning = 0;
    let newWords = 0;
    for (const r of rows) {
        const m = r.mastery ?? 0;
        if (m >= 0.8) mastered++;
        else if (m >= 0.3) learning++;
        else newWords++;
    }
    return [
        { name: 'Mastered', value: mastered, color: 'var(--accent-emerald)' },
        { name: 'Learning', value: learning, color: 'var(--warning)' },
        { name: 'New', value: newWords, color: 'var(--cloud)' },
    ];
}

function computeAvgStreak(users: { streak_days: number | null }[]): string {
    if (users.length === 0) return '0';
    const total = users.reduce((sum, u) => sum + (u.streak_days ?? 0), 0);
    return (total / users.length).toFixed(1);
}

function computeAvgCompletion(rows: { mastery: number | null }[]): string {
    if (rows.length === 0) return '0%';
    const total = rows.reduce((sum, r) => sum + (r.mastery ?? 0), 0);
    return `${Math.round((total / rows.length) * 100)}%`;
}

interface EngagementData {
    dailyActive: number;
    weeklyActive: number;
    retention7d: string;
    contentEngagement: string;
}

function AdminAnalytics() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalGames, setTotalGames] = useState(0);
    const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>([]);
    const [topGames, setTopGames] = useState<GameStat[]>([]);
    const [masteryData, setMasteryData] = useState<MasteryPoint[]>([
        { name: 'Mastered', value: 0, color: 'var(--accent-emerald)' },
        { name: 'Learning', value: 0, color: 'var(--warning)' },
        { name: 'New', value: 0, color: 'var(--cloud)' },
    ]);
    const [streakData, setStreakData] = useState<StreakPoint[]>([
        { streak: '0 days', users: 0 },
        { streak: '1-3', users: 0 },
        { streak: '4-7', users: 0 },
        { streak: '8-14', users: 0 },
        { streak: '15-30', users: 0 },
        { streak: '30+', users: 0 },
    ]);
    const [completionData, setCompletionData] = useState<CompletionPoint[]>([]);
    const [avgStreak, setAvgStreak] = useState('0');
    const [avgCompletion, setAvgCompletion] = useState('0%');
    const [engagement, setEngagement] = useState<EngagementData>({
        dailyActive: 0,
        weeklyActive: 0,
        retention7d: '-',
        contentEngagement: '-',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>('12m');

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rangeStart = getDateRangeStart(dateRange);

            const [
                userCountRes, gamesCountRes, userRowsRes, gamesRes,
                streakRes, masteryRes, activityRes, weeklyActivityRes,
            ] = await Promise.allSettled([
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('games').select('*', { count: 'exact', head: true }),
                supabase.from('users').select('created_at').gte('created_at', rangeStart.toISOString()),
                supabase.from('games').select('title, plays').order('plays', { ascending: false }).limit(5),
                supabase.from('users').select('streak_days'),
                supabase.from('users').select('settings'),
                supabase.from('user_activities').select('activity_type').eq('activity_type', 'game'),
                supabase.from('user_activities').select('user_id, created_at').gte('created_at', rangeStart.toISOString()),
            ]);

            if (userCountRes.status === 'fulfilled' && !userCountRes.value.error) {
                setTotalUsers(userCountRes.value.count ?? 0);
            }

            if (gamesCountRes.status === 'fulfilled' && !gamesCountRes.value.error) {
                setTotalGames(gamesCountRes.value.count ?? 0);
            }

            // Weekly activity data for active users per day
            const activityRows: { user_id: string; created_at: string }[] =
                weeklyActivityRes.status === 'fulfilled' && !weeklyActivityRes.value.error && weeklyActivityRes.value.data
                    ? weeklyActivityRes.value.data as { user_id: string; created_at: string }[]
                    : [];

            if (userRowsRes.status === 'fulfilled' && !userRowsRes.value.error && userRowsRes.value.data) {
                const rows = userRowsRes.value.data as { created_at: string }[];
                setMonthlyData(buildMonthlyData(rows));
                setWeeklyData(buildWeeklyData(rows, activityRows));
            } else {
                setMonthlyData(buildMonthlyData([]));
                setWeeklyData(buildWeeklyData([], activityRows));
            }

            if (gamesRes.status === 'fulfilled' && !gamesRes.value.error && gamesRes.value.data) {
                const games = gamesRes.value.data as { title: string; plays: number | null }[];
                const hasPlays = games.some(g => (g.plays ?? 0) > 0);
                if (hasPlays) {
                    setTopGames(games.map((g, i) => ({
                        name: g.title,
                        plays: g.plays ?? 0,
                        color: GAME_COLORS[i] ?? 'var(--admin-text-muted)',
                    })));
                } else if (activityRes.status === 'fulfilled' && !activityRes.value.error && activityRes.value.data) {
                    const actRows = activityRes.value.data as { activity_type: string }[];
                    setTopGames([{
                        name: 'Games (total)',
                        plays: actRows.length,
                        color: GAME_COLORS[0],
                    }]);
                }
            }

            if (streakRes.status === 'fulfilled' && !streakRes.value.error && streakRes.value.data) {
                const rows = streakRes.value.data as { streak_days: number | null }[];
                setStreakData(buildStreakData(rows));
                setAvgStreak(computeAvgStreak(rows));
            }

            // Extract phonics mastery from users.settings JSONB
            if (masteryRes.status === 'fulfilled' && !masteryRes.value.error && masteryRes.value.data) {
                const userRows = masteryRes.value.data as { settings: Record<string, unknown> | null }[];
                // Flatten all phonics_mastery entries from all users
                const allMastery: { mastery: number | null; sound_id: string }[] = [];
                for (const u of userRows) {
                    const pm = (u.settings?.phonics_mastery as Record<string, Record<string, unknown>>) ?? {};
                    for (const [soundId, entry] of Object.entries(pm)) {
                        allMastery.push({ mastery: Number(entry.mastery ?? 0), sound_id: soundId });
                    }
                }
                const masteryOnly = allMastery.map(r => ({ mastery: r.mastery }));
                setMasteryData(buildMasteryData(masteryOnly));
                setAvgCompletion(computeAvgCompletion(masteryOnly));

                // Build lesson completion grouped by sound categories
                if (allMastery.length > 0) {
                    const categories: Record<string, { completed: number; started: number }> = {};
                    for (const r of allMastery) {
                        const cat = r.sound_id?.charAt(0)?.toUpperCase() ?? '?';
                        if (!categories[cat]) categories[cat] = { completed: 0, started: 0 };
                        if ((r.mastery ?? 0) >= 0.8) categories[cat].completed++;
                        else if ((r.mastery ?? 0) > 0) categories[cat].started++;
                    }
                    setCompletionData(
                        Object.entries(categories)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .slice(0, 8)
                            .map(([world, vals]) => ({ world, ...vals }))
                    );
                } else {
                    setCompletionData([]);
                }
            }

            // Compute engagement metrics from activity_logs
            if (activityRows.length > 0) {
                const now = new Date();
                const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

                const dailyUsers = new Set<string>();
                const weeklyUsers = new Set<string>();
                const userDays = new Map<string, Set<string>>();

                for (const row of activityRows) {
                    const rowDate = new Date(row.created_at);
                    if (rowDate >= oneDayAgo) dailyUsers.add(row.user_id);
                    if (rowDate >= oneWeekAgo) weeklyUsers.add(row.user_id);

                    const dayKey = row.created_at.slice(0, 10);
                    if (!userDays.has(row.user_id)) userDays.set(row.user_id, new Set());
                    userDays.get(row.user_id)?.add(dayKey);
                }

                // Retention: users with activity on 2+ distinct days
                let retainedUsers = 0;
                for (const [, days] of userDays) {
                    if (days.size >= 2) retainedUsers++;
                }
                const totalUniqueUsers = userDays.size;
                const retentionPct = totalUniqueUsers > 0 ? Math.round((retainedUsers / totalUniqueUsers) * 100) : 0;

                // Avg items per session (activities per unique user)
                const avgItems = totalUniqueUsers > 0 ? (activityRows.length / totalUniqueUsers).toFixed(1) : '0';

                setEngagement({
                    dailyActive: dailyUsers.size,
                    weeklyActive: weeklyUsers.size,
                    retention7d: `${retentionPct}%`,
                    contentEngagement: avgItems,
                });
            } else {
                setEngagement({
                    dailyActive: 0,
                    weeklyActive: 0,
                    retention7d: '-',
                    contentEngagement: '-',
                });
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load analytics';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const handleExport = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            dateRange,
            totalUsers,
            totalGames,
            avgStreak,
            avgCompletion,
            engagement,
            monthlyData,
            weeklyData,
            topGames,
            masteryData,
            streakData,
            completionData,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Analytics exported');
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
                <div>
                    <h1>Analytics</h1>
                    <p>User engagement, content performance, and learning metrics</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card, #fff)', borderRadius: '8px', padding: '2px', border: '1px solid var(--cloud, #e5e7eb)' }}>
                        {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map(range => (
                            <button
                                key={range}
                                type="button"
                                onClick={() => setDateRange(range)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: dateRange === range ? 600 : 400,
                                    background: dateRange === range ? 'var(--accent-blue, #6366f1)' : 'transparent',
                                    color: dateRange === range ? '#fff' : 'var(--admin-text-muted, #888)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                {DATE_RANGE_LABELS[range]}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => fetchAnalytics()}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--cloud, #e5e7eb)', background: 'var(--bg-card, #fff)', cursor: 'pointer' }}
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={handleExport}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--cloud, #e5e7eb)', background: 'var(--bg-card, #fff)', cursor: 'pointer' }}
                        title="Export JSON"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

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
                        <div className="adm-analytics-stat-val">{avgCompletion}</div>
                        <div className="adm-analytics-stat-label">Avg. Completion</div>
                    </div>
                </div>
                <div className="adm-analytics-stat">
                    <div className="adm-analytics-stat-icon adm-analytics-stat-icon--warning">
                        <Flame size={20} />
                    </div>
                    <div>
                        <div className="adm-analytics-stat-val">{avgStreak}</div>
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
                        <span className="adm-analytics-chart-period">{DATE_RANGE_LABELS[dateRange]}</span>
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
                            <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
                            <BookOpen size={16} /> Lesson Completion by Category
                        </div>
                    </div>
                    <div className="adm-analytics-chart-body">
                        {completionData.length === 0 ? (
                            <div className="adm-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                No lesson completion data yet
                            </div>
                        ) : (
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
                        )}
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
                                { label: 'Daily Active Users', value: String(engagement.dailyActive), sub: 'Unique users today', color: 'var(--accent-blue)' },
                                { label: 'Weekly Active Users', value: String(engagement.weeklyActive), sub: 'Unique users this week', color: 'var(--accent-emerald)' },
                                { label: 'Retention (7-day)', value: engagement.retention7d, sub: 'Users returning within 7 days', color: 'var(--accent-purple)' },
                                { label: 'Content Engagement', value: engagement.contentEngagement, sub: 'Avg. items per user', color: 'var(--accent-pink)' },
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
