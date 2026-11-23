# Hasil analisis project CMP Company Profile

**Snapshot workspace 23 November 2026.** Kode aktif menjadi acuan. [README](../../README.md), [laporan implementasi](../../IMPLEMENTATION_REPORT.md), dan [rencana refaktor](../REFACTOR_PLAN.md) dipakai sebagai konteks. Direktori usulan `backend/src/` dalam rencana refaktor belum menjadi struktur yang dirujuk modul.

## Fungsi aplikasi dan arsitektur

- Situs publik menampilkan profil CMP, portofolio, galeri, dan kontak. React Router memasang `/` untuk publik serta `/admin` dan `/login` untuk portal yang sama. [Router React](../../frontend/src/App.jsx)
- Admin menyediakan login dan verifikasi, CRUD proyek, unggah/crop foto, pengaturan web, inbox pesan, serta pembaruan profil. API frontend memakai base relatif `/api`. [Admin](../../frontend/src/pages/Admin.jsx) · [Helper API](../../frontend/src/utils/api.js)
- Mode publik aktif memakai REST untuk proyek/kontak jika `VITE_CMP_API_ENABLED=true`. Mode default memakai dataset lokal dan layanan kirim pesan publik tidak aktif. Saat fetch proyek gagal, UI mempertahankan data fallback. Form kontak memakai JSON saat integrasi aktif. [Komponen publik](../../frontend/src/components/cmp/Interactive.jsx) · [Dataset](../../frontend/src/components/cmp/content.json)
- Vite development mem-proxy `/api` dan `/uploads` ke `localhost:3001`. Express menerima HTTP, melakukan parsing, menjalankan router dan controller. Penyimpanan tergantung resource. [Vite](../../frontend/vite.config.js) · [Server](../../backend/server.js)

```text
Browser / React
  ├─ mode publik default → content.json dan aset /cmp/
  └─ admin atau API publik aktif → /api → Vite proxy dev → Express
                                                         ├─ pg → public.projects
                                                         ├─ fs → settings.json, messages.json
                                                         └─ Multer/fs → backend/uploads/
Browser → GET /uploads/... → Express static → file gambar
```

## Entry point, skrip, dan dependensi

- Frontend dimulai dari [index.html](../../frontend/index.html), [main.jsx](../../frontend/src/main.jsx) dan [App.jsx](../../frontend/src/App.jsx). Stack aktif meliputi React, Vite, React Router, Tailwind CSS, Lucide, serta plugin React, Babel/Rolldown dan ESLint pada toolchain. EmailJS ditemukan pada komponen kontak lama. [Manifest frontend](../../frontend/package.json)
- Backend dimulai dari [server.js](../../backend/server.js). File ini memanggil dotenv sebelum mengimpor router, memasang CORS, parser JSON dan URL-encoded, static uploads, router domain dan fallback 404. Proses membuka port `PORT` atau default 3001, kecuali `NODE_ENV=test`.
- Di root, `npm run dev` meneruskan ke frontend. `npm run dev:backend` mendelegasikan skrip dev ke backend. Di folder backend, `npm run dev` memanggil nodemon, sementara `npm start` memanggil `node server.js`. Stack backend meliputi Express 4, pg, cors, dotenv dan Multer. Tidak ditemukan skrip test dalam manifest. [Skrip root](../../package.json) · [Manifest backend](../../backend/package.json)
- `backend/routes/` memetakan method dan path, `backend/controllers/` berisi handler serta akses storage, dan `backend/config/db.js` menyiapkan pool. Middleware Bearer ada di `backend/middleware/auth.js`. Akses proyek memakai SQL langsung di controller. Layer models, ORM, services, dan repositories khusus tidak ditemukan. [Controller proyek](../../backend/controllers/projectsController.js) · [Pool](../../backend/config/db.js) · [Guard](../../backend/middleware/auth.js)

## PostgreSQL dan penyimpanan lain

