import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  History,
  Target,
  Settings,
  Upload,
  Spade,
  Plus,
  LogOut,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './index.css';
import AddSessionModal from './AddSessionModal';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import SessionHistory from './SessionHistory';
import GoalsROI from './GoalsROI';
import SettingsPage from './Settings';
import { supabase } from './supabaseClient';

// Initial chart state
const initialData = [
  { id: 0, date: '-', displayDate: '-', bankroll: 0 }
];

const initialGames = [];

function App() {
  const [session, setSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [games, setGames] = useState(initialGames);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchGames();
    }
  }, [session]);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
    } else {
      setGames(data);
    }
  };

  const handleAddGame = async (newGameInput) => {
    const isArray = Array.isArray(newGameInput);
    const newGames = isArray ? newGameInput : [newGameInput];

    const uniqueNewGames = [];
    newGames.forEach(newGame => {
      const isDuplicateInDB = games.some(game =>
        game.date === newGame.date &&
        game.format === newGame.format &&
        game.stakes === newGame.stakes &&
        game.result === newGame.result
      );
      const isDuplicateInBatch = uniqueNewGames.some(game =>
        game.date === newGame.date &&
        game.format === newGame.format &&
        game.stakes === newGame.stakes &&
        game.result === newGame.result
      );
      if (!isDuplicateInDB && !isDuplicateInBatch) {
        uniqueNewGames.push(newGame);
      }
    });

    if (uniqueNewGames.length === 0) {
      console.log('Skipping duplicate entries');
      return;
    }

    // Optimistic UI update
    setGames([...uniqueNewGames, ...games]);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const insertPayload = uniqueNewGames.map(game => ({
      user_id: user.id,
      date: game.date,
      format: game.format,
      stakes: game.stakes,
      result: game.result,
      status: game.status
    }));

    const { error } = await supabase
      .from('sessions')
      .insert(insertPayload)
      .select();

    if (error) {
      console.error('Error inserting game:', error);
      // Revert optimistic update on failure
      fetchGames();
    } else {
      // Re-fetch to get real Supabase IDs so delete works perfectly
      fetchGames();
    }
  };

  const confirmResetData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting data:', error);
      alert("Failed to reset data. Check console.");
    } else {
      setGames([]); // clear frontend instantly
      setCurrentPage(1);
      setIsResetConfirmOpen(false);
      // alert("All poker session data has been successfully reset to 0.");
    }
  };

  const handleDeleteGame = (id) => {
    setGameToDelete(id);
  };

  const confirmDeleteGame = async () => {
    if (!gameToDelete) return;
    const id = gameToDelete;

    // Optimistic UI update using functional state to guarantee current closure
    setGames(prevGames => prevGames.filter(game => game.id !== id));
    setGameToDelete(null); // Close modal

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game: ' + (error.message || JSON.stringify(error)));
    }
    // Always re-fetch to ensure perfectly synced state
    fetchGames();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const formatWPLCurrency = (numStr) => {
    const num = Number(numStr);
    if (isNaN(num) || num === 0) return '0원';

    const isNegative = num < 0;
    const absNum = Math.abs(num);

    if (absNum >= 1) {
      const eok = Math.floor(absNum);
      const man = Math.round((absNum - eok) * 10000); // 0.2 억 = 2000 만
      let result = `${eok}억`;
      if (man > 0) result += ` ${man}만`;
      return isNegative ? `-${result}` : result;
    } else {
      const man = Math.round(absNum * 10000);
      return isNegative ? `-${man}만` : `${man}만`;
    }
  };

  if (!session) {
    return <AuthPage />;
  }

  // Dynamic Calculations
  const hasGames = games.length > 0;

  const totalWPL = games
    .filter(g => g.format?.startsWith('[WPL]'))
    .reduce((sum, g) => sum + (Number(g.result) || 0), 0);

  const totalWPT = games
    .filter(g => g.format?.startsWith('[WPT]'))
    .reduce((sum, g) => sum + (Number(g.result) || 0), 0);

  const formatTotalWPL = hasGames ? formatWPLCurrency(totalWPL) : '0원';

  const winCount = games.filter(g => (Number(g.result) || 0) > 0).length;
  const winRate = hasGames ? Math.round((winCount / games.length) * 100) : 0;

  // Build cumulative chart (Simplistic approach joining unit logic)
  const chartData = hasGames ? [...games].reverse().reduce((acc, game, i) => {
    const prevValue = i > 0 ? acc[i - 1].bankroll : 0;
    const currentVal = Number(game.result) || 0;
    // We graph raw numbers, regardless of WPL/WPT mix just to show movement
    const newValue = Number((prevValue + currentVal).toFixed(2));

    const dateStr = game.date ? game.date.slice(5) : '-';
    // Check if this date is different from the previous logged date
    const isFirstOfDay = i === 0 || acc[i - 1].date !== dateStr;

    acc.push({
      id: i,
      date: dateStr,
      displayDate: isFirstOfDay ? dateStr : '',
      bankroll: newValue
    });
    return acc;
  }, []) : initialData;

  // Pagination Calculations
  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
  const currentGames = games.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Spade size={28} />
          PokerSaaS
        </div>
        <nav className="nav-links">
          <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('history'); }}>
            <History size={20} />
            Session History
          </a>
          <a href="#" className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('goals'); }}>
            <Target size={20} />
            Goals & ROI
          </a>
          <a href="#" className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
            <Settings size={20} />
            Settings
          </a>
          {session?.user?.email === 'gnsl1465@naver.com' && (
            <a href="#" className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}>
              <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>👑</span>
              Admin Menu
            </a>
          )}
          <div style={{ marginTop: 'auto' }}>
            <button className="nav-link" onClick={handleSignOut} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'admin' ? (
          <AdminDashboard />
        ) : activeTab === 'history' ? (
          <SessionHistory games={games} formatWPLCurrency={formatWPLCurrency} handleDeleteGame={handleDeleteGame} />
        ) : activeTab === 'goals' ? (
          <GoalsROI games={games} formatWPLCurrency={formatWPLCurrency} />
        ) : activeTab === 'settings' ? (
          <SettingsPage userEmail={session?.user?.email} />
        ) : (
          <>
            <header className="header">
              <div>
                <h1>Overview</h1>
                <p className="text-muted">Welcome back! Here's your performance summary.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-danger" onClick={() => setIsResetConfirmOpen(true)}>
                  Reset All Data
                </button>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} /> Record Session
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-title">Total Profit (WPL)</span>
                <span className="stat-value text-success">{formatTotalWPL}</span>
                <span className="stat-change text-muted">{hasGames ? 'Based on all sessions' : 'No data yet'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Total Profit (WPT)</span>
                <span className="stat-value text-success">${totalWPT.toFixed(2)}</span>
                <span className="stat-change text-muted">{hasGames ? 'Based on all sessions' : 'No data yet'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Total Sessions</span>
                <span className="stat-value">{games.length}</span>
                <span className="stat-change text-muted">Active records</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">Win Rate</span>
                <span className="stat-value">{winRate}%</span>
                <span className="stat-change text-muted">Percentage of winning sessions</span>
              </div>
            </div>

            {/* Chart */}
            <section className="chart-section">
              <h2 className="chart-header">Session Profit Timeline</h2>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="id"
                      stroke="#94a3b8"
                      tickFormatter={(id) => chartData[id]?.displayDate || ''}
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value) => [formatWPLCurrency(value), 'Bankroll']}
                      labelFormatter={(label) => chartData[label]?.date || label}
                    />
                    <Line
                      type="monotone"
                      dataKey="bankroll"
                      stroke="var(--primary-color)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "var(--primary-color)" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Recent Sessions */}
            <section className="recent-games">
              <div className="table-header">
                Recent Sessions
              </div>
              <table>
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
                  {currentGames.map((game) => (
                    <tr key={game.id}>
                      <td>{game.date}</td>
                      <td>{game.format}</td>
                      <td>{game.stakes}</td>
                      <td className={game.result > 0 ? 'text-success' : game.result < 0 ? 'text-danger' : 'text-muted'}>
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
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-danger)', padding: '5px' }}
                          title="Delete Session"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', gap: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn-outline"
                    style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="text-muted text-sm">Page {currentPage} of {totalPages}</span>
                  <button
                    className="btn-outline"
                    style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Modals */}
      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGame}
      />
      {/* Delete Single Game Confirmation Modal */}
      {gameToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>데이터 삭제</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              정말로 이 세션 기록을 삭제하시겠습니까?<br />이 작업은 되돌릴 수 없으며, 통계에 즉시 반영됩니다.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-outline w-full" onClick={() => setGameToDelete(null)}>
                취소 (Cancel)
              </button>
              <button className="btn-danger w-full" onClick={confirmDeleteGame}>
                삭제 (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>⚠️ Reset Database</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Are you sure you want to delete all your session history? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-outline w-full" onClick={() => setIsResetConfirmOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger w-full" onClick={confirmResetData}>
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
