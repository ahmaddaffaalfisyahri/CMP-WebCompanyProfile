import { useEffect, useRef, useState } from 'react';
import { Crop, ImagePlus, Loader2, RotateCcw, Save, Sliders, X } from 'lucide-react';
import useMotionDismiss from '../../hooks/useMotionDismiss';
import ImageCropModal from './ImageCropModal.jsx';
import { imageUrl } from '../../utils/api.js';
import {
    defaultWebsiteText,
    readAppearance,
    readLegacyContact,
    saveAppearance,
    sectionPhotoGroups,
    uploadAppearancePhotos,
} from '../../utils/websiteSettings.js';

const tabs = [
    ['text', 'Konten & kontak'],
    ['photos', 'Foto halaman'],
];
const fieldClass = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cmp-blue';
const supportedImage = /^image\/(jpeg|png|webp|gif)$/;
const currentYear = new Date().getFullYear();

const textGroups = [
    {
        title: 'Beranda',
        fields: [
            { name: 'heroTitle', label: 'Judul utama (maksimal 3 baris)', rows: 3, maxLength: 120 },
            { name: 'heroDescription', label: 'Deskripsi singkat', rows: 3, maxLength: 450 },
        ],
    },
    {
        title: 'About Us',
        fields: [
            { name: 'establishedYear', label: 'Tahun berdiri', type: 'number', min: 1800, max: currentYear },
            { name: 'disciplineCount', label: 'Jumlah disiplin inti', type: 'number', min: 1, max: 99 },
            { name: 'projectSolutions', label: 'Nilai Project Solutions', maxLength: 36 },
        ],
    },
    {
        title: 'Kontak kantor',
        fields: [
            { name: 'address', label: 'Alamat kantor', rows: 2, maxLength: 400 },
            { name: 'phone', label: 'Telepon kantor', type: 'tel', maxLength: 48 },
            { name: 'email', label: 'Email resmi', type: 'email', maxLength: 254 },
            { name: 'mapsUrl', label: 'Link Google Maps', type: 'url', maxLength: 2048 },
        ],
    },
];

function textToSave(text, baseText) {
    const changes = {};
    for (const { fields } of textGroups) {
        for (const { name, label, type, min, max, maxLength } of fields) {
            const raw = String(text[name]).trim();
            const value = type === 'number' ? Number(raw) : raw;
            if (!raw || (maxLength && raw.length > maxLength) ||
                (type === 'number' && (!Number.isInteger(value) || value < min || value > max))) {
                throw new Error(`Periksa isi kolom ${label}.`);
            }
            if (name === 'heroTitle' && (raw.split('\n').length > 3 || raw.split('\n').some(line => !line.trim()))) {
                throw new Error('Judul utama harus berisi 1 sampai 3 baris yang terisi.');
            }
            if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) throw new Error('Periksa format email resmi.');
            if (name === 'phone' && !/\d/.test(raw)) throw new Error('Telepon kantor harus berisi angka.');
            if (type === 'url' && (!raw.startsWith('https://') || !URL.canParse(raw))) {
                throw new Error('Masukkan link Google Maps yang diawali https://.');
            }
            if (value !== baseText[name]) changes[name] = value;
        }
    }
    return changes;
}

function withoutSlot(values, slot) {
    const remaining = { ...values };
    delete remaining[slot];
    return remaining;
}

