import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Users, Activity } from 'lucide-react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Fetch user profiles from the public schema
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching profiles:', error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--text-main)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                <p className="text-muted">Global overview and platform statistics.</p>
            </header>

            {/* Admin Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <Users size={20} />
                        <span className="stat-title" style={{ margin: 0 }}>Total Registered Users</span>
                    </div>
                    <span className="stat-value">{users.length}</span>
                    <span className="stat-change text-muted">All time registrations</span>
                </div>

                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-success)' }}>
                        <Activity size={20} />
                        <span className="stat-title" style={{ margin: 0 }}>System Status</span>
                    </div>
                    <span className="stat-value text-success">Online</span>
                    <span className="stat-change text-muted">All services operational</span>
                </div>
            </div>

            {/* User Table */}
            <section className="recent-games" style={{ marginTop: '2rem' }}>
                <div className="table-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>User Directory</h3>
                </div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading user data...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Email Address</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Joined Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>User ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No users found or awaiting new registrations.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.id}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default AdminDashboard;
