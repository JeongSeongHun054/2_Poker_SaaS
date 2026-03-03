import React, { useState, useMemo } from 'react';
import { Filter, Search, Trash2, ArrowUpDown } from 'lucide-react';

export default function SessionHistory({ games, formatWPLCurrency, handleDeleteGame }) {
    const [filterFormat, setFilterFormat] = useState('All');
    const [filterResult, setFilterResult] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Date sort

    // Advanced Filtering Logic
    const filteredGames = useMemo(() => {
        return games.filter(game => {
            // 1. Format Filter
            if (filterFormat !== 'All' && !game.format?.startsWith(`[${filterFormat}]`)) return false;

            // 2. Result Filter
            const val = Number(game.result) || 0;
            if (filterResult === 'Win' && val <= 0) return false;
            if (filterResult === 'Loss' && val >= 0) return false;

            // 3. Search Term (Stakes or Date)
            if (searchTerm) {
                const lowerSearch = searchTerm.toLowerCase();
                const stakeMatch = game.stakes?.toLowerCase().includes(lowerSearch);
                const dateMatch = game.date?.includes(lowerSearch);
                if (!stakeMatch && !dateMatch) return false;
            }

            return true;
        }).sort((a, b) => {
            // 4. Sorting (Date)
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [games, filterFormat, filterResult, searchTerm, sortOrder]);

    return (
        <div className="tab-fade-in" style={{ padding: '0 1rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--text-main)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Detailed Session History</h1>
                <p className="text-muted">Deep dive into all your recorded poker sessions with advanced filters.</p>
            </header>

            {/* Filter Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>

                {/* Format Filter */}
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><Filter size={14} style={{ display: 'inline', marginRight: '4px' }} /> 플랫폼 필터</label>
                    <select
                        className="input-field"
                        value={filterFormat}
                        onChange={(e) => setFilterFormat(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    >
                        <option value="All">모든 플랫폼 (All)</option>
                        <option value="WPL">WPL만 보기</option>
                        <option value="WPT">WPT만 보기</option>
                    </select>
                </div>

                {/* Result Filter */}
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><ArrowUpDown size={14} style={{ display: 'inline', marginRight: '4px' }} /> 결과 필터</label>
                    <select
                        className="input-field"
                        value={filterResult}
                        onChange={(e) => setFilterResult(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    >
                        <option value="All">모든 결과 (All)</option>
                        <option value="Win">수익 난 세션 (Winning Only)</option>
                        <option value="Loss">손실 난 세션 (Losing Only)</option>
                    </select>
                </div>

                {/* Search */}
                <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><Search size={14} style={{ display: 'inline', marginRight: '4px' }} /> 날짜 / 블라인드 검색</label>
                    <input
                        type="text"
                        placeholder="예: 2026-03 또는 100/200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                    />
                </div>
            </div>

            {/* Main Table */}
            <section className="recent-games" style={{ overflowX: 'auto' }}>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>검색된 세션: <strong style={{ color: 'var(--primary-color)' }}>{filteredGames.length}</strong> 건</span>
                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        날짜순 정렬 <ArrowUpDown size={16} />
                    </button>
                </div>
                <table style={{ minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Format</th>
                            <th>Stakes</th>
                            <th>Result</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.length > 0 ? filteredGames.map((game) => (
                            <tr key={game.id}>
                                <td>{game.date}</td>
                                <td style={{ fontWeight: '500' }}>{game.format}</td>
                                <td>{game.stakes}</td>
                                <td className={game.result > 0 ? 'text-success' : game.result < 0 ? 'text-danger' : 'text-muted'} style={{ fontWeight: 'bold' }}>
                                    {game.result > 0 ? '+' : ''}
                                    {game.format?.startsWith('[WPL]') ? formatWPLCurrency(game.result) : (game.result < 0 ? '-' : '') + `$${Math.abs(game.result)}`}
                                </td>
                                <td>
                                    <span className={`badge ${game.status}`}>
                                        {game.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteGame(game.id)}
                                        style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-danger)', padding: '6px 10px', transition: '0.2s' }}
                                        title="Delete Session"
                                        onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseOut={e => e.currentTarget.style.background = 'var(--bg-main)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    조건에 맞는 세션이 없습니다. 필터를 변경해보세요.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