function PhotoField({ label, original, saved, pending, onPick, onCrop, onReset }) {
    const source = imageUrl(pending?.preview || saved || original);
    return (
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200">
            <img
                src={source}
                alt={label}
                loading="lazy"
                className="aspect-video w-full bg-slate-100 object-cover"
                onError={event => {
                    if (event.currentTarget.getAttribute('src') !== original) event.currentTarget.src = original;
                }}
            />
            <div className="space-y-2 p-3">
                <p className="text-sm font-semibold">{label}</p>
                {pending && <p className="truncate text-xs text-slate-600" title={pending.file.name}>{pending.file.name}</p>}
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold">
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded text-cmp-navy focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cmp-blue">
                        <ImagePlus size={14} aria-hidden="true" />
                        Ganti foto
                        <input
                            className="sr-only"
                            type="file"
                            aria-label={`Ganti ${label}`}
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={event => {
                                const file = event.currentTarget.files?.[0];
                                if (file) onPick(file);
                                event.currentTarget.value = '';
                            }}
                        />
                    </label>
                    {onCrop && (
                        <button
                            type="button"
                            onClick={() => onCrop(source)}
                            aria-label={`Crop atau zoom ${label}`}
                            className="inline-flex items-center gap-1 text-cmp-navy hover:underline"
                        >
                            <Crop size={14} aria-hidden="true" /> Crop / Zoom
                        </button>
                    )}
                    {(pending || saved) && (
                        <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-slate-600 hover:text-cmp-navy">
                            <RotateCcw size={13} aria-hidden="true" /> Foto asli
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function WebsiteSettingsModal({ onClose, onSaved }) {
    const [saving, setSaving] = useState(false);
    const [overlayRef, dismiss] = useMotionDismiss(() => {
        if (!saving) onClose();
    });
    const [tab, setTab] = useState('text');
    const [attempt, setAttempt] = useState(0);
    const [baseText, setBaseText] = useState(defaultWebsiteText);
    const [appearance, setAppearance] = useState(null);
    const [text, setText] = useState(defaultWebsiteText);
    const [photos, setPhotos] = useState({});
    const [pending, setPending] = useState({});
    const [crop, setCrop] = useState(null);
    const [error, setError] = useState('');
    const previews = useRef(new Map());
    const cropUpload = crop?.temporary ? crop.imageUrl : null;

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            readAppearance(controller.signal),
            readLegacyContact(controller.signal).catch(() => ({})),
        ]).then(([savedAppearance, legacyContact]) => {
            if (controller.signal.aborted) return;
            const base = { ...defaultWebsiteText, ...legacyContact };
            setBaseText(base);
            setText({ ...base, ...savedAppearance.text });
            setPhotos(savedAppearance.photos);
            setAppearance(savedAppearance);
        }).catch(failure => {
            if (!controller.signal.aborted) setError(failure.message);
        });
        return () => controller.abort();
    }, [attempt]);

    useEffect(() => {
        const urls = previews.current;
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
            urls.clear();
        };
    }, []);

    useEffect(() => {
        if (cropUpload) return () => URL.revokeObjectURL(cropUpload);
    }, [cropUpload]);

    function releasePreview(slot) {
        const url = previews.current.get(slot);
        if (url) URL.revokeObjectURL(url);
        previews.current.delete(slot);
    }

    function openCrop(photo, imageUrl, temporary = false) {
        setCrop({ photo, imageUrl, temporary });
        setError('');
    }

    function choosePhoto(photo, file) {
        if (!supportedImage.test(file.type) || !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
            setError('Pilih foto JPG, PNG, WEBP, atau GIF.');
            return;
        }
        if (!file.size || file.size > 10 * 1024 * 1024) {
            setError('Foto harus berisi data dan berukuran maksimal 10 MB.');
            return;
        }
        openCrop(photo, URL.createObjectURL(file), true);
    }

    function stagePhoto(slot, file) {
        const preview = URL.createObjectURL(file);
        releasePreview(slot);
        previews.current.set(slot, preview);
        setPending(current => ({ ...current, [slot]: { file, preview } }));
        setError('');
    }

    function resetPhoto(slot) {
        releasePreview(slot);
        setPending(current => withoutSlot(current, slot));
        setPhotos(current => withoutSlot(current, slot));
        setError('');
    }

    function photoField(photo) {
        const { slot, label, original } = photo;
        return <PhotoField
            key={slot}
            label={label}
            original={original}
            saved={photos[slot]}
            pending={pending[slot]}
            onPick={file => choosePhoto(photo, file)}
            onCrop={imageUrl => openCrop(photo, imageUrl)}
            onReset={() => resetPhoto(slot)}
        />;
    }

    async function handleSave(event) {
        event.preventDefault();
        if (saving) return;
        let textChanges;
        try {
            textChanges = textToSave(text, baseText);
        } catch (failure) {
            setTab('text');
            setError(failure.message);
            return;
        }

        setSaving(true);
        setError('');
        const nextPhotos = { ...photos };
        try {
            for (const [slot, { file }] of Object.entries(pending)) {
                const [url] = await uploadAppearancePhotos([file]);
                nextPhotos[slot] = url;
                setPhotos(current => ({ ...current, [slot]: url }));
                releasePreview(slot);
                setPending(current => withoutSlot(current, slot));
            }
            await saveAppearance({ text: textChanges, photos: nextPhotos, revision: appearance.revision });
            onSaved('Pengaturan website berhasil diperbarui!');
            onClose();
        } catch (failure) {
            setError(failure.message === 'Failed to fetch' ? 'Gagal menghubungi server.' : failure.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
        {crop && (
            <ImageCropModal
                imageUrl={crop.imageUrl}
                pagePhoto={crop.photo}
                onApply={file => {
                    stagePhoto(crop.photo.slot, file);
                    setCrop(null);
                }}
                onCancel={() => setCrop(null)}
            />
        )}
        <div
            ref={overlayRef}
            className="cmp-admin-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={saving ? undefined : dismiss}
            inert={Boolean(crop)}
        >
            <div
                className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white text-slate-800 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="website-settings-title"
                onClick={event => event.stopPropagation()}
            >
                <header className="flex shrink-0 items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cmp-blue-soft text-cmp-blue">
                        <Sliders size={20} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3 id="website-settings-title" className="text-lg font-bold text-slate-900">
                            Pengaturan Tampilan Website
                        </h3>
                        <p className="text-xs text-slate-600">
                            Atur konten, kontak, dan foto halaman website CMP.
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={saving}
                        aria-label="Tutup pengaturan"
                        onClick={dismiss}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </header>

                {!appearance ? (
                    <div className="p-8 text-center" aria-live="polite">
                        {error ? <>
                            <p className="text-sm text-cmp-red" role="alert">{error}</p>
                            <button type="button" className="mt-3 text-sm font-bold text-cmp-navy underline" onClick={() => {
                                setError('');
                                setAttempt(value => value + 1);
                            }}>Coba lagi</button>
                        </> : <Loader2 size={28} className="mx-auto animate-spin text-cmp-blue" aria-label="Memuat pengaturan" />}
                    </div>
                ) : (
                    <form onSubmit={handleSave} noValidate className="flex min-h-0 flex-1 flex-col">
                        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-100 px-5 py-3 sm:px-7" aria-label="Bagian pengaturan" role="group">
                            {tabs.map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={tab === key}
                                    onClick={() => setTab(key)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === key ? 'bg-cmp-navy text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >{label}</button>
                            ))}
                        </div>
                        <div key={tab} className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
                            <fieldset disabled={saving} className="min-w-0 space-y-5">
                                {tab === 'text' && textGroups.map(({ title, fields }) => (
                                    <section key={title} className="space-y-3">
                                        <h4 className="text-sm font-bold text-cmp-navy">{title}</h4>
                                        {fields.map(({ name, label, rows, ...input }) => (
                                            <label key={name} className="block text-sm font-semibold text-slate-700">
                                                {label}
                                                {rows
                                                    ? <textarea {...input} rows={rows} value={text[name]} onChange={e => setText({ ...text, [name]: e.target.value })} className={fieldClass} />
                                                    : <input {...input} value={text[name]} onChange={e => setText({ ...text, [name]: e.target.value })} className={fieldClass} />}
                                            </label>
                                        ))}
                                    </section>
                                ))}
                                {tab === 'photos' && sectionPhotoGroups.map(({ title, photos: group }) => (
                                    <section key={title} className="space-y-3">
                                        <h4 className="text-sm font-bold text-cmp-navy">{title}</h4>
                                        <div className="grid gap-3 sm:grid-cols-3">{group.map(photo => photoField(photo))}</div>
                                    </section>
                                ))}
                            </fieldset>
                        </div>
                        <footer className="shrink-0 space-y-3 border-t border-slate-100 px-5 py-4 sm:px-7">
                            {error && <p className="text-sm text-cmp-red" role="alert">{error}</p>}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-xs text-slate-600">{Object.keys(pending).length
                                    ? `${Object.keys(pending).length} foto menunggu diunggah.`
                                    : 'Foto asli dapat dipulihkan per posisi.'}</p>
                                <div className="flex gap-2">
                                    <button type="button" disabled={saving} onClick={dismiss} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
                                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-cmp-blue px-4 py-2 text-sm font-bold text-white hover:bg-cmp-navy disabled:opacity-60">
                                        {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                                        {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                )}
            </div>
        </div>
        </>
    );
}
