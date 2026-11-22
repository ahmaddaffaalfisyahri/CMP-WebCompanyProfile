# Rencana refaktor CMP Company Profile

Fase 1 · 22 November 2026 · Menunggu persetujuan Fase 2

## Arsitektur saat ini

- **Repository dan dependensi.** Satu repository Git berisi frontend dan backend. Ketiganya memiliki manifest dan lockfile npm. Root belum memakai npm workspaces. `postinstall` root menjalankan `npm install` untuk masing-masing aplikasi, `npm run dev` menjalankan frontend, dan tersedia `dev:frontend`, `dev:backend`, `build`, `lint`, serta `preview`. Frontend memiliki skrip Vite dan ESLint. Backend memiliki `start` untuk Node dan `dev` untuk nodemon. [Manifest root](../package.json) · [Manifest frontend](../frontend/package.json) · [Manifest backend](../backend/package.json)
- **Frontend aktif.** `index.html` memuat `src/main.jsx`, yang mengimpor CSS global dan me-render `App.jsx`. `BrowserRouter` mengarahkan `/` ke situs publik CMP dan `/admin` serta `/login` ke portal CMS yang sama. Situs publik merangkai navigasi, konten perusahaan, portofolio, kontak, dan footer. Tailwind v4 terpasang melalui plugin Vite. Logo diimpor dari `src/assets/`, sementara aset publik tersedia melalui `/cmp/`. [Router](../frontend/src/App.jsx) · [Situs publik](../frontend/src/components/cmp/CMPPublicSite.jsx) · [Konfigurasi Vite](../frontend/vite.config.js)
- **Alur frontend ke backend.** Frontend memakai URL relatif `/api`; proxy Vite meneruskan `/api` dan `/uploads` ke `localhost:3001`. Portal CMS tetap memakai API dan menyimpan sesi di `localStorage` melalui `cmp_admin_token` dan `cmp_admin_user`. Situs publik mengakses proyek, kontak, dan pengiriman pesan hanya jika `VITE_CMP_API_ENABLED=true`. Pada mode default, portofolio memakai tujuh proyek lokal dan form memberi status layanan belum tersedia. Saat integrasi aktif, respons proyek kosong menghasilkan tampilan kosong, sedangkan kegagalan API mempertahankan data lokal. [Helper API](../frontend/src/utils/api.js) · [Interaksi publik](../frontend/src/components/cmp/Interactive.jsx) · [Contoh environment frontend](../frontend/.env.example)
- **Backend dan penyimpanan.** `backend/server.js` memasang Express, CORS, parser request, router, dan static serving. `config/db.js` membuat `pg.Pool`; controller proyek langsung menjalankan SQL ke tabel `projects`, dengan foto direferensikan lewat field `images` bertipe JSONB. Pengaturan dan pesan ada di dua file JSON dalam `backend/data/`. Multer menyimpan gambar fisik di `backend/uploads/`. HMAC Bearer dipakai untuk sesi admin, dan pembaruan profil membaca serta menulis `backend/.env`. [Server](../backend/server.js) · [Koneksi PostgreSQL](../backend/config/db.js) · [Controller autentikasi](../backend/controllers/authController.js) · [Router upload](../backend/routes/upload.js)
- **Dokumentasi terdahulu.** README masih mencampur petunjuk aktif dengan struktur lama. `PROJECT_ANALYSIS.md` mendokumentasikan CITASys sebelum peralihan. `IMPLEMENTATION_REPORT.md` mendokumentasikan frontend publik CMP dan pengujian saat itu. Peta refaktor mengikuti source aktif, dengan kedua laporan dipertahankan sebagai referensi historis. [README](../README.md) · [Analisis sebelumnya](../PROJECT_ANALYSIS.md) · [Laporan implementasi sebelumnya](../IMPLEMENTATION_REPORT.md)

### Kontrak HTTP yang perlu dipertahankan

