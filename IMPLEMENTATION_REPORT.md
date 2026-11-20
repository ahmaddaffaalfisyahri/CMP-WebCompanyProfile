# CMP Public Frontend — Implementation Report

Tanggal: 20 November 2026

## Hasil dan batas tahap pertama

Frontend publik pada project existing telah diganti dengan implementasi React JSX berdasarkan layout HTML Prototype V2, bukan recolor halaman CITASys. React/Vite, Tailwind v4, React Router, Lucide, Express, dan PostgreSQL tetap dipertahankan. Backend tidak dijalankan, database tidak dihubungi, seed tidak dijalankan, dan konfigurasi deployment lama tidak digunakan.

## Referensi dan provenance

- [Prototype V2](./CMP_Company_Profile_Prototype_v2.html) dibaca: layout, CSS, konten, dataset proyek, serta embedded images.
- [Analisis project](./PROJECT_ANALYSIS.md) dibaca dan dibandingkan dengan router, komponen, API client, route/controller backend, dan konfigurasi Vite aktual.
- `CMP-Color-Palette.pdf`, `COMPANY PROFILE 2026.pdf`, dan `Logo.png` **tidak ditemukan di root**. Kekurangan ini dilaporkan sebelum perubahan desain.
- Warna dan konten memakai prototype sebagai sumber sementara, bukan dinyatakan telah diverifikasi terhadap PDF resmi. Logo dan foto diekstrak dari embedded assets prototype tanpa gambar stok/AI atau aset CITASys.
- Laporan lama menyebut implementasi yang tidak ditemukan pada source awal; laporan ini menggantikannya dengan hasil pemeriksaan aktual.

## Struktur dan perubahan

- [App.jsx](./frontend/src/App.jsx): route publik memakai CMPPublicSite; `/admin` dan `/login` tetap memakai Admin existing.
- [CMPPublicSite.jsx](./frontend/src/components/cmp/CMPPublicSite.jsx): navbar sticky, menu mobile, active navigation, scroll reveal, footer.
- [Sections.jsx](./frontend/src/components/cmp/Sections.jsx): hero foto kolase, About dengan tahun 2020, Vision & Mission, enam Turn-Key Solutions; copy mengikuti prototype.
- [Interactive.jsx](./frontend/src/components/cmp/Interactive.jsx): portfolio, carousel, filter, pagination enam proyek per halaman, dialog gallery, formulir dan adaptor REST.
- [content.json](./frontend/src/components/cmp/content.json): tujuh entri proyek prototype, client, kategori, description, scope, image paths.
- [prototype.css](./frontend/src/components/cmp/prototype.css): layout, typography Arial/Helvetica, spacing, card, CTA, dan breakpoint prototype, di-scope ke `.cmp-site` agar CMS tidak terkena redesign global.
- [refinements.css](./frontend/src/components/cmp/refinements.css): semantic tokens, accessibility states, carousel dots, pagination, scroll reveal dan reduced motion.
- [Aset CMP](./frontend/public/cmp/): logo dan dokumentasi embedded prototype.
- [Script ekstraksi](./scripts/extract-cmp.cjs): ekstraksi lokal yang dapat diulang. Menjalankan ulang akan meregenerasi content.json, prototype.css, dan Sections.jsx dari prototype.
- [index.html](./frontend/index.html): title CMP, description, theme color, favicon CMP; link font Manrope lama dihapus.
- [LoginPortal.jsx](./frontend/src/components/admin/LoginPortal.jsx) dan [Admin.jsx](./frontend/src/pages/Admin.jsx): logo CMP; background login lama diganti gradient. Alur autentikasi dan CMS tetap existing.

Urutan rendered: Navbar → Hero → About Us → Vision & Mission → Turn-Key Solutions → Our Work → Contact Us → Footer.

Global Reach, Certifications, Our Commitment, Our People, strip tambahan, dan bar statistik tidak dirender. Tidak ada jumlah proyek atau editorial groupings pada Our Work. Nama client tetap menjadi metadata proyek. Tautan `www.citasys.com` yang ditemukan di prototype tidak disalin.

## Design tokens sementara

Sumber: CSS prototype, menunggu validasi palette PDF resmi.

- Primary navy `#010066`; accent red `#FE0000`.
- CTA `#E00000`; hover `#B80000`.
- Background `#FFFFFF`; alternate `#F7F7F7`.
- Border `#D8D9E2`; secondary text `#4A4F63`; primary text `#1B1D2E`; light-on-navy `#C9CBE8`.

## Fitur dan integrasi

Sticky navbar, mobile navigation, smooth anchors, active section, IntersectionObserver reveals, project filtering/pagination, auto carousel empat detik (pause hover/focus), kontrol foto manual, gallery modal, next/previous photo, Escape, focus restoration, native dialog focus containment, dan reduced-motion support tersedia.

