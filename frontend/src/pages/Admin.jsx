import React, { useState, useEffect } from 'react';
import {
    Plus, Pencil, Trash2, Image as ImageIcon, Loader2,
    Settings, Mail, Globe, LogOut, Sliders
} from 'lucide-react';

import cmpLogo from '../assets/CMP_Logo_Transparant.png';
import { API, getAuthHeaders, imageUrl } from '../utils/api';

// Admin Subcomponents
import LoginPortal from '../components/admin/LoginPortal';
import ProjectFormModal from '../components/admin/ProjectFormModal';
import WebsiteSettingsModal from '../components/admin/WebsiteSettingsModal';
import MessagesInboxModal from '../components/admin/MessagesInboxModal';
import ProfileConfigModal from '../components/admin/ProfileConfigModal';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import Toast from '../components/admin/Toast';

function ProjectsTable({ projects, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                        <th className="px-4 py-4 sm:px-6">Foto</th>
                        <th className="px-4 py-4 sm:px-6">Proyek</th>
                        <th className="hidden px-6 py-4 sm:table-cell">Kategori</th>
                        <th className="hidden px-6 py-4 lg:table-cell">Deskripsi</th>
                        <th className="px-4 py-4 text-right sm:px-6">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                    {projects.map(project => {
                        const thumbnail = Array.isArray(project.images) ? project.images[0] : null;
                        const category = project.category || project.tag || 'General';
                        return (
                            <tr key={project.id} className="transition hover:bg-slate-50/80">
                                <td className="px-4 py-4 sm:px-6">
                                    <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-14 sm:w-20">
                                        {thumbnail ? <img src={imageUrl(thumbnail)} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageIcon size={20} className="text-slate-400" aria-hidden="true" />}
                                    </div>
                                </td>
                                <td className="max-w-xs px-4 py-4 sm:px-6">
                                    <div className="font-bold text-cmp-navy">{project.title}</div>
                                    <div className="mt-1 text-xs text-slate-600 sm:hidden">{category}</div>
                                </td>
                                <td className="hidden px-6 py-4 sm:table-cell">
                                    <span className="inline-block rounded-full bg-cmp-blue/10 px-3 py-1 text-xs font-semibold text-cmp-blue">{category}</span>
                                </td>
                                <td className="hidden max-w-sm truncate px-6 py-4 text-xs lg:table-cell">{project.description || '—'}</td>
                                <td className="px-4 py-4 sm:px-6">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(project)}
                                            className="inline-flex items-center gap-1.5 rounded-xl p-2 text-xs font-semibold text-cmp-navy hover:bg-cmp-blue-soft"
                                            title="Edit Proyek"
                                            aria-label={`Edit Proyek ${project.title}`}
                                        >
                                            <Pencil size={16} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(project)}
                                            className="rounded-xl p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                            title="Hapus Proyek"
                                            aria-label={`Hapus Proyek ${project.title}`}
                                        >
                                            <Trash2 size={16} aria-hidden="true" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default function Admin() {
    const [authChecking, setAuthChecking] = useState(true);
    const [token, setToken]               = useState('');
    const [currentUser, setCurrentUser]   = useState(null);

    const [projects, setProjects]         = useState([]);
    const [fetching, setFetching]         = useState(false);
    const [projectsError, setProjectsError] = useState(false);
    const [formOpen, setFormOpen]         = useState(false);
    const [editing, setEditing]           = useState(null);
    const [saving, setSaving]             = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [profileOpen, setProfileOpen]   = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [inboxOpen, setInboxOpen]       = useState(false);
    const [unreadCount, setUnreadCount]   = useState(0);
    const [toast, setToast]               = useState(null);

    const notify = (message, type = 'success') => setToast({ message, type });


    // ── Verify session token on mount ─────────────────────────────────────────
    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem('cmp_admin_token');
            if (!savedToken) {
                setToken('');
                setAuthChecking(false);
                return;
            }

            try {
                const res = await fetch(`${API}/auth/verify`, {
                    headers: { 'Authorization': `Bearer ${savedToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setToken(savedToken);
                    setCurrentUser(data.user || { username: 'cmp' });
                } else {
                    localStorage.removeItem('cmp_admin_token');
                    localStorage.removeItem('cmp_admin_user');
                    setToken('');
                    setCurrentUser(null);
                }
            } catch {
                setToken(savedToken);
            }
            setAuthChecking(false);
        };
        verifySession();
    }, []);

    // ── Fetch Projects ────────────────────────────────────────────────────────
    const load = async () => {
        setFetching(true);
        setProjectsError(false);
        try {
            const res = await fetch(`${API}/projects`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Gagal memuat proyek.');
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error('Respons proyek tidak valid.');
            setProjects(data);
        } catch {
            setProjectsError(true);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (token) {
            load();
            // Check unread messages count
            fetch(`${API}/messages`, { headers: getAuthHeaders() })
                .then(r => r.json())
                .then(d => {
                    if (d?.data) {
                        const unread = d.data.filter(m => m.status === 'unread').length;
                        setUnreadCount(unread);
                    }
                })
                .catch(() => {});
        }
    }, [token]);


    // ── Save (create / update) ───────────────────────────────────────────────
    const handleSave = async (form) => {
        setSaving(true);
        try {
            const url    = editing ? `${API}/projects/${editing.id}` : `${API}/projects`;
            const method = editing ? 'PUT' : 'POST';
            const res    = await fetch(url, {
                method,
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body:    JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            notify(editing ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil ditambahkan!');
            setFormOpen(false);
            setEditing(null);
            load();
        } catch {
            notify('Gagal menyimpan proyek', 'error');
        }
        setSaving(false);
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await fetch(`${API}/projects/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            notify('Proyek berhasil dihapus');
            setDeleteTarget(null);
            load();
        } catch {
            notify('Gagal menghapus proyek', 'error');
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        try {
            await fetch(`${API}/auth/logout`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
        } catch {
            // Ignore
        }
        localStorage.removeItem('cmp_admin_token');
        localStorage.removeItem('cmp_admin_user');
        setToken('');
        setCurrentUser(null);
        notify('Anda telah berhasil keluar');
    };

    if (authChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 size={36} className="text-cmp-blue animate-spin" />
            </div>
        );
    }

    if (!token) {
        return (
            <LoginPortal
                onLoginSuccess={(user) => {
                    setToken(localStorage.getItem('cmp_admin_token') || '');
                    setCurrentUser(user);
                }}
            />
        );
    }

    return (
        <div className="cmp-admin min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b-2 border-cmp-red bg-white text-cmp-navy shadow-sm">
                <div className="mx-auto max-w-7xl flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 lg:px-12">
                    <div className="flex items-center gap-3">
                        <img src={cmpLogo} alt="CMP" className="h-12 w-auto shrink-0 object-contain" />
                        <span aria-hidden="true" className="h-6 w-px bg-cmp-navy/15" />
                        <h1 className="font-bold text-lg tracking-tight">Admin Panel</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Tombol Kotak Masuk Pesan */}
                        <button
                            onClick={() => {
                                setInboxOpen(true);
                                setUnreadCount(0);
                            }}
                            className="relative flex items-center gap-1.5 text-xs text-cmp-navy px-3.5 py-2 rounded-xl border border-cmp-navy/15 hover:border-cmp-navy/30 hover:bg-cmp-blue-soft transition cursor-pointer"
                            title="Kotak Masuk Pesan dari Website"
                        >
                            <Mail size={14} className="text-cmp-blue" />
                            <span>Pesan Masuk</span>
                            {unreadCount > 0 && (
                                <span className="ml-1 bg-cmp-red text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Tombol pengaturan konten dan foto website */}
                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="flex items-center gap-1.5 text-xs text-cmp-navy px-3.5 py-2 rounded-xl border border-cmp-navy/15 hover:border-cmp-navy/30 hover:bg-cmp-blue-soft transition cursor-pointer"
                            title="Atur konten, kontak, dan foto website"
                        >
                            <Sliders size={14} className="text-cmp-blue" />
                            <span>Pengaturan Web</span>
                        </button>

                        {/* Tombol Pengaturan Akun */}
                        <button
                            onClick={() => setProfileOpen(true)}
                            className="flex items-center gap-1.5 text-xs text-cmp-navy px-3.5 py-2 rounded-xl border border-cmp-navy/15 hover:border-cmp-navy/30 hover:bg-cmp-blue-soft transition cursor-pointer"
                            title="Konfigurasi Akun & Password"
                        >
                            <Settings size={14} className="text-cmp-blue" />
                            <span>Akun</span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-cmp-navy px-3.5 py-2 rounded-xl border border-cmp-navy/15 hover:border-cmp-navy/30 hover:bg-cmp-blue-soft transition cursor-pointer"
                        >
                            <Globe size={14} className="text-cmp-blue" />
                            <span>View Site</span>
                        </a>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-xs text-cmp-red hover:text-white px-3.5 py-2 rounded-xl border border-cmp-red/25 hover:bg-cmp-red-hover transition cursor-pointer"
                        >
                            <LogOut size={14} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-6 lg:px-12 py-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-cmp-navy tracking-tight">Portfolio Projects</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola proyek dan foto yang disimpan di database.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => { setEditing(null); setFormOpen(true); }}
                        className="flex items-center gap-2 rounded-xl bg-cmp-blue hover:bg-cmp-navy text-white px-5 py-2.5 text-sm font-semibold transition shadow-md shadow-cmp-blue/20 cursor-pointer"
                    >
                        <Plus size={18} />
                        <span>Add Project</span>
                    </button>
                </div>

                <section aria-labelledby="database-projects-heading" className="space-y-3">
                    <h3 id="database-projects-heading" className="font-bold text-cmp-navy">Proyek dari Database</h3>
                    {fetching ? (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                            <Loader2 size={16} className="animate-spin text-cmp-blue" aria-hidden="true" />
                            Memuat proyek dari database…
                        </div>
                    ) : projectsError ? (
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                            <p role="status">Proyek dari database gagal dimuat.</p>
                            <button type="button" onClick={() => load()} className="font-semibold text-cmp-navy underline">Coba lagi</button>
                        </div>
                    ) : projects.length === 0 ? (
                        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Belum ada proyek di database.</p>
                    ) : (
                        <ProjectsTable
                            projects={projects}
                            onEdit={project => { setEditing(project); setFormOpen(true); }}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </section>
            </main>

            {/* Modal Form Add/Edit */}
            {formOpen && (
                <ProjectFormModal
                    initial={editing}
                    projects={projects}
                    onSave={handleSave}
                    onCancel={() => { setFormOpen(false); setEditing(null); }}
                    loading={saving}
                />
            )}

            {/* Confirm Delete Dialog */}
            {deleteTarget && (
                <ConfirmDialog
                    message={`Apakah Anda yakin ingin menghapus proyek "${deleteTarget.title}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Profile & Password Config Modal */}
            {profileOpen && (
                <ProfileConfigModal
                    currentUser={currentUser}
                    onClose={() => setProfileOpen(false)}
                    onUpdated={(updatedUser, msg) => {
                        setCurrentUser(updatedUser);
                        notify(msg || 'Profil berhasil diperbarui!');
                    }}
                />
            )}

            {/* Website Display Settings Modal */}
            {settingsOpen && (
                <WebsiteSettingsModal
                    onClose={() => setSettingsOpen(false)}
                    onSaved={notify}
                />
            )}

            {/* Messages Inbox Modal */}
            {inboxOpen && (
                <MessagesInboxModal
                    onClose={() => setInboxOpen(false)}
                />
            )}

            {/* Toast Feedback */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
