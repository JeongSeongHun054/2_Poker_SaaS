import React, { useMemo } from 'react';
import { Target, TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function GoalsROI({ games, formatWPLCurrency }) {

    // Compute Stats
    const stats = useMemo(() => {
        let wplTotal = 0;
        let wptTotal = 0;
        let bestWPL = { val: 0, date: '-', format: '-' };
        let worstWPL = { val: 0, date: '-', format: '-' };
        let wins = 0;

        games.forEach(g => {
            const val = Number(g.result) || 0;
            if (val > 0) wins++;

            if (g.format?.startsWith('[WPL]')) {
                wplTotal += val;
                if (val > bestWPL.val) { bestWPL = { val, date: g.date, format: g.format }; }
                if (val < worstWPL.val) { worstWPL = { val, date: g.date, format: g.format }; }
            } else if (g.format?.startsWith('[WPT]')) {
                wptTotal += val;
            }
        });

        const winRate = games.length > 0 ? Math.round((wins / games.length) * 100) : 0;

        // Group recent games by Session length (e.g. 5 recent valid results)
        const recentWPL = games.filter(g => g.format?.startsWith('[WPL]')).slice(0, 10).reverse().map((g, i) => ({
            name: g.date.slice(5), // mm-dd
            profit: Number(g.result) || 0
        }));

        return { wplTotal, wptTotal, bestWPL, worstWPL, winRate, recentWPL };
    }, [games]);

    // Temporary Goal hardcoded visual (Can be made dynamic later)
    const goalTarget = 1000000000; // 10억
    const currentProgress = Math.max(0, stats.wplTotal);
    const percentComplete = Math.min(100, Math.round((currentProgress / goalTarget) * 100));

    return (
        <div className="tab-fade-in" style={{ padding: '0 1rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--text-main)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Goals & ROI Tracker</h1>
                <p className="text-muted">Analyze your best moments and track your progress to becoming a shark.</p>
            </header>

            {/* Goal Progress Section */}
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}><Target size={20} color="var(--primary-color)" /> My First 10억 (1 Billion KRW) Goal</h3>
                        <span className="text-muted">현재 달성률: {percentComplete}%</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-success)' }}>{formatWPLCurrency(currentProgress)}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>/ 10억 0만</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '24px', background: 'var(--bg-main)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        width: `${percentComplete}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)',
                        transition: 'width 1s ease-in-out'
                    }}></div>
                </div>
            </div>

            {/* Highlights Grid */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Career Highlights</h3>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="stat-title">Biggest Win (Best)</span>
                            <span className="stat-value text-success">{stats.bestWPL.val > 0 ? formatWPLCurrency(stats.bestWPL.val) : '-'}</span>
                        </div>
                        <Award size={24} color="#10b981" />
                    </div>
                    <span className="stat-change text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>{stats.bestWPL.date !== '-' ? `${stats.bestWPL.date} / ${stats.bestWPL.format}` : 'No wins yet'}</span>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="stat-title">Biggest Loss (Worst)</span>
                            <span className="stat-value text-danger">{stats.worstWPL.val < 0 ? formatWPLCurrency(stats.worstWPL.val) : '-'}</span>
                        </div>
                        <AlertCircle size={24} color="#ef4444" />
                    </div>
                    <span className="stat-change text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>{stats.worstWPL.date !== '-' ? `${stats.worstWPL.date} / ${stats.worstWPL.format}` : 'No losses yet'}</span>
                </div>

                <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span className="stat-title">Overall Win Rate</span>
                            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.winRate}%</span>
                        </div>
                        {stats.winRate > 50 ? <TrendingUp size={24} color="#3b82f6" /> : <TrendingDown size={24} color="#94a3b8" />}
                    </div>
                    <span className="stat-change text-muted" style={{ marginTop: '0.5rem', display: 'block' }}>Based on {games.length} total sessions</span>
                </div>
            </div>

            {/* Mini Bar Chart for recent WPL volatility */}
            {stats.recentWPL.length > 0 && (
                <section className="chart-section">
                    <h2 className="chart-header">Recent WPL Volatility (Last 10)</h2>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.recentWPL} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    formatter={(value) => [formatWPLCurrency(value), 'Profit/Loss']}
                                />
                                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                                    {stats.recentWPL.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}
        </div>
    );
}