- `GET /` dan `GET /api` menyajikan halaman status backend. `GET /api/health` memberi status proses. Endpoint health saat ini tidak memeriksa koneksi PostgreSQL. Catch-all mengembalikan respons JSON 404. [Server](../backend/server.js)
- `GET /api/projects` mengembalikan array dengan data terbaru lebih dulu. `GET /api/projects/:id` mengembalikan satu objek. `POST /api/projects`, `PUT /api/projects/:id`, dan `DELETE /api/projects/:id` dilindungi Bearer dan memakai format respons yang sudah ada. [Router proyek](../backend/routes/projects.js) · [Controller proyek](../backend/controllers/projectsController.js)
- `GET /api/settings` publik dan `PUT /api/settings` memerlukan Bearer. `POST /api/messages` publik, sedangkan `GET /api/messages`, `PUT /api/messages/:id/status`, dan `DELETE /api/messages/:id` memerlukan Bearer. Format `ok`, `data`, dan pesan dipertahankan sesuai masing-masing handler. [Router pengaturan](../backend/routes/settings.js) · [Router pesan](../backend/routes/messages.js)
- Router autentikasi terpasang dengan dua prefix, `/api/auth` dan alias `/api/login`. Keduanya menyediakan `POST /login`, `GET /verify`, `GET /profile`, `PUT /update-profile`, dan `POST /logout` relatif terhadap prefix. Verify memeriksa token di controller. Profile dan update-profile memakai middleware Bearer. Logout mempertahankan perilaku respons yang ada. [Router autentikasi](../backend/routes/auth.js) · [Pemasangan router](../backend/server.js)
- `POST /api/upload` dan `DELETE /api/upload` memerlukan Bearer. POST menerima multipart field `images`, maksimum 20 file dan 10 MB per file, lalu mengembalikan `{ urls }`. URL `/uploads/<filename>` tetap dilayani secara publik. [Router upload](../backend/routes/upload.js) · [Controller upload](../backend/controllers/uploadController.js)

## Masalah yang ditemukan

1. **Batas tanggung jawab frontend kabur.** Komponen situs publik memuat layout, navigasi, dan observer sekaligus. `Interactive.jsx` menangani portofolio, galeri, form kontak, dan akses API. Request `fetch` tersebar di halaman dan modal admin. Helper API juga menyimpan opsi judul dan kategori CMS.
2. **Kode aktif dan historis bercampur.** Router aktif sudah memakai situs CMP. `components/sections/`, `components/layout/Navbar.jsx`, dan `components/cmp/ProjectCard.jsx` tidak terhubung ke route aktif. Beberapa section historis mengimpor aset yang sudah tidak tersedia, seperti `worldMapPath.js` dan `home.png`. Card portofolio aktif didefinisikan di `Interactive.jsx`. Kode historis akan tetap tersedia untuk menjaga inventaris komponen.
3. **Path runtime terikat pada lokasi modul.** `dotenv` dipanggil di server, koneksi database, dan seeder. Controller pengaturan, pesan, autentikasi, dan upload menghitung lokasi file masing-masing. Pemindahan ke `src/` tanpa perubahan ini dapat mengarahkan pembacaan atau penulisan ke lokasi baru dan membuat file default, inbox kosong, atau gambar hilang dari tampilan. Probe awal PostgreSQL saat ini mengambil koneksi pool tanpa melepas klien saat berhasil.
4. **Instalasi dan dokumentasi dapat memberi hasil berbeda.** Lockfile root kosong dan namanya berbeda dari manifest. Instalasi root menjalankan instalasi package lewat lifecycle hook, sedangkan README mencantumkan Node 18+. Paket terpasang yang diperiksa secara lokal mencakup Vite 8.1.3 dengan syarat Node `^20.19.0 || >=22.12.0` dan ESLint 10.6.0 dengan syarat `^20.19.0 || ^22.13.0 || >=24`. `@headlessui/react` dan `@heroicons/react` terdeklarasi tanpa pemakaian yang ditemukan di source. EmailJS masih diimpor oleh komponen historis.
5. **Setup database lama berisiko.** Quick start README mengarahkan pengguna ke `backend/seed.js`. Script tersebut menjalankan `DELETE FROM projects` tanpa filter sebelum memasukkan data contoh. Script juga menyalin gambar ke direktori upload dan masih mengacu ke aset frontend lama. [Seeder](../backend/seed.js)
6. **Deployment punya asumsi path dan storage.** `frontend/vercel.json` mendefinisikan backend sebagai `root: "backend"` dan rewrite untuk `/api`, tetapi tidak mendefinisikan rewrite `/uploads` sebelum fallback SPA. Lokasi file konfigurasi dan root deployment yang efektif masih perlu dicocokkan. Portal CMS juga membutuhkan filesystem persisten dan dapat ditulis untuk upload, JSON, dan pembaruan profil. [Konfigurasi deployment](../frontend/vercel.json)

