export const API = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '') || '/api';
const apiOrigin = /^https?:\/\//i.test(API) ? new URL(API).origin : '';

export function imageUrl(path) {
    return typeof path === 'string' && path.startsWith('/uploads/') ? apiOrigin + path : path;
}

export function getAuthHeaders(extra = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cmp_admin_token') : null;
    return token ? { ...extra, 'Authorization': `Bearer ${token}` } : extra;
}

export const DEFAULT_TITLES = [
    'Coal Mining SCADA & Apron Feeder Automation',
    'Industrial PLC & SCADA Control Panels',
    'Vessel Web Analyzer & Marine Automation',
    'Cement Carrier Automation & Electrical Systems',
    'Marine Electrical Maintenance & Retrofits',
    'Industrial SCADA Monitoring & Telemetry',
    'Automated Pump & Fluid Transfer Systems',
    'Compressed Air Dewpoint & Facility Monitoring',
    'Robotic Automation & Assembly Integration',
    'Solar PV Power System Installation & Erection',
];

export const DEFAULT_CATEGORIES = ['Automation', 'Engineering', 'Marine', 'Construction'];
