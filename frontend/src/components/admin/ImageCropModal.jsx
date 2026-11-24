import useMotionDismiss from '../../hooks/useMotionDismiss';
import { useId, useState, useRef } from 'react';
import { X, Crop, Check, RefreshCw, ZoomIn, ZoomOut, LayoutGrid, Maximize2 } from 'lucide-react';

const projectRatio = 4 / 3;
const pageFrames = [['desktop', 'Desktop'], ['mobile', 'Mobile']];

function coverDimensions(imageRatio, frameRatio, zoom = 1) {
    return {
        width: Math.max(1, imageRatio / frameRatio) * zoom,
        height: Math.max(1, frameRatio / imageRatio) * zoom,
    };
}

function constrainPan(pan, imageRatio, frameRatio, zoom) {
    const { width, height } = coverDimensions(imageRatio, frameRatio, zoom);
    const maxX = (width - 1) / 2;
    const maxY = (height - 1) / 2;
    return {
        x: Math.min(maxX, Math.max(-maxX, pan.x)),
        y: Math.min(maxY, Math.max(-maxY, pan.y)),
    };
}

/**
 * Modal Crop & Dual Card Preview (Desain Putih Bersih)
 * Menampilkan 2 preview interaktif secara sinkron:
 * 1. Tampilan Luar (Replika Card Website Utama)
 * 2. Tampilan Dalam (Replika Modal Detail saat Card Diklik)
 */