## Arsitektur yang diusulkan

```text
CMP Company Profile/
├── frontend/
│   ├── public/cmp/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       Komponen CMS, bagian situs CMP, dan komponen historis
│   │   ├── hooks/
│   │   ├── layouts/          Layout publik CMP
│   │   ├── pages/            Halaman publik dan CMS yang sudah ada
│   │   ├── routes/           Pemetaan route frontend
│   │   ├── services/         Request HTTP client
│   │   ├── styles/           CSS global dan transisi global
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── app.js            Perakitan Express
│   │   ├── config/           Environment, path runtime, dan PostgreSQL pool
│   │   ├── controllers/      Status dan respons HTTP
│   │   ├── middleware/       Bearer guard
│   │   ├── repositories/     SQL proyek dan akses file JSON
│   │   ├── routes/           Pemetaan endpoint dan Multer
│   │   └── services/         Kredensial admin dan operasi file upload
│   ├── data/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── REFACTOR_PLAN.md
│   └── REFACTOR_REPORT.md
├── .gitignore
├── package.json
└── README.md
```

Pembagian mengikuti tanggung jawab yang sudah ada. Query proyek masuk repository tanpa service perantara. Komponen admin tetap dikelompokkan bersama dan memakai layanan HTTP yang dapat dipakai fitur CMS lain. Perubahan data, skema, branding, atau konten berada di luar refaktor ini.

### Peta migrasi file

**Frontend**

- `src/App.jsx` → `src/routes/AppRoutes.jsx`. `main.jsx` me-render router tersebut dengan tiga URL yang sama.
- `src/components/cmp/CMPPublicSite.jsx` → layout `src/layouts/PublicLayout.jsx` untuk navigasi, observer, dan footer, serta komposisi halaman di `src/pages/CompanyProfile.jsx`. Struktur DOM dan urutan elemen dipertahankan karena CSS dan observer bergantung pada selector yang ada.
- `src/components/cmp/Interactive.jsx` → `Portfolio.jsx` dan `Contact.jsx` di `components/cmp/`. Pindahkan card dan galeri aktif bersama modul portofolio dalam tahap ini. `Sections.jsx` dan template keluaran `scripts/extract-cmp.cjs` memakai import baru yang sama. `content.json`, `prototype.css`, `refinements.css`, dan `motion.css` khusus CMP tetap berdekatan dengan bagian situs.
- `src/utils/api.js` dan request di `pages/Admin.jsx`, komponen publik, serta modal CMS → `src/services/`, dikelompokkan menurut resource auth, proyek, pesan, pengaturan, dan upload. Pindahkan juga request REST yang tersisa di section historis dengan mempertahankan perilaku masing-masing. Opsi judul dan kategori dipindah ke konstanta di `components/admin/`. Parsing respons dan penanganan error dipindah sesuai kebutuhan setiap pemanggil.
- `src/index.css` dan `src/motion.css` → `src/styles/` dengan urutan import yang sama. `App.css` yang tidak terimpor tetap dipertahankan. Hook, komponen admin, aset biner, dan semua nama file di `public/cmp/` tetap berada di lokasi sekarang.

**Backend**