Audit katalog baca saja menemukan PostgreSQL lokal 17.11 dan satu tabel aplikasi pada schema `public`, yaitu `public.projects`. Primary key adalah `id`, tanpa foreign key. Metadata sesuai DDL di seeder. Snapshot lokal yang diperiksa berisi 10 baris dan 20 referensi gambar. [Definisi skema](../../backend/seed.js)

| Kolom | Tipe | Aturan atau default |
| --- | --- | --- |
| `id` | `integer` (dideklarasikan `SERIAL`) | PK, NOT NULL, sequence |
| `category` | `varchar(100)` | NOT NULL |
| `title` | `varchar(255)` | NOT NULL |
| `description` | `text` | Boleh NULL |
| `tag` | `varchar(100)` | Boleh NULL |
| `images` | `jsonb` | Boleh NULL, default array kosong |
| `created_at` | `timestamp with time zone` | Boleh NULL, default `now()` |
| `updated_at` | `timestamp with time zone` | Boleh NULL, default `now()`; UPDATE proyek menyetel waktu eksplisit |

- Pesan dan settings memakai `backend/data/messages.json` dan `backend/data/settings.json`. Pembacaan dapat membuat default jika file belum ada. Data pribadi dari inbox tidak diambil untuk analisis ini. [Controller pesan](../../backend/controllers/messagesController.js) · [Controller pengaturan](../../backend/controllers/settingsController.js)
- File upload dilayani dari `backend/uploads/`. Database memuat rujukan gambar, bukan biner file. Foto publik bawaan berada di `frontend/public/cmp/`. [Controller upload](../../backend/controllers/uploadController.js) · [Aset portofolio](../../frontend/src/components/cmp/content.json)
- Seeder membuat skema bila perlu, menghapus semua row proyek, menyalin sejumlah foto demo, lalu memasukkan data contoh. Seeder tidak dijalankan untuk analisis atau validasi. [Seeder](../../backend/seed.js)

## Inventaris endpoint

Kolom akses **Bearer** berarti request memerlukan token autentikasi. Endpoint `verify` melakukan pengecekan di controller. Path berikut adalah path Express.

| HTTP dan path | Akses | Respons sukses / efek |
| --- | --- | --- |
| `GET /api/health` | Publik | 200, `{status, time}`; tanpa query SQL |
| `GET /api`, `GET /` | Publik | 200, halaman status HTML backend |
| `GET /api/projects` | Publik | 200, array urut `created_at DESC` |
| `GET /api/projects/:id` | Publik | 200, objek proyek |
| `POST /api/projects` | Bearer | 201, objek proyek yang dibuat |
| `PUT /api/projects/:id` | Bearer | 200, objek hasil update parsial |
| `DELETE /api/projects/:id` | Bearer | 200, `{message, project}` |
| `GET /api/settings` | Publik | 200, `{ok, data}` dengan hero/contact |
| `PUT /api/settings` | Bearer | 200, `{ok, message, data}` |
| `GET /api/messages` | Bearer | 200, `{ok, data}`, terbaru dahulu |
| `POST /api/messages` | Publik | 201, `{ok, message, data}`, menulis inbox JSON |
| `PUT /api/messages/:id/status` | Bearer | 200, `{ok, message, data}` |
| `DELETE /api/messages/:id` | Bearer | 200, `{ok, message}` |
| `POST /api/upload` | Bearer | 200, `{urls}`. Multipart `images`, maksimal 20 file dan 10 MB/file |
| `DELETE /api/upload` | Bearer | 200, `{message, filename}`, menghapus file fisik |
| `GET /uploads/:filename` | Publik | 200, file fisik jika ada |
| `POST /api/auth/login`, `POST /api/login/login` | Publik | 200, `{ok, message, token, user}` |
| `GET /api/auth/verify`, `GET /api/login/verify` | Bearer (controller) | 200, `{ok, user}` |
| `GET /api/auth/profile`, `GET /api/login/profile` | Bearer | 200, `{ok, user}` |
| `PUT /api/auth/update-profile`, `PUT /api/login/update-profile` | Bearer | 200, `{ok, message, token, user}`; memperbarui `.env` |
| `POST /api/auth/logout`, `POST /api/login/logout` | Publik | 200, `{ok, message}`; client membersihkan sesi lokal |
| Fallback semua method | Publik | 404, `{error: 'Route not found'}` |