export default function ImageCropModal({
    imageUrl,
    onApply,
    onCancel,
    pagePhoto,
    projectTitle = '',
    projectCategory = '',
    projectDescription = ''
}) {
    const [overlayRef, dismiss] = useMotionDismiss(onCancel);
    const headingId = useId();
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [imageRatio, setImageRatio] = useState(null);
    const [sample, setSample] = useState(() => matchMedia('(max-width: 670px)').matches ? 'mobile' : 'desktop');
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const dragStart = useRef(null);
    const imgRef = useRef(null);
    const cropRatio = pagePhoto?.cropFrames[sample] || projectRatio;

    function changeZoom(value) {
        const next = Math.min(3, Math.max(1, value));
        setZoom(next);
        setPan(current => constrainPan(current, imageRatio || cropRatio, cropRatio, next));
    }

    function changeSample(next) {
        const ratio = pagePhoto.cropFrames[next];
        setSample(next);
        setPan(current => constrainPan(current, imageRatio || ratio, ratio, zoom));
    }

    function handlePointerDown(event) {
        if (event.button !== 0 || !imageRatio || dragStart.current) return;
        const { width, height } = event.currentTarget.getBoundingClientRect();
        dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, pan, width, height };
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
    }

    function handlePointerMove(event) {
        const start = dragStart.current;
        if (!start || event.pointerId !== start.pointerId) return;
        setPan(constrainPan({
            x: start.pan.x + (event.clientX - start.x) / start.width,
            y: start.pan.y + (event.clientY - start.y) / start.height,
        }, imageRatio, cropRatio, zoom));
    }

    function handlePointerEnd(event) {
        if (event.pointerId !== dragStart.current?.pointerId) return;
        dragStart.current = null;
        setIsDragging(false);
    }

    const panHandlers = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerEnd,
        onPointerCancel: handlePointerEnd,
        onLostPointerCapture: handlePointerEnd,
    };
    const cover = coverDimensions(imageRatio || cropRatio, cropRatio, zoom);
    const previewStyle = {
        left: `${(0.5 + pan.x) * 100}%`,
        top: `${(0.5 + pan.y) * 100}%`,
        width: `${cover.width * 100}%`,
        height: `${cover.height * 100}%`,
        transform: 'translate(-50%, -50%)',
    };

    const handleCropApply = () => {
        if (!imageRatio || applying) return;
        const img = imgRef.current;
        const canvas = document.createElement('canvas');
        const longestSide = pagePhoto ? 1200 : 960;
        const cropWidth = Math.round(longestSide * Math.min(cropRatio, 1));
        const cropHeight = Math.round(longestSide / Math.max(cropRatio, 1));
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setError('Editor tidak bisa menyiapkan hasil crop.');
            return;
        }
        const width = cropWidth * cover.width;
        const height = cropHeight * cover.height;
        setApplying(true);
        setError('');
        try {
            ctx.drawImage(img, cropWidth * (0.5 + pan.x) - width / 2, cropHeight * (0.5 + pan.y) - height / 2, width, height);
            canvas.toBlob(blob => {
                if (blob) {
                    onApply(new File([blob], `crop_${Date.now()}.jpg`, { type: 'image/jpeg' }));
                } else {
                    setApplying(false);
                    setError('Hasil crop tidak dapat disimpan. Coba lagi.');
                }
            }, 'image/jpeg', 0.92);
        } catch {
            setApplying(false);
            setError('Foto tidak dapat diproses. Coba pilih file gambar lain.');
        }
    };

    const displayTitle = projectTitle.trim() || 'Judul Proyek Anda';
    const displayCategory = projectCategory.trim() || 'Category';
    const displayDesc = projectDescription.trim() || 'Deskripsi singkat proyek akan tampil di sini sesuai dengan yang Anda ketikkan pada form...';

    function previewImage(primary) {
        return (
            <img
                ref={primary ? imgRef : undefined}
                src={imageUrl}
                crossOrigin={/^https?:\/\//i.test(imageUrl) ? 'anonymous' : undefined}
                alt={primary ? 'Crop Preview' : pagePhoto ? 'Pratinjau foto halaman' : 'Modal Preview'}
                draggable={false}
                onLoad={primary ? event => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (naturalWidth && naturalHeight) setImageRatio(naturalWidth / naturalHeight);
                } : undefined}
                onError={primary ? () => {
                    setImageRatio(null);
                    setError('Foto tidak dapat dimuat. Coba pilih gambar lain.');
                } : undefined}
                style={previewStyle}
                className={`pointer-events-none absolute max-w-none ${isDragging ? '' : 'motion-safe:transition-[width,height,top,left] motion-safe:duration-100'}`}
            />
        );
    }

    function pagePreview(device, label) {
        const primary = device === sample;
        const frameRatio = pagePhoto.cropFrames[device];
        const image = coverDimensions(cropRatio, frameRatio);
        return (
            <figure key={device} className="mx-auto w-full text-center" style={{ maxWidth: Math.min(340, 320 * frameRatio) }}>
                <figcaption className="mb-2 text-xs font-semibold text-slate-700">
                    {label} · {primary ? 'Area crop' : 'Pratinjau'}
                </figcaption>
                <div
                    className={`relative overflow-hidden rounded-xl bg-cmp-navy ${primary ? 'cursor-grab touch-none select-none active:cursor-grabbing' : ''}`}
                    style={{ aspectRatio: frameRatio, clipPath: device === 'desktop' ? pagePhoto.desktopClip : undefined }}
                    {...(primary ? panHandlers : {})}
                >
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                        style={{ width: `${image.width * 100}%`, height: `${image.height * 100}%` }}
                    >
                        {previewImage(primary)}
                    </div>
                </div>
            </figure>
        );
    }

    return (
        <div ref={overlayRef}
            className="cmp-admin-overlay fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div
                className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-4 sm:p-8 text-slate-800 my-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby={headingId}
                onKeyDown={event => {
                    if (event.key === 'Escape' && !applying) dismiss();
                }}
                onClick={e => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 id={headingId} className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <Crop size={20} className="text-cmp-blue" />
                            {pagePhoto ? `Sesuaikan foto · ${pagePhoto.label}` : 'Sesuaikan Posisi & Preview Foto Proyek'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {pagePhoto
                                ? 'Pilih bingkai Desktop atau Mobile, lalu geser dan atur zoom. Ukuran tampilan mengikuti lebar layar.'
                                : 'Geser dan sesuaikan zoom gambar. Tampilan akan otomatis terupdate di kedua simulasi di bawah.'}
                        </p>
                    </div>
                    <button type="button" disabled={applying} aria-label="Tutup editor foto" onClick={dismiss} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Kontrol Zoom & Reset */}
                <div className="my-5 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Crop size={15} className="text-cmp-blue" /> Atur Zoom Gambar (Geser untuk fokus):
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        <button type="button" aria-label="Perkecil foto" disabled={zoom <= 1 || applying} onClick={() => changeZoom(zoom - 0.25)} className="rounded-lg border border-slate-200 bg-white p-2 text-cmp-navy">
                            <ZoomOut size={16} aria-hidden="true" />
                        </button>
                        <input
                            type="range"
                            aria-label="Zoom foto"
                            autoFocus
                            disabled={applying}
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={e => changeZoom(Number(e.target.value))}
                            className="w-24 sm:w-48 accent-cmp-blue cursor-pointer"
                        />
                        <button type="button" aria-label="Perbesar foto" disabled={zoom >= 3 || applying} onClick={() => changeZoom(zoom + 0.25)} className="rounded-lg border border-slate-200 bg-white p-2 text-cmp-navy">
                            <ZoomIn size={16} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            disabled={applying}
                            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                            className="ml-2 flex items-center gap-1 text-xs text-slate-600 hover:text-cmp-blue px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium transition"
                        >
                            <RefreshCw size={12} /> Reset
                        </button>
                    </div>
                </div>

                {pagePhoto ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5">
                        <div className="mb-4 flex justify-center gap-2" role="group" aria-label="Bingkai crop">
                            {pageFrames.map(([device, label]) => (
                                <button
                                    key={device}
                                    type="button"
                                    disabled={applying}
                                    aria-pressed={sample === device}
                                    onClick={() => changeSample(device)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${sample === device ? 'bg-cmp-navy text-white' : 'border border-slate-300 bg-white text-cmp-navy hover:bg-cmp-blue-soft'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="grid items-start gap-4 sm:grid-cols-2">
                            {pageFrames.map(([device, label]) => pagePreview(device, label))}
                        </div>
                    </div>
                ) : (
                <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5 md:grid-cols-2">
                    
                    {/* PREVIEW 1: TAMPILAN LUAR (PERSIS SEPERTI CARD WEBSITE UTAMA) */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            <LayoutGrid size={15} className="text-cmp-blue" /> 1. Tampilan Luar (Card Website Utama)
                        </div>
                        <p className="text-[11px] text-slate-500 text-center mb-3">
                            Geser gambar di dalam kartu ini untuk menyesuaikan fokusnya:
                        </p>

                        <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-md">
                            <div className="relative aspect-4/3 cursor-grab touch-none select-none overflow-hidden bg-slate-900 active:cursor-grabbing" {...panHandlers}>
                                {previewImage(true)}
                                <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-cmp-blue shadow-sm pointer-events-none">
                                    {displayCategory}
                                </span>
                            </div>

                            <div className="flex flex-col p-4 sm:p-5 h-[120px] sm:h-[135px]">
                                <h2 className="text-sm sm:text-base font-bold text-cmp-navy line-clamp-2 leading-tight">
                                    {displayTitle}
                                </h2>
                                <p className="mt-1 text-xs text-gray-600 leading-relaxed line-clamp-2 flex-1">
                                    {displayDesc}
                                </p>
                            </div>
                            <div className="h-1 w-full bg-cmp-blue" />
                        </div>
                    </div>

                    {/* PREVIEW 2: TAMPILAN DALAM (SIMULASI MODAL DETAIL SAAT CARD DIBUKA) */}
                    <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            <Maximize2 size={15} className="text-cmp-blue" /> 2. Tampilan Dalam (Saat Membuka Card)
                        </div>
                        <p className="text-[11px] text-slate-500 text-center mb-3">
                            Bisa digeser & di-zoom juga, hasilnya sinkron secara realtime:
                        </p>

                        <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-md">
                            <div className="relative aspect-4/3 cursor-grab touch-none select-none overflow-hidden bg-slate-950 active:cursor-grabbing" {...panHandlers}>
                                {previewImage(false)}
                                <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] text-white backdrop-blur pointer-events-none">
                                    1 / 1
                                </span>
                            </div>

                            <div className="p-4 bg-white border-t border-slate-100 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block rounded-full bg-cmp-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-cmp-blue">
                                        {displayCategory}
                                    </span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-cmp-navy line-clamp-1">
                                    {displayTitle}
                                </h3>
                                <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">
                                    {displayDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                )}

                {error && <p role="alert" className="mt-4 text-sm text-cmp-red">{error}</p>}
                <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        disabled={applying}
                        onClick={dismiss}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={!imageRatio || applying}
                        onClick={handleCropApply}
                        className="flex-1 py-3 rounded-xl bg-cmp-blue hover:bg-cmp-navy text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-cmp-blue/20 disabled:opacity-60"
                    >
                        <Check size={18} /> Simpan Foto Terpilih
                    </button>
                </div>
            </div>
        </div>
    );
}
