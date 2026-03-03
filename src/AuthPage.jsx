import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Spade, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setMessage(null);
        setLoading(true);

        if (!isLogin && password !== confirmPassword) {
            setErrorMsg("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
            setLoading(false);
            return;
        }

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setErrorMsg("로그인 실패: 이메일이나 비밀번호를 확인해주세요.");
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                }
            });
            if (error) {
                setErrorMsg("가입 실패: " + error.message);
            } else {
                setMessage("가입 성공! 메일함을 확인하여 인증 링크를 클릭해주세요.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
                <div className="auth-logo" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Spade size={44} color="var(--primary-color)" />
                    <h1 style={{ marginTop: '0.5rem', color: 'var(--text-main)' }}>PokerSaaS</h1>
                </div>
                <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "Welcome back to your dashboard." : "Create an account to track your journey."}
                </p>

                {errorMsg && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</div>}
                {message && <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>이메일 주소</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mail@example.com"
                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>비밀번호 {isLogin ? '' : '생성'}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>비밀번호 확인</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호를 다시 한 번 입력하세요"
                                style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '1rem' }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '0.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입 하기')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMsg(null);
                            setMessage(null);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                    >
                        {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
                    </button>
                </div>
            </div>
        </div>
    );
}
