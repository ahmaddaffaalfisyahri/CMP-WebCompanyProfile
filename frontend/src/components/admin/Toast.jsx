import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = {
        success: 'bg-emerald-500',
        error:   'bg-red-500',
        info:    'bg-cmp-blue',
    };

    return (
        <div
            role="status"
            className={`cmp-admin-toast fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-5 py-4 text-white shadow-2xl ${colors[type] || colors.info}`}
        >
            {type === 'success' && <CheckCircle2 size={20} />}
            {type === 'error'   && <AlertCircle  size={20} />}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">
                <X size={16} />
            </button>
        </div>
    );
}
