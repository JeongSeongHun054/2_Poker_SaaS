import React from 'react';
import { User, Shield, Moon, Download, HelpCircle } from 'lucide-react';

export default function Settings({ userEmail }) {

    const handleExport = () => {
        alert("현재 개발 중인 기능입니다! (준비 중: 모든 세션 데이터를 엑셀 CSV로 내보내기)");
    };

    return (
        <div className="tab-fade-in" style={{ padding: '0 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--text-main)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p className="text-muted">Manage your preferences and platform data.</p>
            </header>

            {/* Account Info Segment */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '50%' }}>
                        <User size={32} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>Profile Info</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Connected as: <strong>{userEmail || 'Loading...'}</strong></p>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '500' }}>
                            <Shield size={18} /> Password & Security
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>You can request a password reset email if needed.</p>
                    </div>
                    <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => alert("비밀번호 재설정 메일을 전송하는 기능은 곧 추가됩니다.")}>Reset Password</button>
                </div>
            </div>

            {/* Preferences Segment */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '500' }}>
                            <Moon size={18} /> Theme Preference
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Currently PokerSaaS is exclusively Dark Mode optimized.</p>
                    </div>
                    <span className="badge success">Dark Theme Active</span>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '500' }}>
                            <Download size={18} /> Export Data
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Download a copy of all your session records (CSV).</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={handleExport}>Download CSV</button>
                </div>
            </div>

            {/* Help & Support */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '500' }}>
                            <HelpCircle size={18} /> Support & Feedback
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Encountered a bug or want to suggest a new feature? Contact the developer.</p>
                    </div>
                    <a href="mailto:gnsl1465@naver.com" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>Contact Us</a>
                </div>
            </div>

        </div>
    );
}