- `backend/server.js` tetap menjadi entry point produksi dan dev. Pindahkan perakitan middleware, static serving, route mounting, tampilan status, dan handler fallback ke `src/app.js`. Pertahankan ekspor aplikasi, aturan listen saat `NODE_ENV=test`, URL status, serta default port.
- `backend/{config,controllers,middleware,routes}/` → folder dengan nama yang sama di `backend/src/`. Tambahkan konfigurasi environment dan path berbasis root fisik `backend/`, dipakai bersama oleh server, pool, seeder, controller profil, repository JSON, serta Multer dan static serving.
- SQL dari `projectsController.js` → `src/repositories/projectsRepository.js`. Pembacaan dan penulisan JSON dari controller pesan/pengaturan → repository masing-masing. Pertahankan parameter SQL, urutan hasil, JSONB, perilaku default saat file belum tersedia, dan format data.
- Akses kredensial/penulisan `.env` dari controller autentikasi dan operasi disk upload dari controller upload → modul service masing-masing. Route dan middleware tetap menangani multipart dan Bearer. Pertahankan prioritas sumber kredensial dan jalur pembaruan profil, format token, nama field upload, dan pemetaan URL publik.
- `backend/data/`, `backend/uploads/`, dan `backend/.env` tetap di disk pada lokasi semula. Sesuaikan hanya referensi kode di `seed.js` yang terdampak pemindahan modul. Pertahankan script lama sebagai referensi dan keluarkan dari panduan setup rutin. Dokumentasikan setup skema kosong yang eksplisit dan terpisah dari data demo.

### Perubahan konfigurasi yang diperlukan

- Pertahankan instalasi independen dengan manifest dan lockfile per aplikasi. Di root, selaraskan metadata lockfile root, ganti `postinstall` implisit dengan skrip instalasi eksplisit yang memakai `npm ci --prefix` per aplikasi, dan pertahankan perintah dari direktori aplikasi. Pertahankan `npm run dev` untuk frontend dan tambahkan `npm run dev:all` untuk menjalankan kedua proses serta meneruskan penghentian dan status gagal proses anak. Usulan ini memakai Node bawaan dan tidak menambah dependensi orkestrasi. Tinjau dependensi frontend yang tampak tak terpakai sebelum menghapusnya dari manifest dan lockfile.
- Dokumentasikan Node 22.13+ pada lini 22 atau Node 24+ sebagai baseline yang sesuai dengan tooling lokal. Pertahankan plugin Tailwind, React, dan compiler Vite, lalu validasi CSS hasil build dan cakupan pemindaian kelas setelah file dipindah.
- Pertahankan default `/api`, `/uploads`, port 3001, dan flag publik dalam mode nonaktif. Contoh environment memuat nama variabel dan placeholder aman dengan nilai kredensial kosong. Rapikan aturan ignore agar file environment lokal dikecualikan dan kedua `.env.example` tetap dapat dilacak. Data JSON serta gambar yang sudah dilacak tetap berada dalam inventaris Git yang sama.
- Perbaiki panduan setup dan deployment di README, termasuk build Vite, `npm start` backend, fallback SPA untuk `/admin` dan `/login`, dan penerusan `/api` serta `/uploads` sebelum SPA fallback. Verifikasi konteks root `frontend/vercel.json` sebelum mengubah konfigurasi tersebut. Dokumentasikan kebutuhan volume persisten dan akses PostgreSQL tanpa menjalankan deployment.

## Risiko regresi dan strategi rollback