Sumber routing. [Server](../../backend/server.js) · [Proyek](../../backend/routes/projects.js) · [Pengaturan](../../backend/routes/settings.js) · [Pesan](../../backend/routes/messages.js) · [Unggah](../../backend/routes/upload.js) · [Auth](../../backend/routes/auth.js)

## Alur CRUD proyek dan autentikasi

1. Form admin merapikan field dan meneruskan objek ke `handleSave`. Fungsi membedakan POST dari PUT memakai state `editing`, memberi header JSON/Bearer dan menunggu response. [Form](../../frontend/src/components/admin/ProjectFormModal.jsx) · [Admin](../../frontend/src/pages/Admin.jsx)
2. Parser Express membentuk `req.body`, route mencocokkan URL dan method, lalu `requireAuth` memverifikasi token untuk operasi tulis. [Server](../../backend/server.js) · [Router](../../backend/routes/projects.js)
3. Controller memeriksa field wajib pada create, melakukan `pool.query` dengan binding posisi, dan serialisasi images menjadi JSON. UPDATE memakai COALESCE. PostgreSQL mengembalikan row dengan RETURNING. [Controller proyek](../../backend/controllers/projectsController.js)
4. Controller mengirim JSON. Admin menangani sukses/gagal dan memuat ulang daftar. Driver HTTP fetch tetap memberi objek Response untuk HTTP gagal. Saat ini jalur hapus belum memeriksa `res.ok`, dan load menerima array saja tanpa pemeriksaan status eksplisit. [Admin](../../frontend/src/pages/Admin.jsx)
5. Login membuat token HMAC dua bagian dengan masa berlaku tujuh hari. Browser menaruh token di localStorage dan helper mengirim header Bearer. Route tulis dilindungi guard, sedangkan proyek dan pengaturan bisa dibaca publik. Pembaruan profil menulis file environment, dan logout tidak mencabut token di server. [Auth](../../backend/controllers/authController.js) · [Guard](../../backend/middleware/auth.js) · [Login](../../frontend/src/components/admin/LoginPortal.jsx) · [Helper](../../frontend/src/utils/api.js)

## Konfigurasi dan batas validasi

- Nama variabel backend yang relevan adalah `PORT`, `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ADMIN_USER`, `ADMIN_PASSWORD`, dan `AUTH_SECRET`. Frontend memakai `VITE_CMP_API_ENABLED`. Tidak ada nilai credential runtime yang dicantumkan. [Contoh backend](../../backend/.env.example) · [Contoh frontend](../../frontend/.env.example)
- Metadata PostgreSQL, PK, jumlah FK dan jumlah referensi gambar diverifikasi melalui transaksi baca saja. Target database pada konfigurasi backend saat penyusunan tidak ditemukan di instans PostgreSQL lokal yang diperiksa. Audit memakai database lokal yang tersedia, tanpa menyunting konfigurasi.
- Smoke test memakai Express sementara dan konfigurasi proses lokal yang diarahkan ke database audit dengan mode baca saja. Health, daftar, detail, dan satu file upload memberi 200. Route tak dikenal memberi 404. Profile dan alias verify tanpa Bearer memberi 401.
- Tidak ada pengujian penulisan data, login berhasil, perubahan profil, unggah, migrasi, seeder, atau deployment. Endpoint lain diinventarisasi dari source. Konfigurasi produksi dan database di luar instans lokal tidak dianalisis. [Konfigurasi Vercel yang terdeteksi](../../frontend/vercel.json)
