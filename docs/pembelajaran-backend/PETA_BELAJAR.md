# Peta belajar database dan backend CMP

Gunakan [modul PDF](MODUL_BELAJAR_DATABASE_BACKEND_API.pdf) sebagai buku kerja. Baca satu bab, prediksi hasil contoh sebelum menjalankannya, lalu tulis penjelasan singkat tanpa membuka catatan. Estimasi total sekitar **16 jam 30 menit**, termasuk latihan dan evaluasi.

## Sebelum mulai

- [ ] Buka source di VS Code dan siapkan Terminal serta pgAdmin 4.
- [ ] Di pgAdmin, pilih database lokal yang sudah kamu verifikasi. Gunakan tabel asli untuk latihan baca.
- [ ] Siapkan folder sementara di luar repository untuk praktikum Express. Praktik SQL tulis memakai tabel TEMP dalam transaksi yang diakhiri ROLLBACK.
- [ ] Gunakan port 3099 untuk API latihan. Port backend CMP defaultnya 3001.
- [ ] Baca [hasil analisis project](HASIL_ANALISIS_PROJECT.md) untuk membedakan skema aktual, file konfigurasi, dan data lokal.
- [ ] Lewati eksekusi seeder lama. [Kode seeder](../../backend/seed.js) menghapus seluruh isi tabel proyek sebelum mengisi data demo.

## Urutan belajar

1. **Arsitektur sistem · 45 menit · halaman 3**
    - [ ] Gambar hubungan browser, React/Vite, Express, PostgreSQL, file JSON, dan folder upload.
    - [ ] Jelaskan mengapa portofolio publik dapat tampil saat API publik dimatikan. [Router React](../../frontend/src/App.jsx) · [Portofolio aktif](../../frontend/src/components/cmp/Interactive.jsx) · [Proxy Vite](../../frontend/vite.config.js)
2. **Database PostgreSQL · 60 menit · halaman 6**
    - [ ] Bedakan database, schema, tabel, kolom, dan baris. Temukan PK dan tipe JSONB pada `public.projects`.
    - [ ] Gambar ulang ERD aktual. Latih tiga jenis relasi dalam sketsa latihan. [Definisi skema](../../backend/seed.js)
3. **SQL dasar dan praktik · 120 menit · halaman 9**
    - [ ] Prediksi hasil SELECT, WHERE, ORDER BY, LIMIT dan agregasi.
    - [ ] Gunakan tabel TEMP untuk CREATE, INSERT, UPDATE dan DELETE. Jalankan JOIN simulasi dan observasi ROLLBACK. [Query asli controller](../../backend/controllers/projectsController.js)
4. **Node.js dan startup · 60 menit · halaman 15**
    - [ ] Bedakan `npm start` dari `npm run dev`, root dari folder backend, CommonJS dari ES module, dan callback dari Promise.
    - [ ] Telusuri urutan load env, impor router, dan listen. [Skrip root](../../package.json) · [Manifest backend](../../backend/package.json) · [Entry server](../../backend/server.js) · [Contoh env](../../backend/.env.example)
5. **Express.js · 60 menit · halaman 18**
    - [ ] Bedakan `req.params`, `req.query`, dan `req.body`. Telusuri parser dan `next()`.
    - [ ] Tunjuk router, controller, dan tempat respons 404 dibuat. [Router proyek](../../backend/routes/projects.js) · [Middleware auth](../../backend/middleware/auth.js) · [Server](../../backend/server.js)
6. **REST API dan HTTP · 90 menit · halaman 21**
    - [ ] Jelaskan method, status HTTP, header, dan JSON. Uji health, proyek, dan route ber-guard dengan GET.
    - [ ] Bandingkan prefix auth dan alias. [Route auth](../../backend/routes/auth.js) · [Route pesan](../../backend/routes/messages.js) · [Route pengaturan](../../backend/routes/settings.js) · [Route upload](../../backend/routes/upload.js)
7. **Express dan PostgreSQL · 75 menit · halaman 26**
    - [ ] Jelaskan pool, async/await, binding nilai, `RETURNING`, dan COALESCE.
    - [ ] Prediksi hasil untuk id yang ada, id tidak ditemukan, field absen, SQL NULL, dan JSON null. [Pool pg](../../backend/config/db.js) · [Controller proyek](../../backend/controllers/projectsController.js)
8. **CRUD proyek · 90 menit · halaman 29**
    - [ ] Telusuri tombol Simpan sampai state React dimuat ulang.
    - [ ] Bedakan perubahan row dari unggah file. Jelaskan kondisi UI yang dapat menyembunyikan HTTP error. [Form proyek](../../frontend/src/components/admin/ProjectFormModal.jsx) · [Halaman admin](../../frontend/src/pages/Admin.jsx) · [Controller upload](../../backend/controllers/uploadController.js)
9. **Debugging · 75 menit · halaman 34**
    - [ ] Buat catatan untuk gejala listener, role/database, SQL, 404, 500, body kosong, CORS, dan foto.
    - [ ] Gunakan bukti minimum dari log, Network dan Query Tool. [Server](../../backend/server.js) · [Pool](../../backend/config/db.js) · [Proxy Vite](../../frontend/vite.config.js)
10. **Keamanan · 60 menit · halaman 37**
    - [ ] Jelaskan autentikasi versus otorisasi, password hashing, binding SQL, sesi HMAC, dan alasan token/secret tidak masuk log.
    - [ ] Tulis satu perbaikan defensif sebagai rencana. [Controller auth](../../backend/controllers/authController.js) · [Middleware auth](../../backend/middleware/auth.js) · [Helper header](../../frontend/src/utils/api.js)
11. **Praktikum mandiri · 150 menit · halaman 39**
    - [ ] Selesaikan 12 latihan. Mulai dari schema dan GET, lanjut ke JOIN dan API memori, lalu debugging.
    - [ ] Simpan catatan prediksi, status dan keluaran contoh yang disamarkan. [Controller proyek](../../backend/controllers/projectsController.js) · [Manifest backend](../../backend/package.json)
12. **Evaluasi pemahaman · 105 menit · halaman 46**
    - [ ] Kerjakan 20 pilihan ganda, 10 analisis kode, 5 studi kasus debugging, dan 5 tantangan.
    - [ ] Buka pembahasan mulai halaman 55. Ulangi bagian yang belum bisa kamu jelaskan dengan contoh dari project. [Rangkuman project](HASIL_ANALISIS_PROJECT.md)

## Tolok ukur hasil

Kamu bisa menjelaskan kenapa `/api/health` dapat merespons 200 saat endpoint proyek gagal, menunjukkan file yang harus diperiksa, dan merancang satu endpoint GET sederhana dengan bukti pengujian yang bisa diulang.