- **DOM, gambar, dan CSS.** Jaga teks, class, anchor, selector observer, urutan CSS, path gambar, serta perilaku keyboard. Bandingkan baseline pada halaman publik dan admin. Cocokkan juga template extractor dengan peta baru dan lakukan verifikasi generator di salinan sementara karena script tersebut menulis ulang konten, JSX, CSS, dan foto.
- **Kontrak HTTP, autentikasi, dan upload.** Pertahankan bare array proyek, wrapper JSON endpoint lainnya, alias autentikasi, token tujuh hari, key penyimpanan sesi, status HTTP, dan bentuk multipart. Teruskan `AbortSignal` dan timeout publik serta biarkan browser menetapkan boundary multipart. Verifikasi bahwa static serving dan Multer memakai direktori fisik yang sama.
- **Persistensi dan inisialisasi.** Pastikan semua path terpusat menunjuk ke file yang sudah ada meski proses dimulai dari root repository. Ringankan probe awal pool dengan query baca atau pelepasan klien setelah pengecekan. Jangan menjalankan seeder pada database yang ada. Route baca settings/pesan dapat membuat file JSON default jika file belum ada, sehingga pengujian dilakukan setelah path diverifikasi atau di salinan terisolasi.
- **Baseline dan rollback source.** Saat inspeksi, `main` berada di `fc53027`, selaras dengan referensi lokal `origin/main`, dan worktree bersih. Setelah persetujuan, periksa ulang status untuk mencatat perubahan baru dan buat checkpoint sebelum pemindahan. Kerjakan bertahap pada branch atau worktree terisolasi jika tersedia, atau simpan salinan source dan diff pra-refaktor sebelum menyunting area yang terdampak. Sertakan daftar file baru dan pemetaan rename agar rollback dapat membalik hanya perubahan refaktor tanpa menghapus perubahan pengguna. Bandingkan hash aset, upload, dan JSON sebelum dan sesudah. Pisahkan backup runtime bila diperlukan dan simpan secara privat di luar Git.
- **Rollback data dan deployment.** Refaktor memakai database dan path storage yang sama tanpa migrasi data. Pengujian tulis hanya memakai database dan penyimpanan sementara dengan kredensial dummy. Jika rollback kode diperlukan, gunakan source dan lockfile checkpoint dengan konfigurasi runtime yang semula. Pertahankan data yang masuk setelah checkpoint.

## Checklist validasi

### Baseline Fase 1

- [x] Inventaris source, entry point, konfigurasi, dependensi, skrip, penyimpanan, dan endpoint dibandingkan dengan README serta kedua laporan lama.
- [x] Build frontend berhasil dengan Vite 8.1.3 dan 1.805 modul. Output diarahkan ke direktori sementara agar `frontend/dist/` yang ada tetap utuh.
- [x] ESLint dijalankan dan melaporkan 28 error serta 1 warning yang sudah ada sebelum refaktor. Baseline mencakup unused imports, aturan hook terkait state di dalam effect, dan dependensi effect.
- [x] Ketujuh proyek fallback dan 43 path unik di `content.json` terpetakan ke file lokal yang tersedia. Pemeriksaan tahap ini sebatas keberadaan file.
- [x] Inventaris Git tidak menemukan test suite atau skrip `test` pada manifest. Pemeriksaan server, browser, PostgreSQL, dan alur CMS dijadwalkan untuk Fase 2.

### Setelah persetujuan

- [ ] Instal dari lockfile, uji root scripts dan startup independen kedua aplikasi, jalankan build dan lint, serta bandingkan hasil terhadap baseline.
- [ ] Verifikasi `/`, deep link dan refresh `/admin` serta `/login`. Bandingkan DOM dan tangkapan layar sebelum/sesudah pada viewport 320, 390, 768, 1024, dan 1440 px. Periksa logo, font, breakpoint, menu mobile, navigasi keyboard, reduced motion, filter, pagination, carousel, galeri, dan fokus dialog.
- [ ] Uji startup Express, `/api/health`, status root, 404, proxy `/api`, dan proxy `/uploads`. Pastikan health dan koneksi DB tercatat sebagai dua pemeriksaan berbeda.
- [ ] Periksa konektivitas PostgreSQL dengan query baca dan baca proyek/tabel melalui API. Periksa respons settings, foto referensi `/uploads`, dan aset publik lama. Hindari pencetakan isi inbox, nilai environment, atau detail kredensial.
- [ ] Periksa mode publik default tanpa request API. Pada salinan dengan fixture CMP, periksa mode aktif untuk respons normal, data proyek kosong, kegagalan jaringan, dan pengiriman kontak.
- [ ] Uji login, verifikasi, logout, CRUD proyek, crop/unggah/hapus foto uji, penyuntingan settings, inbox, dan profil admin di lingkungan terisolasi. Jalankan test yang tersedia pada saat implementasi dan catat pemeriksaan yang terhalang.
- [ ] Tulis panduan operasional di README, gambaran arsitektur di `docs/ARCHITECTURE.md`, serta perubahan dan hasil aktual di `docs/REFACTOR_REPORT.md`.

Fase 2 dimulai setelah pengguna menyetujui rencana ini secara eksplisit.
