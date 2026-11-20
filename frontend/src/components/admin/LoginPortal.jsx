import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import cmpLogo from '../../assets/CMP_Logo_Transparant.png';
import { API } from '../../utils/api';

export default function LoginPortal({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password) {
            setError('Username dan password wajib diisi');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                setError(data.error || 'Username atau password yang Anda masukkan salah');
                setLoading(false);
                return;
            }

            localStorage.setItem('cmp_admin_token', data.token);
            localStorage.setItem('cmp_admin_user', JSON.stringify(data.user || { username: username.trim() }));
            onLoginSuccess(data.user);
        } catch {
            setError('Gagal menghubungi server backend. Pastikan server backend sedang berjalan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cmp-admin min-h-screen relative flex items-center justify-center bg-linear-to-br from-cmp-blue-soft to-white p-4 font-sans text-slate-800">
            {/* Login Card Putih Bersih */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="bg-white border border-slate-200/80 border-t-4 border-t-cmp-red rounded-3xl p-8 sm:p-9 shadow-xl">
                    
                    {/* Logo & Judul */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center mb-3">
                            <img
                                src={cmpLogo}
                                alt="CMP Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-cmp-navy tracking-tight">
                            Admin Portal
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Silakan masuk untuk mengelola proyek & konten
                        </p>
                    </div>

                    {/* Notifikasi Error */}
                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
                            <AlertCircle size={16} className="shrink-0 text-rose-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form Login */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User size={16} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:border-cmp-blue focus:ring-2 focus:ring-cmp-blue/20 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:border-cmp-blue focus:ring-2 focus:ring-cmp-blue/20 outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 px-4 rounded-xl bg-cmp-red hover:bg-cmp-red-hover text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md shadow-cmp-red/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    <span>Masuk</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cmp-blue transition"
                        >
                            ← Kembali ke Website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
