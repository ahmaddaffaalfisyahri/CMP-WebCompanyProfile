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
  - [3. Pengaturan Tampilan Web (Hero Stats, Teks Berjalan, & Kontak)](#3-pengaturan-tampilan-web)
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
- Klik tombol **`Pengaturan Web`** di header admin.
- Anda dapat mengedit konten dinamis tanpa coding:
  1. **Angka Statistik Hero Beranda:** Tahun Berdiri (*Est. Year*), Jangkauan Negara (*Countries*), dan Tahun Pengalaman (*Years Experience*).
  2. **Teks Berjalan Beranda (Typewriter):** Mengubah atau menambah baris teks slogan berjalan di landing page utama.
  3. **Informasi Kontak & Kantor:** Alamat kantor, telepon resmi, WhatsApp, email resmi, dan link Google Maps.
- Klik **"Simpan Pengaturan"** dan perubahan langsung tampil di website secara seketika!

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
