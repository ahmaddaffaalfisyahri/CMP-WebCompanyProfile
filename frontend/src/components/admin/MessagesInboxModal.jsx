import React, { useState, useEffect } from 'react';
import { Mail, X, Loader2, Inbox, Trash2, CheckSquare, Square } from 'lucide-react';
import { API, getAuthHeaders } from '../../utils/api';

export default function MessagesInboxModal({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = () => {
        setLoading(true);
        fetch(`${API}/messages`, {
            headers: getAuthHeaders()
        })
            .then(res => res.json())
            .then(data => {
                if (data?.data) setMessages(data.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'unread' ? 'contacted' : 'unread';
        try {
            await fetch(`${API}/messages/${id}/status`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ status: nextStatus })
            });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
        } catch {
            alert('Gagal mengubah status');
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Hapus pesan ini dari inbox?')) return;
        try {
            await fetch(`${API}/messages/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch {
            alert('Gagal menghapus pesan');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 text-slate-800"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#007CA7]">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Kotak Masuk Pesan (Inbox Leads)</h3>
                            <p className="text-xs text-slate-500">Pesan dan pertanyaan dari calon klien melalui website</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Loader2 size={32} className="text-[#007CA7] animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="py-16 text-center">
                        <Inbox size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-600">Belum ada pesan masuk</p>
                        <p className="text-xs text-slate-400 mt-0.5">Pesan yang dikirim dari form kontak website akan tampil di sini</p>
                    </div>
                ) : (
                    <div className="mt-5 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-4 rounded-2xl border transition ${
                                    msg.status === 'unread'
                                        ? 'bg-sky-50/50 border-[#007CA7]/30'
                                        : 'bg-white border-slate-200'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm text-[#03365b]">{msg.name}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            msg.status === 'unread'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {msg.status === 'unread' ? 'Baru' : 'Sudah Dihubungi'}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">
                                        {new Date(msg.created_at).toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2 font-medium">
                                    <span>✉️ {msg.email}</span>
                                    {msg.phone && msg.phone !== '-' && <span>📞 {msg.phone}</span>}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-700 bg-white/70 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                </p>

                                <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-100/60">
                                    <button
                                        type="button"
                                        onClick={() => toggleStatus(msg.id, msg.status)}
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium transition cursor-pointer"
                                    >
                                        {msg.status === 'unread' ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} />}
                                        <span>{msg.status === 'unread' ? 'Tandai Sudah Dihubungi' : 'Tandai Belum'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteMessage(msg.id)}
                                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                        title="Hapus pesan"
                                    >
                                        <Trash2 size={14} />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
