import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './supabaseClient';
import { Spade } from 'lucide-react';
import './Auth.css';

export default function AuthPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <Spade size={40} color="var(--primary-color)" />
                    <h1>PokerSaaS</h1>
                </div>
                <p className="auth-subtitle">Track your poker journey across all formats and stakes.</p>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#6366f1',
                                    brandAccent: '#4f46e5',
                                    messageText: 'white',
                                    messageBackground: '#10b981',
                                }
                            }
                        },
                        className: {
                            container: 'supabase-auth-container',
                            button: 'supabase-auth-button',
                            input: 'supabase-auth-input',
                            label: 'supabase-auth-label',
                        }
                    }}
                    theme="dark"
                />
            </div>
        </div>
    );
}
