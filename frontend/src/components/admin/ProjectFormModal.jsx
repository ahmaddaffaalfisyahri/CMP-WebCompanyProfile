import useMotionDismiss from '../../hooks/useMotionDismiss';
import React, { useState, useRef } from 'react';
import { X, ChevronDown, Upload, Crop, Trash2, Loader2, Save } from 'lucide-react';
import ImageCropModal from './ImageCropModal';
import { API, getAuthHeaders, imageUrl, DEFAULT_TITLES, DEFAULT_CATEGORIES } from '../../utils/api';

export default function ProjectFormModal({ initial, onSave, onCancel, loading, projects = [] }) {
    const [overlayRef, dismiss] = useMotionDismiss(onCancel);
    // Kumpulan opsi referensi judul
    const titleOptions = Array.from(new Set([
        ...DEFAULT_TITLES,
        ...(Array.isArray(projects) ? projects.map(p => p.title).filter(Boolean) : [])
    ]));

    // Kumpulan opsi referensi kategori
    const categoryOptions = Array.from(new Set([
        ...DEFAULT_CATEGORIES,
        ...(Array.isArray(projects) ? projects.map(p => p.category || p.tag).filter(Boolean) : [])
    ]));

    // Form states
    const [title, setTitle] = useState(initial?.title || '');
    const [category, setCategory] = useState(initial?.category || initial?.tag || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [images, setImages] = useState(initial?.images || []);
    const [uploading, setUploading] = useState(false);
    
    // Crop & Edit image state
    const [cropModalData, setCropModalData] = useState(null);
    const [replaceIndex, setReplaceIndex] = useState(null);
    const fileRef = useRef();

    // Pilih file dari komputer
    const handleFileSelected = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropModalData(reader.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Crop ulang foto yang sudah ada
    const handleRecropExisting = (url, index) => {
        setReplaceIndex(index);
        setCropModalData(imageUrl(url));
    };

    // Terapkan hasil crop & upload ke backend
    const handleCropApplied = async (croppedFile) => {
        setCropModalData(null);
        setUploading(true);

        const data = new FormData();
        data.append('images', croppedFile);

        try {
            const res = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: data
            });
            const json = await res.json();
            if (json.urls && json.urls.length > 0) {
                const newUrl = json.urls[0];
                if (replaceIndex !== null) {
                    setImages(prev => prev.map((img, i) => i === replaceIndex ? newUrl : img));
                    setReplaceIndex(null);
                } else {
                    setImages(prev => [...prev, newUrl]);
                }
            } else {
                alert(json.error || 'Upload gagal');
            }
        } catch {
            alert('Upload gambar gagal');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async (url) => {
        const filename = url.split('/').pop();
        await fetch(`${API}/upload`, {
            method:  'DELETE',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body:    JSON.stringify({ filename }),
        });
        setImages(prev => prev.filter(i => i !== url));
    };

    const submit = (e) => {
        e.preventDefault();
        const finalTitle = title.trim();
        const finalCategory = category.trim() || 'General';

        if (!finalTitle) {
            alert('Judul Project wajib diisi');
            return;
        }

        onSave({
            title:       finalTitle,
            category:    finalCategory,
            tag:         finalCategory,
            description,
            images,
        });
    };

    return (
        <>
            {/* Modal Crop & Dual Preview */}
            {cropModalData && (
                <ImageCropModal
                    imageUrl={cropModalData}
                    projectTitle={title}
                    projectCategory={category}
                    projectDescription={description}
                    onApply={handleCropApplied}
                    onCancel={() => { setCropModalData(null); setReplaceIndex(null); }}
                />
            )}

            <div
                ref={overlayRef}
                className="cmp-admin-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={dismiss}
            >
                <div
                    className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-8 py-5 rounded-t-3xl z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {initial ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Masukkan rincian judul, kategori, deskripsi, dan foto proyek.
                            </p>
                        </div>
                        <button
                            onClick={dismiss}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={submit} className="px-8 py-6 space-y-6">
                        
                        {/* 1. Judul Project */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Judul Project *
                            </label>
                            
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ketik nama atau judul proyek Anda di sini..."
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 focus:border-cmp-blue focus:ring-2 focus:ring-cmp-blue/20 outline-none transition"
                            />

                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                    Atau pilih dari judul yang sudah ada:
                                </span>
                                <div className="relative flex-1">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) setTitle(e.target.value);
                                        }}
                                        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-600 focus:border-cmp-blue outline-none cursor-pointer"
                                    >
                                        <option value="">-- Pilih Judul yang Tersedia --</option>
                                        {titleOptions.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Kategori Project */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Kategori Project *
                            </label>

                            <input
                                type="text"
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Contoh: Automation, Marine, Engineering, Construction, IT..."
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 focus:border-cmp-blue focus:ring-2 focus:ring-cmp-blue/20 outline-none transition"
                            />

                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                    Atau pilih dari kategori yang sudah ada:
                                </span>
                                <div className="relative flex-1">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) setCategory(e.target.value);
                                        }}
                                        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-600 focus:border-cmp-blue outline-none cursor-pointer"
                                    >
                                        <option value="">-- Pilih Kategori yang Tersedia --</option>
                                        {categoryOptions.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Deskripsi Proyek */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Proyek</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Jelaskan ruang lingkup, teknologi yang diterapkan, atau spesifikasi pekerjaan..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm resize-none focus:border-cmp-blue focus:ring-2 focus:ring-cmp-blue/20 outline-none"
                            />
                        </div>

                        {/* 4. Gambar Proyek: Edit, Pilih Ulang, Crop Ulang, & Dual Preview */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Gambar Proyek ({images.length})
                                </label>
                                <span className="text-[11px] text-cmp-blue font-medium">
                                    * Dilengkapi Dual Preview (Card Luar & Dialog Dalam)
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setReplaceIndex(null);
                                    fileRef.current.click();
                                }}
                                disabled={uploading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cmp-blue/40 bg-cmp-blue-soft/40 py-4 text-sm font-medium text-cmp-blue hover:bg-cmp-blue-soft hover:border-cmp-blue transition disabled:opacity-50 cursor-pointer"
                            >
                                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                {uploading ? 'Sedang memproses...' : '+ Pilih & Sesuaikan Foto Baru'}
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelected}
                            />

                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {images.map((url, i) => (
                                        <div key={i} className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                                            <img src={imageUrl(url)} alt={`Preview ${i}`} className="h-full w-full object-cover" />
                                            
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition backdrop-blur-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRecropExisting(url, i)}
                                                    className="p-2 rounded-lg bg-cmp-blue text-white hover:bg-cmp-navy transition shadow cursor-pointer"
                                                    title="Crop ulang / sesuaikan posisi foto ini"
                                                >
                                                    <Crop size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(url)}
                                                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow cursor-pointer"
                                                    title="Hapus foto ini"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded backdrop-blur">
                                                Foto {i + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white pt-5 pb-2">
                            <button
                                type="button"
                                onClick={dismiss}
                                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cmp-blue py-3 text-sm font-semibold text-white hover:bg-cmp-navy transition disabled:opacity-70 shadow-lg shadow-cmp-blue/25 cursor-pointer"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {loading ? 'Menyimpan...' : 'Simpan Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
