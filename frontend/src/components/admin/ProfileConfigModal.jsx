import React, { useState } from 'react';
import { Settings, X, AlertCircle, User, Lock, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { API, getAuthHeaders } from '../../utils/api';

export default function ProfileConfigModal({ currentUser, onClose, onUpdated }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername]         = useState(currentUser?.username || 'cmp');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent]         = useState(false);
    const [showNew, setShowNew]                 = useState(false);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!currentPassword) {
            setError('Password saat ini wajib diisi untuk verifikasi keamanan');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError('Konfirmasi password baru tidak cocok');
            return;
        }

        if (newPassword && newPassword.length < 5) {
            setError('Password baru minimal harus 5 karakter');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/update-profile`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    currentPassword,
                    newUsername: newUsername.trim(),
                    newPassword: newPassword ? newPassword.trim() : undefined,
                })
            });

            const data = await res.json();
            if (!res.ok || !data.ok) {
                setError(data.error || 'Gagal memperbarui profil');
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem('cmp_admin_token', data.token);
            }
            if (data.user) {
                localStorage.setItem('cmp_admin_user', JSON.stringify(data.user));
            }

            onUpdated(data.user, data.message || 'Profil berhasil diperbarui!');
            onClose();
        } catch {
            setError('Terjadi kesalahan jaringan atau server tidak merespons');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 sm:p-8 text-slate-800"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#007CA7]">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Konfigurasi Profil</h3>
                            <p className="text-xs text-slate-500">Kelola username dan password admin</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                        <AlertCircle size={16} className="shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Username Admin */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Username Admin
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                required
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Username admin"
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-[#007CA7] focus:ring-2 focus:ring-[#007CA7]/20 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Password Saat Ini (Verifikasi Wajib) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Password Saat Ini *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock size={16} />
                            </div>
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Ketik password saat ini"
                                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] focus:ring-2 focus:ring-[#007CA7]/20 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <span className="text-[10.5px] text-slate-400 mt-1 block">
                            Diperlukan untuk memvalidasi identitas sebelum menyimpan
                        </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700 block mb-3">
                            Ubah Password Baru (Kosongkan jika tidak ingin ganti)
                        </span>

                        {/* Password Baru */}
                        <div className="mb-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Password baru (min. 5 karakter)"
                                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] focus:ring-2 focus:ring-[#007CA7]/20 outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Konfirmasi Password Baru */}
                        {newPassword && (
                            <div>
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi password baru"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] focus:ring-2 focus:ring-[#007CA7]/20 outline-none transition"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-[#007CA7] hover:bg-[#005f80] text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-60 shadow cursor-pointer"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span>Simpan Profil</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