Contact form memakai required/email validation, batas panjang, whitespace check, pending state, timeout, dan pemeriksaan HTTP serta `result.ok`. Tidak ada EmailJS placeholder atau success palsu.

Kontrak REST dipertahankan: `GET /api/projects`, `GET /api/settings`, `POST /api/messages`. **API publik default nonaktif**, dikendalikan `VITE_CMP_API_ENABLED` dalam [contoh environment](./frontend/.env.example). Ini mencegah frontend baru memuat proyek/settings CITASys dari backend yang datanya belum dimigrasikan. Preview memakai dataset CMP dari prototype; submit menjelaskan layanan online belum tersedia dan mengarahkan pengguna ke email/telepon.

Aktifkan flag hanya setelah target API dan seluruh data projects/settings/uploads diverifikasi CMP-only. Flag ini bukan validasi identitas server. Saat aktif, project CMS dan contact settings dapat dibaca dengan kontrak existing. Data proyek kosong menghasilkan empty state; API gagal memakai fallback prototype. Tahun berdiri dan statistik legacy dari settings sengaja tidak ditampilkan.

CMS dashboard, CRUD, upload/cropping, settings, messages inbox, login dan token namespace tetap dipertahankan. Backend masih menyimpan projects di PostgreSQL serta settings/messages di JSON. Pengujian CMS yang menulis data ditunda sampai lingkungan CMP lokal tersedia. Default konten/saran CITASys dalam source legacy/admin/backend masih perlu dimigrasikan pada tahap berikutnya; tidak diimpor sebagai konten publik CMP.

## Pengujian aktual

- `npm run build`: **PASS**, Vite 8.1.3, 1.801 modules; final JS 327,32 kB (gzip 99,64 kB), CSS 95,23 kB (gzip 16,47 kB). Build final tidak membundel logo maupun background CITASys.
- `npm run lint`: **FAIL baseline**, 28 errors + 1 warning. Mayoritas unused React/imports, `react-hooks/set-state-in-effect`, dan dependency effect pada file legacy/admin/hooks. Aturan lint tidak dimatikan. Semua tiga komponen baru CMP: **0 error, 0 warning**. App.jsx dan Interactive.jsx juga tidak memiliki diagnostic editor.
- Browser DOM/computed layout: viewport 320, 390, 768, 1024, 1440 px tidak menunjukkan overflow horizontal. Project grid 1 kolom pada mobile, 2 pada tablet 768, 3 pada desktop. Header computed `position: sticky`.
- Mobile 390 px: menu terbuka, menutup setelah memilih Portfolio, filter Automation menghasilkan 3 kartu, tanpa horizontal overflow.
- Pagination: halaman kedua menampilkan Biogas Electrical & Automation.
- Gallery: next photo mengubah gambar; Escape setelah perbaikan eksplisit menutup/unmount dialog.
- Carousel otomatis teramati berganti gambar melalui snapshot browser.
- Contact preview: pesan unavailable tampil setelah submit valid; **0 request `/api/`** teramati, tidak ada false-success atau penulisan inbox.
- Screenshot browser dicoba; output host mengalami tiling/duplikasi, sehingga pemeriksaan pixel-perfect menyeluruh belum dapat disertifikasi. Verifikasi responsive di atas berdasarkan DOM/computed geometry dan interaksi browser.
- Pengujian HTTP sukses/gagal pada backend nyata, login authenticated, upload/crop, dan persistence DB **belum dilakukan**. Tidak ada klaim E2E backend lulus.

Server preview frontend: `http://127.0.0.1:5173/`, dijalankan tanpa backend.

## Kendala dan pekerjaan tersisa

1. Sediakan ketiga referensi resmi yang hilang; verifikasi palette, logo, semua copy/kontak, nama client, scope, dan provenance foto sebelum publikasi.
2. Siapkan database/storage CMP lokal terpisah; migrasikan konten settings/projects dan saran admin tanpa destructive seed lama. Sesudah verifikasi baru aktifkan integrasi publik.
3. Jalankan E2E API, form success/error, authenticated CMS CRUD, upload/crop, settings dan inbox pada lingkungan CMP tersebut.
4. Rapikan 28 error/1 warning lint baseline dan lakukan security hardening backend pada fase berikutnya.
5. Lakukan review visual browser lintas perangkat dan screenshot stabil sebelum sign-off desain final; optimasi image sizing/format dan lazy-loading lanjutan bila dibutuhkan.
6. Konfigurasi deployment CMP harus baru dan terpisah dari konfigurasi production CITASys; tidak ada deployment pada pekerjaan ini.

Perubahan pengguna yang sudah ada pada README.md dan backend/data/messages.json tidak disentuh. Tidak ada credentials dibaca atau dicetak dalam pekerjaan ini.
