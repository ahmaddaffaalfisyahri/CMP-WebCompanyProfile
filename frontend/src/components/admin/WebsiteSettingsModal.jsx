import React, { useState, useEffect } from 'react';
import { Sliders, X, Loader2, Save, LayoutGrid, Phone } from 'lucide-react';
import { API, getAuthHeaders } from '../../utils/api';

export default function WebsiteSettingsModal({ onClose, onSaved }) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [hero, setHero] = useState({
        establishedYear: 1997,
        countriesCount: 7,
        yearsExperience: 25,
        typewriterPhrases: []
    });
    const [phraseInput, setPhraseInput] = useState('');
    const [contact, setContact] = useState({
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
        mapsUrl: ''
    });

    useEffect(() => {
        fetch(`${API}/settings`)
            .then(res => res.json())
            .then(data => {
                if (data?.data) {
                    if (data.data.hero) setHero(data.data.hero);
                    if (data.data.contact) setContact(data.data.contact);
                    if (data.data.hero?.typewriterPhrases) {
                        setPhraseInput(data.data.hero.typewriterPhrases.join('\n'));
                    }
                }
            })
            .catch(() => {})
            .finally(() => setFetching(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const phrases = phraseInput
            .split('\n')
            .map(p => p.trim())
            .filter(Boolean);

        const payload = {
            hero: {
                ...hero,
                establishedYear: parseInt(hero.establishedYear, 10) || 1997,
                countriesCount: parseInt(hero.countriesCount, 10) || 7,
                yearsExperience: parseInt(hero.yearsExperience, 10) || 25,
                typewriterPhrases: phrases.length > 0 ? phrases : hero.typewriterPhrases
            },
            contact
        };

        try {
            const res = await fetch(`${API}/settings`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data?.ok) {
                onSaved('Pengaturan website berhasil diperbarui!');
                onClose();
            } else {
                alert(data?.error || 'Gagal menyimpan pengaturan');
            }
        } catch {
            alert('Gagal menghubungi server');
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
                className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 text-slate-800"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#007CA7]">
                            <Sliders size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pengaturan Tampilan Website</h3>
                            <p className="text-xs text-slate-500">Kelola angka statistik hero, teks berjalan, dan kontak kantor</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {fetching ? (
                    <div className="py-12 flex justify-center">
                        <Loader2 size={30} className="text-[#007CA7] animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="mt-5 space-y-6">
                        {/* Section 1: Hero Stats */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#007CA7] mb-3 flex items-center gap-1.5">
                                <LayoutGrid size={14} /> 1. Angka Statistik Hero Beranda
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Berdiri</label>
                                    <input
                                        type="number"
                                        value={hero.establishedYear}
                                        onChange={e => setHero({ ...hero, establishedYear: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] outline-none"
                                        placeholder="1997"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jangkauan Negara</label>
                                    <input
                                        type="number"
                                        value={hero.countriesCount}
                                        onChange={e => setHero({ ...hero, countriesCount: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] outline-none"
                                        placeholder="7"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pengalaman</label>
                                    <input
                                        type="number"
                                        value={hero.yearsExperience}
                                        onChange={e => setHero({ ...hero, yearsExperience: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#007CA7] outline-none"
                                        placeholder="25"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Typewriter Phrases */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#007CA7] mb-1.5">
                                2. Teks Berjalan Beranda (1 Baris = 1 Kalimat)
                            </label>
                            <textarea
                                rows={4}
                                value={phraseInput}
                                onChange={e => setPhraseInput(e.target.value)}
                                placeholder="Tulis kalimat berjalan (pisahkan per baris)..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#007CA7] outline-none font-mono"
                            />
                        </div>

                        {/* Section 3: Contact Info */}
                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#007CA7] mb-3 flex items-center gap-1.5">
                                <Phone size={14} /> 3. Informasi Kontak & Kantor
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kantor</label>
                                    <textarea
                                        rows={2}
                                        value={contact.address}
                                        onChange={e => setContact({ ...contact, address: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#007CA7] outline-none"
                                        placeholder="Alamat lengkap kantor..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon / Fax</label>
                                        <input
                                            type="text"
                                            value={contact.phone}
                                            onChange={e => setContact({ ...contact, phone: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#007CA7] outline-none"
                                            placeholder="+6221 – 5401398"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
                                        <input
                                            type="email"
                                            value={contact.email}
                                            onChange={e => setContact({ ...contact, email: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#007CA7] outline-none"
                                            placeholder="info@ciptamajupersada.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Link Google Maps</label>
                                    <input
                                        type="url"
                                        value={contact.mapsUrl}
                                        onChange={e => setContact({ ...contact, mapsUrl: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#007CA7] outline-none"
                                        placeholder="https://maps.app.goo.gl/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-3 border-t border-slate-100">
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
                                <span>Simpan Pengaturan</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
