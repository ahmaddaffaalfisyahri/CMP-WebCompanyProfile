import React, { useState, useRef } from 'react';
import { X, Crop, Check, RefreshCw, ZoomIn, ZoomOut, LayoutGrid, Maximize2 } from 'lucide-react';

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
    projectTitle = '',
    projectCategory = '',
    projectDescription = ''
}) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const imgRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleCropApply = () => {
        if (!imgRef.current) return;
        const img = imgRef.current;
        const canvas = document.createElement('canvas');
        const targetWidth = 960;
        const targetHeight = 600; // Rasio presisi 16:10
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#021f35';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const containerW = 340;
        const scaleFactor = targetWidth / containerW;

        const renderedW = img.offsetWidth * zoom * scaleFactor;
        const renderedH = img.offsetHeight * zoom * scaleFactor;
        const posX = (targetWidth - renderedW) / 2 + pan.x * scaleFactor;
        const posY = (targetHeight - renderedH) / 2 + pan.y * scaleFactor;

        ctx.drawImage(img, posX, posY, renderedW, renderedH);

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], `crop_${Date.now()}.jpg`, { type: 'image/jpeg' });
                onApply(croppedFile, canvas.toDataURL('image/jpeg', 0.92));
            }
        }, 'image/jpeg', 0.92);
    };

    const displayTitle = projectTitle.trim() || 'Judul Proyek Anda';
    const displayCategory = projectCategory.trim() || 'Category';
    const displayDesc = projectDescription.trim() || 'Deskripsi singkat proyek akan tampil di sini sesuai dengan yang Anda ketikkan pada form...';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-8 text-slate-800 my-auto"
                 onClick={e => e.stopPropagation()}
                 style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <Crop size={20} className="text-[#007CA7]" /> Sesuaikan Posisi & Preview Foto Proyek
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Geser dan sesuaikan zoom gambar. Tampilan akan otomatis terupdate di kedua simulasi di bawah.
                        </p>
                    </div>
                    <button onClick={onCancel} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Kontrol Zoom & Reset */}
                <div className="my-5 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Crop size={15} className="text-[#007CA7]" /> Atur Zoom Gambar (Geser untuk fokus):
                    </span>
                    <div className="flex items-center gap-3">
                        <ZoomOut size={15} className="text-slate-400" />
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-40 sm:w-56 accent-[#007CA7] cursor-pointer"
                        />
                        <ZoomIn size={15} className="text-slate-400" />
                        <button
                            type="button"
                            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                            className="ml-2 flex items-center gap-1 text-xs text-slate-600 hover:text-[#007CA7] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium transition"
                        >
                            <RefreshCw size={12} /> Reset
                        </button>
                    </div>
                </div>

                {/* Dual Preview Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    
                    {/* PREVIEW 1: TAMPILAN LUAR (PERSIS SEPERTI CARD WEBSITE UTAMA) */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            <LayoutGrid size={15} className="text-[#007CA7]" /> 1. Tampilan Luar (Card Website Utama)
                        </div>
                        <p className="text-[11px] text-slate-500 text-center mb-3">
                            Geser gambar di dalam kartu ini untuk menyesuaikan fokusnya:
                        </p>

                        <div className="w-[300px] sm:w-[340px] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden text-left">
                            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing select-none"
                                 onMouseDown={handleMouseDown}
                                 onMouseMove={handleMouseMove}
                                 onMouseUp={handleMouseUp}
                                 onMouseLeave={handleMouseUp}>
                                <img
                                    ref={imgRef}
                                    src={imageUrl}
                                    alt="Crop Preview"
                                    draggable={false}
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                        transition: isDragging ? 'none' : 'transform 0.08s ease-out'
                                    }}
                                    className="max-w-none w-full h-full object-cover pointer-events-none"
                                />
                                <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-[#007CA7] shadow-sm pointer-events-none">
                                    {displayCategory}
                                </span>
                            </div>

                            <div className="flex flex-col p-4 sm:p-5 h-[120px] sm:h-[135px]">
                                <h2 className="text-sm sm:text-base font-bold text-[#03365b] line-clamp-2 leading-tight">
                                    {displayTitle}
                                </h2>
                                <p className="mt-1 text-xs text-gray-600 leading-relaxed line-clamp-2 flex-1">
                                    {displayDesc}
                                </p>
                            </div>
                            <div className="h-1 w-full bg-[#007CA7]" />
                        </div>
                    </div>

                    {/* PREVIEW 2: TAMPILAN DALAM (SIMULASI MODAL DETAIL SAAT CARD DIBUKA) */}
                    <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                            <Maximize2 size={15} className="text-[#007CA7]" /> 2. Tampilan Dalam (Saat Membuka Card)
                        </div>
                        <p className="text-[11px] text-slate-500 text-center mb-3">
                            Bisa digeser & di-zoom juga, hasilnya sinkron secara realtime:
                        </p>

                        <div className="w-[300px] sm:w-[340px] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden text-left">
                            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                                 onMouseDown={handleMouseDown}
                                 onMouseMove={handleMouseMove}
                                 onMouseUp={handleMouseUp}
                                 onMouseLeave={handleMouseUp}>
                                <img
                                    src={imageUrl}
                                    alt="Modal Preview"
                                    draggable={false}
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                        transition: isDragging ? 'none' : 'transform 0.08s ease-out'
                                    }}
                                    className="max-w-none w-full h-full object-contain pointer-events-none"
                                />
                                <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] text-white backdrop-blur pointer-events-none">
                                    1 / 1
                                </span>
                            </div>

                            <div className="p-4 bg-white border-t border-slate-100 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block rounded-full bg-[#007CA7]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007CA7]">
                                        {displayCategory}
                                    </span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-[#03365b] line-clamp-1">
                                    {displayTitle}
                                </h3>
                                <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">
                                    {displayDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleCropApply}
                        className="flex-1 py-3 rounded-xl bg-[#007CA7] hover:bg-[#005f80] text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-[#007CA7]/20"
                    >
                        <Check size={18} /> Simpan Foto Terpilih
                    </button>
                </div>
            </div>
        </div>
    );
}
