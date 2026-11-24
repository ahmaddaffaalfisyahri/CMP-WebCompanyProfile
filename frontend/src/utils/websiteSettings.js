import { API, getAuthHeaders } from './api.js';
import content from '../components/cmp/content.json';

export const publicApiEnabled = import.meta.env.VITE_CMP_API_ENABLED === 'true';

export const defaultWebsiteText = {
  heroTitle: 'Engineering\nfor Better\nPerformance.',
  heroDescription: 'Integrated Mechanical, Electrical & Automation solutions — from planning and engineering to installation, commissioning and maintenance.',
  establishedYear: 2020,
  disciplineCount: 3,
  projectSolutions: 'End-to-End',
  address: 'Komplek Grogol Permai Blok D4/D5, Jl. Dr. Latumenten, Grogol Petamburan, Jelambar.',
  phone: '+62 21-540-1398',
  email: 'info@ciptamajupersada.com',
};

// Reference crop frames match the public layout at 1440 px and 390 px.
const mobileHeroRatio = 7 / 15;

export const sectionPhotoGroups = [
  {
    title: 'Beranda',
    photos: [
      {
        slot: 'heroMain', label: 'Foto utama', original: '/cmp/806.jpg',
        cropFrames: { desktop: 11 / 16, mobile: mobileHeroRatio },
        desktopClip: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
      },
      { slot: 'heroTop', label: 'Foto kanan atas', original: '/cmp/884.jpg', cropFrames: { desktop: 1, mobile: mobileHeroRatio } },
      { slot: 'heroBottom', label: 'Foto kanan bawah', original: '/cmp/887.jpg', cropFrames: { desktop: 1, mobile: mobileHeroRatio } },
    ],
  },
  {
    title: 'About Us dan Vision & Mission',
    photos: [
      { slot: 'aboutTeam', label: 'Foto tim CMP', original: '/cmp/1127.jpg', cropFrames: { desktop: 16 / 11, mobile: 15 / 11 } },
      { slot: 'vision', label: 'Foto Our Vision', original: '/cmp/856.jpg', cropFrames: { desktop: 35 / 12, mobile: 41 / 20 } },
    ],
  },
];

export const originalSectionPhotos = Object.fromEntries(
  sectionPhotoGroups.flatMap(group => group.photos.map(photo => [photo.slot, photo.original])),
);

export function projectPhotoSlot(projectId, index) {
  return `${projectId}-${index}`;
}

export function getBundledProjects(photos) {
  return content.projects.map(project => ({
    ...project,
    images: project.images.map((original, index) => photos[projectPhotoSlot(project.id, index)] || original),
  }));
}

async function readResult(response, fallback) {
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) throw new Error(data?.error || fallback);
  return data.data;
}

export async function readAppearance(signal) {
  const response = await fetch(`${API}/settings/appearance`, { signal });
  const appearance = await readResult(response, 'Pengaturan tampilan belum bisa dimuat.');
  if (!appearance?.text || !appearance?.photos) throw new Error('Format pengaturan tampilan tidak valid.');
  return appearance;
}

export async function readLegacyContact(signal) {
  if (!publicApiEnabled) return {};
  const response = await fetch(`${API}/settings`, { signal });
  const { contact } = await readResult(response, 'Informasi kontak belum bisa dimuat.');
  if (!['address', 'phone', 'email'].every(key => typeof contact?.[key] === 'string' && contact[key].trim())) return {};
  const { address, phone, email } = contact;
  return { address, phone, email };
}

export async function saveAppearance(appearance) {
  const response = await fetch(`${API}/settings/appearance`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(appearance),
  });
  return readResult(response, 'Pengaturan tampilan gagal disimpan.');
}

export async function uploadAppearancePhotos(files) {
  const body = new FormData();
  for (const file of files) body.append('images', file);
  const response = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.urls?.length !== files.length) {
    throw new Error('Foto gagal diunggah. Periksa koneksi dan ukuran file.');
  }
  return result.urls;
}
