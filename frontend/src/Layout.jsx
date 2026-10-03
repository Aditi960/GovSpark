import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, [location.pathname]); // Re-check user on route change

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Hide sidebar and top nav on login/register pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // Hide sidebar on the public landing page so the hero section looks perfect
    const isLandingPage = !user && location.pathname === '/';

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-4">
                <h2 className="text-3xl font-black text-[#1e3a8a] mb-8 flex items-center gap-2">⚡ GovSpark</h2>
                <Outlet />
            </div>
        );
    }

    if (isLandingPage) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
                <Outlet />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[var(--bg)] text-[var(--text)] text-left">
            <aside className="w-64 border-r border-[var(--border)] flex flex-col">

                {/* NEW: Official GovSpark Branding Header */}
                <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white">
                    <h1 className="text-2xl font-black tracking-tight m-0 flex items-center gap-2">
                        ⚡ GovSpark
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">
                        MSINS • Govt of Maharashtra
                    </p>
                </div>

                {user && (
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--social-bg)]">
                        <span className="text-xs font-bold uppercase tracking-wider mb-1 block opacity-70">Logged in as</span>
                        <span className="font-medium text-[var(--text-h)] block">{user.name}</span>
                        <span className="text-sm text-accent">
                            {user.role === 'gov' ? '🏛 Gov Official' : '🚀 Startup Founder'}
                        </span>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-2">
                    {user ? (
                        <>
                            <Link to="/" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/ledger" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors font-medium text-green-600 dark:text-green-400">
                                🔗 Public Audit Ledger
                            </Link>
                            <Link to="/challenges" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors">
                                {user.role === 'gov' ? 'Manage Challenges' : 'Browse Challenges'}
                            </Link>

                            {user.role === 'gov' && (
                                <>
                                    <Link to="/startups" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors">
                                        Startup Directory
                                    </Link>
                                    <Link to="/escrow" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors">
                                        Escrow Management
                                    </Link>
                                </>
                            )}

                            {user.role === 'startup' && (
                                <>
                                    {/* NEW: Sandbox Gateway Route */}
                                    <Link to="/sandbox" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors font-medium">
                                        🛡️ Sandbox Gateway
                                    </Link>
                                    <Link to="/escrow" className="block px-4 py-2 rounded hover:bg-[var(--accent-bg)] hover:text-accent transition-colors">
                                        My Active Pilots
                                    </Link>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="p-4 text-sm opacity-70">Please log in to access the portal.</div>
                    )}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--bg)]">
                    <span className="font-medium text-[var(--text-h)]">ReGen Coders - SIH 2026</span>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--code-bg)]"
                                >
                                    Logout
                                </button>
                                {user.role === 'gov' && (
                                    <Link to="/new-challenge" className="px-4 py-1.5 text-sm rounded bg-accent text-white hover:opacity-90 no-underline">
                                        + New Challenge
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-accent hover:underline">Login</Link>
                                <Link to="/register" className="px-3 py-1 text-sm bg-accent text-white rounded hover:opacity-90">Register</Link>
                            </>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}