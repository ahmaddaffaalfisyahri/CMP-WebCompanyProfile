import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-slate-800"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{message}</p>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow shadow-rose-600/30 cursor-pointer"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
