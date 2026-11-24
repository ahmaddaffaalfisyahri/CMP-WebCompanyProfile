# CMP - Company Profile & CMS Portal

Web profil perusahaan resmi dan sistem manajemen konten (CMS) untuk **PT Cipta Maju Persada (CMP)**.

Project ini dibangun dengan arsitektur bersih (*Clean Code & Decoupled Architecture*):
- **Frontend (`frontend/`):** React 19 + Vite + Tailwind CSS + Lucide Icons (Modular Components & Portal CMS).
- **Backend (`backend/`):** Node.js + Express.js (Router-Controller Pattern) + PostgreSQL Connection Pool + Multer.

---

##  Daftar Isi
- [Struktur Folder Terorganisir](#-struktur-folder-terorganisir)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persiapan & Prasyarat](#-persiapan--prasyarat)
- [Panduan Menjalankan Project (Langkah demi Langkah)](#-panduan-menjalankan-project)
  - [1. Setup Database & Seeding Otomatis](#1-setup-database--seeding-otomatis)
  - [2. Menjalankan Backend](#2-menjalankan-backend)
  - [3. Menjalankan Frontend](#3-menjalankan-frontend)
- [Panduan Penggunaan Portal Admin (CMS)](#-panduan-penggunaan-portal-admin-cms)
  - [Akses Login Admin](#akses-login-admin)
  - [1. Manajemen Portofolio Proyek (Tambah, Edit, & Crop Foto)](#1-manajemen-portofolio-proyek)
  - [2. Kotak Masuk Pesan (Inbox Leads)](#2-kotak-masuk-pesan-inbox-leads)
  - [3. Pengaturan Tampilan Web](#3-pengaturan-tampilan-web)
  - [4. Pengaturan Akun & Keamanan Password](#4-pengaturan-akun--keamanan-password)
- [FAQ & Troubleshooting](#-faq--troubleshooting)

---

##  Struktur Folder Terorganisir

Project ini memiliki struktur dua-tingkat (*two-tier*) yang rapi dan terpisah jelas:

```text
CMP-profile/
├── backend/                         # Backend REST API (Node.js + Express + PostgreSQL)
│   ├── config/
│   │   └── db.js                    # Konfigurasi koneksi PostgreSQL pool
│   ├── controllers/                 # Logika bisnis terpisah (Clean Controller)
│   │   ├── authController.js        # Autentikasi token & ganti profil admin
│   │   ├── messagesController.js    # Pengelolaan leads pesan kontak
│   │   ├── projectsController.js    # CRUD portofolio proyek
│   │   ├── settingsController.js    # Pengaturan hero stats, running text, kontak
│   │   └── uploadController.js      # Upload & hapus gambar
│   ├── data/                        # JSON storage (pengaturan web & inbox)
│   │   ├── messages.json
│   │   └── settings.json
│   ├── middleware/
│   │   └── auth.js                  # Verifikasi bearer token & guard
│   ├── routes/                      # Route handlers REST API
│   │   ├── authRoutes.js
│   │   ├── messagesRoutes.js
│   │   ├── projectsRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/                     # Direktori penyimpanan gambar fisik
│   ├── .env.example                 # Template konfigurasi environment backend
│   ├── package.json
│   ├── seed.js                      # Seeder otomatis tabel database & 10 proyek demo
│   └── server.js                    # Server Express entry point (:3001)
│
├── frontend/                        # Frontend Client Application (React 19 + Vite)
│   ├── public/                      # Aset publik & favicon
│   ├── src/
│   │   ├── assets/                  # Gambar visual, logo perusahaan, GeoJSON peta
│   │   ├── components/
│   │   │   ├── admin/               # Komponen modular CMS Admin
│   │   │   │   ├── ConfirmDialog.jsx        # Dialog konfirmasi hapus
│   │   │   │   ├── ImageCropModal.jsx       # Modal crop gambar & dual preview
│   │   │   │   ├── LoginPortal.jsx          # Kartu portal login tema putih
│   │   │   │   ├── MessagesInboxModal.jsx   # Modal inbox leads pesan website
│   │   │   │   ├── ProfileConfigModal.jsx   # Modal ubah username & password
│   │   │   │   ├── ProjectFormModal.jsx     # Modal form tambah & edit project
│   │   │   │   ├── Toast.jsx                # Komponen toast notifikasi
│   │   │   │   └── WebsiteSettingsModal.jsx # Modal pengaturan stats & teks hero
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx       # Navigasi utama website
│   │   │   └── sections/            # Seksi-seksi tampilan landing page publik
│   │   │       ├── About.jsx        # Tentang kami, visi misi, & sertifikasi
│   │   │       ├── Contacts.jsx     # Seksi kontak form & peta kantor
│   │   │       ├── GlobalReach.jsx  # Peta jangkauan proyek global interaktif
│   │   │       ├── Homepage.jsx     # Hero banner & running text
│   │   │       ├── PortfolioProjects.jsx # Grid proyek & filter kategori
│   │   │       └── Services.jsx     # Seksi layanan engineering & turnkey
│   │   ├── hooks/
│   │   │   └── useInView.js         # Hook animasi on-scroll viewport
│   │   ├── pages/
│   │   │   └── Admin.jsx            # Halaman utama Admin Dashboard
│   │   ├── utils/
│   │   │   └── api.js               # Helper API fetch & token headers
│   │   ├── App.jsx                  # Root router aplikasi
│   │   └── main.jsx                 # Entry point React
│   ├── index.html
│   ├── package.json
│   └── vite.config.js               # Konfigurasi Vite & proxy API backend
│
├── .gitignore                       # Rule gitignore komprehensif
└── README.md                        # Dokumentasi lengkap
```

---

## Teknologi yang Digunakan

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, React Router DOM.
- **Backend:** Node.js, Express.js (Modular MVC), Multer (Image Processing & Upload).
- **Database:** PostgreSQL (`pg` connection pool).
- **Security:** HMAC-SHA256 Token Auth, Parameter Sanitization, & Path Traversal Guards.

---

## Persiapan & Prasyarat

Sebelum memulai, pastikan komputer Anda telah terinstal:
1. **Node.js** (versi 18.x atau yang lebih baru) & **npm**.
2. **PostgreSQL** (versi 14.x atau yang lebih baru).

---

## Panduan Menjalankan Project

### ⚡ Quick Start (Ringkasan Perintah)
Bagi Anda yang sudah menginstal PostgreSQL dan membuat database `cmp`:

```bash
# Terminal 1: Backend (:3001)
cd backend && npm install && node seed.js && npm run dev

# Terminal 2: Frontend (:5173)
cd frontend && npm install && npm run dev
```

---

### 1. Setup Database & Seeding Otomatis

> **Pertanyaan Seputar Database:**
> **Apakah file database perlu di-upload ke GitHub?**  
> **Tidak.** Database lokal tidak boleh di-upload ke GitHub karena berisi kredensial dan file biner sistem lokal.  
> Untuk pengguna baru / tim lain, cukup buat database kosong `cmp`, lalu jalankan `node seed.js`.
> Script `seed.js` telah diprogram untuk **otomatis membuat tabel `projects` dan menyalin 10 data portofolio awal lengkap dengan gambarnya**.

1. Pastikan PostgreSQL di komputer Anda aktif.
2. Buat database baru bernama `cmp`:
   - **Via Terminal (Mac / Linux):**
     ```bash
     createdb cmp
     ```
   - **Atau via SQL GUI (pgAdmin / DBeaver / psql):**
     ```sql
     CREATE DATABASE cmp;
     ```

---

### 2. Menjalankan Backend

1. Buka Terminal, masuk ke direktori `backend`:
   ```bash
   cd backend
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi file `.env`:
   Salin dari template `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi file `.env`:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cmp
   DB_USER=postgres
   DB_PASSWORD=
   ADMIN_USER=cmp
   ADMIN_PASSWORD=
   AUTH_SECRET=
   ```
   > **Catatan Khusus Kredensial Database:**
   > - **Pengguna Mac (Homebrew):** `DB_USER` biasanya adalah username akun Mac Anda (contoh: `DB_USER=daffaalfi`) dan `DB_PASSWORD` dibiarkan kosong (`DB_PASSWORD=`).
   > - **Pengguna Windows / Linux:** `DB_USER=postgres` dan isi `DB_PASSWORD` sesuai password saat instalasi PostgreSQL.
   > - `AUTH_SECRET`: Isi dengan nilai acak, misalnya hasil perintah `openssl rand -hex 32`.
   > - `ADMIN_PASSWORD`: Isi dengan password admin yang kuat. Password ini nantinya bisa diubah langsung melalui menu Akun di Admin Panel.

4. **Jalankan Seeder Database:**
   ```bash
   node seed.js
   ```
   Output sukses akan menampilkan:
   ```text
   Tabel 'projects' siap.
   Database seeded: 10 projects.
   ```

5. Jalankan server backend:
   ```bash
   npm run dev
   ```
   Backend aktif di: **`http://localhost:3001`**

---

### 3. Menjalankan Frontend

1. Buka jendela / tab Terminal baru, masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan server development Vite:
   ```bash
   npm run dev
   ```

4. Akses di Browser:
   - **Website Publik:** `http://localhost:5173`
   - **Portal Admin CMS:** `http://localhost:5173/admin` (atau `/login`)

---

## Panduan Penggunaan Portal Admin (CMS)

### Akses Login Admin
- **URL Akses:** `http://localhost:5173/admin` (atau `http://localhost:5173/login`)
- **Tampilan:** Bersih dengan tema putih/slate-50 modern yang selaras dengan website utama.
- **Kredensial Default:**
  - **Username:** `cmp`
  - **Password:** sesuai nilai `ADMIN_PASSWORD` di `.env` Anda.

---

### 1. Manajemen Portofolio Proyek
- **Menambahkan Proyek Baru:**
  1. Klik tombol **`+ Add Project`**.
  2. Masukkan **Judul Project** (bisa mengetik bebas atau memilih dari dropdown referensi).
  3. Masukkan **Kategori Project** (otomatis menjadi filter tag di halaman portofolio).
  4. Masukkan **Deskripsi Proyek**.
  5. Klik tombol upload gambar.
  6. **Fitur Interactive Crop & Dual Preview:** Geser (*drag*) dan perbesar/perkecil (*zoom*) posisi gambar. Anda bisa melihat perbandingan langsung antara:
     - **Card Luar:** Tampilan ringkas di grid portofolio.
     - **Dialog Dalam:** Tampilan detail saat pengunjung mengklik card.
  7. Klik **"Simpan Foto Terpilih"**, lalu klik **"Simpan Project"**.
- **Edit & Crop Ulang Foto:**
  - Klik ikon **Pencil (Edit)** pada baris proyek.
  - Untuk menyesuaikan kembali gambar, hover kursor ke foto lalu klik ikon **Crop biru** untuk menggeser/zoom ulang.
- **Hapus Proyek:**
  - Klik ikon **Trash (Hapus)** untuk menghapus proyek beserta gambarnya.

---

### 2. Kotak Masuk Pesan (Inbox Leads)
- Klik tombol **`Pesan Masuk`** di header admin.
- Berisi seluruh pertanyaan calon klien dari form kontak website.
- **Fitur:**
  - Status label: **Baru** vs **Sudah Dihubungi**.
  - Tombol **Tandai Sudah Dihubungi** untuk memudahkan follow-up tim sales/marketing.
  - Tombol **Hapus** untuk membersihkan pesan lama.

---

### 3. Pengaturan Tampilan Web

Buka **Pengaturan Web** di dashboard admin. **Konten & kontak** mengatur judul dan deskripsi Beranda, informasi About Us, serta alamat, telepon, dan email. **Foto halaman** mengatur lima foto di Beranda, About Us, dan Vision & Mission.

Foto proyek dikelola lewat **Portfolio Projects → Proyek dari Database → Edit Proyek**. Pada formulir proyek, editor foto menampilkan pratinjau kartu dan galeri.

Untuk foto halaman, **Ganti foto** membuka editor untuk foto baru dan **Crop / Zoom** membuka editor untuk foto yang sedang dipakai. Pilih bingkai **Desktop** atau **Mobile** sesuai posisi foto. Klik **Simpan Foto Terpilih** untuk menerapkan crop, lalu **Simpan Pengaturan**. **Foto asli** memulihkan foto bawaan di posisi tersebut.

Pengaturan disimpan oleh Express di `backend/data/appearance.json`, dan file foto baru disimpan di `backend/uploads/`. Pada VPS, kedua lokasi tersebut harus persisten dan dapat ditulis oleh proses Node. Pengaturan tampilan dapat dibaca halaman publik meskipun integrasi proyek PostgreSQL dan formulir kontak masih dinonaktifkan.

#### Deploy frontend dan API di VPS

Contoh ini memakai Ubuntu/Debian dengan Nginx yang melayani website langsung. Jika VPS memakai panel atau proxy lain untuk SSL, gunakan pengaturan domain dan sertifikat dari layanan tersebut. Untuk versi Vite di proyek ini, gunakan Node.js 22.12 atau lebih baru.

**1. Perbarui checkout dan jalankan backend**

Masuk lewat SSH dan buka folder clone yang dipakai deploy. Lanjutkan jika branch yang dipakai adalah `main` dan working tree bersih. Simpan cadangan konfigurasi, data PostgreSQL, dan unggahan sebelum memperbarui produksi.

```bash
git status --short --branch
git pull --ff-only origin main
git log -1 --oneline
npm --prefix backend ci --omit=dev
npm --prefix frontend ci --include=dev
```

Pertahankan `backend/.env` yang sudah dipakai VPS. Cocokkan `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, dan `DB_PASSWORD` dengan layanan di VPS. Saat konfigurasi pertama kali, isi juga `ADMIN_USER`, `ADMIN_PASSWORD`, dan `AUTH_SECRET`. Git memperbarui kode. Restore PostgreSQL dan salin unggahan secara terpisah jika datanya masih ada di Mac. Pertahankan `backend/data/` dan `backend/uploads/` antar-deploy.

Restart proses Node melalui pengelola yang sudah digunakan. Untuk PM2, lihat nama di `pm2 list`, lalu gunakan `pm2 restart NAMA_PROSES --update-env`. Jika PM2 sudah terpasang dan layanan ini belum dibuat, jalankan `pm2 start server.js --name cmp-api` dari folder `backend` agar `dotenv` membaca file yang benar. Untuk systemd, restart unit backend yang sudah ada.

```bash
curl -fsS http://127.0.0.1:3001/api/health
curl -fsS http://127.0.0.1:3001/api/projects
```

Gunakan port dari `backend/.env` jika berbeda. `health` memeriksa Express. `projects` menjalankan query PostgreSQL. Respons `[]` berarti query berhasil dan tabel proyek kosong.

**2. Hubungkan DNS dan Nginx**

Buat record DNS `A` bernama `cmp-api` dengan nilai IP publik VPS. Gunakan `AAAA` hanya jika VPS melayani IPv6. Pastikan port TCP 80 dan 443 dapat diakses dari internet. Port Express dan PostgreSQL cukup digunakan secara internal.

Tambahkan server block berikut untuk API, misalnya di `/etc/nginx/sites-available/cmp-api`. Jika blok dengan `server_name` ini sudah ada, edit blok tersebut. Untuk file baru pada instalasi Ubuntu/Debian standar, aktifkan dengan `sudo ln -s /etc/nginx/sites-available/cmp-api /etc/nginx/sites-enabled/cmp-api`.

```nginx
server {
    listen 80;
    server_name cmp-api.ciptamajupersada.com;
    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`proxy_pass` meneruskan `/api/` dan `/uploads/` ke Express. Batas 12 MB memberi ruang untuk multipart dan batas foto 10 MB di backend.

```bash
sudo nginx -t && sudo systemctl reload nginx
dig +short cmp-api.ciptamajupersada.com A
curl -fsS http://cmp-api.ciptamajupersada.com/api/health
```

**3. Pasang sertifikat HTTPS**

Gunakan Certbot yang sudah tersedia. Untuk instalasi baru dari paket Ubuntu/Debian, gunakan `sudo apt update && sudo apt install certbot python3-certbot-nginx`. Setelah DNS dan HTTP berhasil, terbitkan sertifikat API. Pastikan server block HTTP domain utama juga memiliki `server_name ciptamajupersada.com`. Jika sertifikat domain utama belum valid, terbitkan sertifikat untuk host tersebut juga.

```bash
sudo certbot --nginx -d cmp-api.ciptamajupersada.com
sudo certbot --nginx -d ciptamajupersada.com
sudo certbot renew --dry-run
curl -fsS https://cmp-api.ciptamajupersada.com/api/health
curl -fsS https://cmp-api.ciptamajupersada.com/api/projects
curl -fsSI https://ciptamajupersada.com/
```

**4. Build dan publikasikan frontend**

Gunakan commit yang sudah memuat dukungan `VITE_API_URL`. Jalankan build dari root repository. Vite memasukkan URL API ke bundle saat build.

```bash
VITE_API_URL=https://cmp-api.ciptamajupersada.com/api npm run build
```

Publikasikan isi `frontend/dist/` ke document root yang sudah dipakai website. Jika Nginx langsung memakai `frontend/dist/` sebagai root, hasil build sudah berada di lokasi tersebut. Pada server block website, gunakan `try_files $uri $uri/ /index.html;` di `location /` agar membuka `/admin` langsung juga bekerja. Verifikasi halaman utama, login admin, dan foto unggahan lewat browser.

Untuk development, biarkan `VITE_API_URL` kosong. Vite meneruskan request relatif `/api` dan `/uploads` ke Express lokal.

---

### 4. Pengaturan Akun & Keamanan Password
- Klik tombol **`Akun`** di header admin.
- Pengelola dapat:
  - Mengubah **Username Admin**.
  - Mengubah **Password Baru** (minimal 5 karakter).
  - Wajib memasukkan **Password Saat Ini** demi keamanan akun.

---

## FAQ & Troubleshooting

- **Error: `role "postgres" does not exist` saat seeder:**
  - Di Mac dengan Homebrew, user default PostgreSQL biasanya adalah username Mac Anda. Ganti baris `DB_USER` pada `backend/.env` menjadi username Mac Anda (contoh: `DB_USER=daffaalfi`).
- **Error: `database "cmp" does not exist`:**
  - Jalankan `createdb cmp` di terminal terlebih dahulu.
- **Error: Port 3001 atau 5173 sedang digunakan (`EADDRINUSE`):**
  - Matikan proses yang masih aktif dengan perintah:
    ```bash
    kill -9 $(lsof -t -i :3001)
    kill -9 $(lsof -t -i :5173)
    ```
- **Gambar Tidak Muncul di Frontend:**
  - Pastikan server backend sedang berjalan di port `3001`. Vite telah terkonfigurasi untuk mem-proxy permintaan `/uploads` dan `/api` langsung ke backend.
