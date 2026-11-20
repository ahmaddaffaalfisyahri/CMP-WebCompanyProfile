# PROJECT ANALYSIS — CITASys

> Analisis ini dibuat dari source code dan konfigurasi aktual pada workspace. Bagian **Aktual** menjelaskan implementasi yang ditemukan; bagian **Rekomendasi CMP** adalah usulan migrasi.

## 1. Project Overview

### Tujuan aplikasi

CITASys adalah website company profile PT Cipta Total Solusindo sekaligus portal CMS internal untuk mengelola portofolio proyek, statistik hero, informasi kontak, dan pesan calon klien.

### Jenis dan arsitektur aplikasi

- Public-facing single-page company profile.
- Admin CMS/dashboard pada route /admin dan /login.
- REST API backend untuk projects, settings, inbox messages, authentication, dan image upload.
- Frontend React/Vite dan backend Node.js/Express dipisahkan dalam folder frontend dan backend.
- PostgreSQL dipakai untuk projects; settings dan messages disimpan sebagai JSON files; images disimpan pada local filesystem.

### Fitur utama

- Hero dengan typewriter phrases dan animated statistics.
- About Us, company history, Vision & Mission, Services/Turnkey Projects, Global Reach, Certifications, Portfolio, dan Contact.
- Project filter, pagination enam item per page, card image carousel, dan gallery modal.
- Contact form ke inbox backend dan percobaan pengiriman EmailJS.
- Admin login dengan signed HMAC token.
- Admin CRUD project, upload/delete gambar, crop/preview, website settings, inbox, serta update credential admin.

### Alur kerja aktual

1. frontend/src/main.jsx me-mount React ke elemen #root.
2. frontend/src/App.jsx memilih public site atau Admin berdasarkan route.
3. Public sections merender copy/assets hardcoded dan mengambil settings/projects dari API.
4. Contact form POST ke /api/messages, kemudian mencoba emailjs.sendForm.
5. Admin login ke /api/auth/login; token disimpan di localStorage.
6. Admin menggunakan Bearer token untuk project CRUD, upload, settings, inbox, dan profile.
7. Express menyajikan /uploads, query PostgreSQL untuk projects, serta menulis settings/messages ke JSON.

## 2. Technology Stack

Versi berikut mengikuti deklarasi dependency pada frontend/package.json dan backend/package.json.

| Area | Teknologi | Versi deklarasi | Temuan |
|---|---|---:|---|
| Frontend | React | ^19.2.7 | Aktual |
| Renderer | React DOM | ^19.2.7 | Aktual |
| Routing | React Router DOM | ^7.18.3 | BrowserRouter/Routes/Route dipakai |
| Backend runtime | Node.js | Tidak dipin | README mensyaratkan 18+ |
| Backend framework | Express | ^4.19.2 | Aktual |
| Styling | Tailwind CSS | ^4.3.2 | melalui @tailwindcss/vite |
| UI library | Tidak ada component library khusus | - | Komponen lokal JSX + Tailwind |
| Headless UI | @headlessui/react | ^2.2.10 | Tercantum; tidak ditemukan import |
| Heroicons | @heroicons/react | ^2.2.0 | Tercantum; tidak ditemukan import |
| Animation | CSS, Tailwind transition, SVG, IntersectionObserver, requestAnimationFrame | Browser APIs | Tidak memakai GSAP/Framer Motion |
| Icon | lucide-react | ^1.25.0 | Dipakai public/admin |
| Email | @emailjs/browser | ^4.4.1 | Credential pada source masih placeholder |
| Database | PostgreSQL | README: 14+ | Schema dibuat oleh backend/seed.js |
| Driver/ORM | pg ^8.12.0 / tidak ada ORM | ^8.12.0 | SQL langsung melalui Pool |
| Upload | multer | ^1.4.5-lts.1 | Disk storage, max 20 file/request, 10 MB/file |
| API | REST JSON di Express | - | Endpoint di bawah /api |
| Build | Vite | ^8.1.1 | React, Tailwind, Babel/Rolldown plugin |
| Compiler | babel-plugin-react-compiler | ^1.0.0 | reactCompilerPreset di vite.config.js |
| Lint | ESLint | ^10.6.0 | npm run lint |
| Package manager | npm | lockfileVersion 3 | Lockfile root/frontend/backend |
| Deploy | Vercel | frontend/vercel.json | Service/rewrite frontend dan backend |
| Dev server | Vite + nodemon | Vite ^8.1.1, nodemon ^3.1.4 | Default frontend 5173, backend 3001 |

Tidak ditemukan TypeScript, test runner, schema validator, state library eksternal, atau CMS eksternal.

## 3. Folder Structure

~~~text
CITASys-profile/
├── README.md
├── package-lock.json
├── PROJECT_ANALYSIS.md
├── backend/
│   ├── .env.example
│   ├── package.json / package-lock.json
│   ├── server.js
│   ├── seed.js
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messagesController.js
│   │   ├── projectsController.js
│   │   ├── settingsController.js
│   │   └── uploadController.js
│   ├── middleware/auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── messages.js
│   │   ├── projects.js
│   │   ├── settings.js
│   │   └── upload.js
│   ├── data/messages.json
│   └── uploads/
└── frontend/
    ├── package.json / package-lock.json
    ├── vite.config.js
    ├── vercel.json
    ├── index.html
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── App.css
        ├── assets/
        ├── hooks/useInView.js
        ├── utils/api.js
        ├── pages/Admin.jsx
        └── components/
            ├── layout/Navbar.jsx
            ├── sections/
            │   ├── Homepage.jsx
            │   ├── About.jsx
            │   ├── GlobalReach.jsx
            │   ├── Services.jsx
            │   ├── PortfolioProjects.jsx
            │   └── Contacts.jsx
            └── admin/
                ├── LoginPortal.jsx
                ├── ProjectFormModal.jsx
                ├── WebsiteSettingsModal.jsx
                ├── MessagesInboxModal.jsx
                ├── ProfileConfigModal.jsx
                ├── ImageCropModal.jsx
                ├── ConfirmDialog.jsx
                └── Toast.jsx
~~~

Fungsi penting:

- backend/server.js: Express entry point, middleware, route mounting, static uploads, health check.
- backend/seed.js: membuat table projects, menyalin asset, lalu seed 10 project demo.
- backend/config/db.js: PostgreSQL Pool.
- backend/controllers dan backend/routes: pemisahan controller dan route REST.
- backend/middleware/auth.js: HMAC token dan requireAuth.
- backend/data: persistence settings/messages berbasis JSON.
- frontend/src/main.jsx: bootstrap React.
- frontend/src/App.jsx: router dan komposisi public page.
- frontend/src/assets: logo, foto, backgrounds, map data.
- frontend/src/hooks/useInView.js: useInView dan useCountUp.
- frontend/src/utils/api.js: API base URL, auth headers, default titles/categories.
- frontend/src/pages/Admin.jsx: orchestrator CMS.
- frontend/src/components/sections: public landing sections.
- frontend/src/components/admin: modal/form admin.
- frontend/public: favicon dan asset public.

Daftar node_modules, .git, dist, build, cache, serta aset berulang dihilangkan dari tree.

## 4. Application Architecture

### Entry point, routing, dan layout

- main.jsx memuat index.css dan me-render App.
- App.jsx memakai BrowserRouter:
  - / → MainSite.
  - /admin dan /login → Admin.
- Public page adalah single page; perpindahan section melalui anchor dan custom smooth scroll.
- Navbar fixed dengan z-50. Admin memakai sticky header dan modal overlays.
- Tidak ada footer component pada MainSite.

~~~mermaid
flowchart TD
  Main[main.jsx] --> App[App.jsx]
  App --> Router[BrowserRouter]
  Router --> Public[MainSite /]
  Router --> Admin[Admin /admin]
  Public --> Navbar
  Public --> Hero[Homepage]
  Public --> About[AboutUs]
  Public --> Reach[GlobalReach]
  Public --> VM[VisionMission]
  Public --> Services
  Public --> Cert[Certifications]
  Public --> Portfolio
  Public --> Contact
  Admin --> Login[LoginPortal]
  Admin --> Project[ProjectFormModal]
  Admin --> Settings[WebsiteSettingsModal]
  Admin --> Inbox[MessagesInboxModal]
  Admin --> Profile[ProfileConfigModal]
  Portfolio --> PAPI[/api/projects]
  Hero --> SAPI[/api/settings]
  Contact --> MAPI[/api/messages]
  Admin --> AAPI[/api/auth]
  PAPI --> PG[(PostgreSQL)]
  SAPI --> JSON[(settings.json)]
  MAPI --> JSON2[(messages.json)]
  Project --> Files[(backend/uploads)]
~~~

### State management dan data flow

- Tidak ada Redux/Zustand/Context; state lokal memakai useState/useEffect.
- Portfolio menyimpan projects, activeTag, currentPage, selectedProject, dan transition state.
- Services mengirim CustomEvent changeCategory; PortfolioProjects mendengarkannya.
- Auth token/user berada di state Admin dan localStorage dengan key citasys_admin_token serta citasys_admin_user.
- useInView menjadi primitive animation lintas sections.
- API base URL adalah /api; Vite proxy meneruskan /api dan /uploads ke localhost:3001.

## 5. Frontend Components

| Component | File path | Purpose | Props | Dependencies | State | Reusability |
|---|---|---|---|---|---|---|
| App/MainSite | frontend/src/App.jsx | Router dan public composition | none | React Router, sections | none | MODIFY |
| Navbar | components/layout/Navbar.jsx | Sticky nav, active section, mobile menu | none | React, logo | scrolled, activeSection, menuOpen | MODIFY |
| Homepage | components/sections/Homepage.jsx | Hero, typewriter, stats | none | hooks, Lucide, assets, settings API | heroData | MODIFY |
| Typewriter | Homepage.jsx | Type/delete phrases | phrases | React timers | phraseIdx, displayed, deleting, pause | KEEP |
| StatItem | Homepage.jsx | Animated statistic | value, suffix, label, trigger, duration | useCountUp | hook count | KEEP |
| AboutUs | About.jsx | Intro dan timeline | none | Reveal, icons, assets | visibility | MODIFY |
| Reveal | About.jsx | Reveal wrapper | children, delay, direction, className | useInView | visibility | KEEP |
| VMCard | About.jsx | Vision/Mission card | title, text, image, imageAlt, imagePosition, delay | useInView | visibility | KEEP/MODIFY |
| VisionMission | About.jsx | Vision/mission section | none | VMCard | child state | MODIFY |
| CertCard/Certifications | About.jsx | Certification cards | cert, delay | useInView, images | visibility | REMOVE/REPLACE |
| GlobalReach | GlobalReach.jsx | Interactive world map dan popup | none | map data, Lucide, hooks | location, popup, progress, reduced motion | REMOVE CMP |
| Services | Services.jsx | Turnkey cards dan connectors | none | assets, useInView | visibility | MODIFY |
| ProjectCard | PortfolioProjects.jsx | Card, auto carousel, hover | project, onOpen, delay | useInView, Lucide | imgIdx, hovered | KEEP/MODIFY |
| Modal | PortfolioProjects.jsx | Gallery lightbox | project, onClose, onNextProject, onPrevProject | React, Lucide | image index | KEEP/MODIFY |
| PortfolioProjects | PortfolioProjects.jsx | Fetch/filter/pagination/grid | none | API, card, modal | projects, tag, page, selected | KEEP/MODIFY |
| FloatField | Contacts.jsx | Floating-label field | label, name, type, as, rows | React | focused, value | KEEP/MODIFY |
| InfoItem | Contacts.jsx | Contact row | icon, title, children | Lucide | none | KEEP |
| Contacts | Contacts.jsx | Contact info, form, inbox, EmailJS | none | EmailJS, API, hooks | contactData, status, visibility | MODIFY |
| Admin | pages/Admin.jsx | Auth gate dan dashboard | none | API, admin components | auth, projects, modal/loading/toast | MODIFY |
| LoginPortal | admin/LoginPortal.jsx | Login admin | onLoginSuccess | API, localStorage, Lucide | credentials/error/loading | KEEP/MODIFY |
| ProjectFormModal | admin/ProjectFormModal.jsx | Create/edit/upload/crop | initial, onSave, onCancel, loading, projects | API, upload, crop, Lucide | fields, images, upload/crop | KEEP/MODIFY |
| ImageCropModal | admin/ImageCropModal.jsx | Pan/zoom dan dual preview | imageUrl, onApply, onCancel, project metadata | Canvas API, Lucide | zoom, pan, dragging | KEEP/MODIFY |
| WebsiteSettingsModal | admin/WebsiteSettingsModal.jsx | Edit hero/contact | onClose, onSaved | API, Lucide | hero/contact/loading | MODIFY |
| MessagesInboxModal | admin/MessagesInboxModal.jsx | Read/status/delete inbox | onClose | API, Lucide | messages/loading | KEEP/MODIFY |
| ProfileConfigModal | admin/ProfileConfigModal.jsx | Update admin credentials | currentUser, onClose, onUpdated | API, localStorage | credentials/error/loading | KEEP + security redesign |
| ConfirmDialog | admin/ConfirmDialog.jsx | Confirm destructive action | message, onConfirm, onCancel | Lucide | none | KEEP |
| Toast | admin/Toast.jsx | Timed notification | message, type, onClose | React, Lucide | timer | KEEP |

Reusable paling kuat: hooks, Reveal, VMCard, ProjectCard, gallery Modal, FloatField, crop modal, ConfirmDialog, Toast, dan project CRUD workflow. Branding-specific: Navbar, Homepage, AboutUs, GlobalReach, Services, Certifications, Contacts, serta data/assets.

## 6. Page and Section Breakdown

| Section | File | Layout, data, interaksi, animasi, responsive |
|---|---|---|
| Navbar | components/layout/Navbar.jsx | Fixed full width; links About/Services/Portfolio dan CTA Contact. Logo CITASys. Scroll listener membuat background navy; IntersectionObserver active section; custom smooth scroll; hamburger pada mobile. |
| Hero | components/sections/Homepage.jsx | Full viewport memakai home.png/home_mobile.jpg. Copy PT Cipta Total Solusindo/CITASys, stats dan phrases dari /api/settings dengan fallback. Typewriter, count-up, fade-in-up, scroll indicator, SVG curved transition; overlay desktop/mobile berbeda. |
| About Us | components/sections/About.jsx | Copy hardcoded “Since 1997”, photo/background dan timeline. Reveal, masked photo, timeline checkpoint; desktop artwork dan mobile photo block. |
| Company History | About.jsx | Array MILESTONES hardcoded tahun 1997/2002/2004/2017; vertical timeline dengan staggered dot/line animation. |
| Vision & Mission | About.jsx | VisionMission memakai VMCard dengan copy/image hardcoded; reveal, hover scale/shadow/gradient, responsive grid. |
| Services | components/sections/Services.jsx | Array SERVICES berisi 6 tahap engineering. Card click dispatch changeCategory lalu scroll ke portfolio. SVG dashed connectors desktop; grid/stack mobile; staggered reveal. |
| Solutions | Tidak ada section eksplisit | Secara aktual direpresentasikan oleh Services/Turnkey Projects. CMP sebaiknya membuat section bernama Turn-Key Solutions. |
| Global Reach | components/sections/GlobalReach.jsx | Origin Indonesia, destinations, supporting points, SVG map dan images hardcoded. Hover/click map, animated arcs/progress, popup, reduced-motion check. Tidak relevan untuk scope CMP. |
| Certifications | About.jsx | CERTIFICATIONS ISO 9001, ISO 45001, AK3; cards reveal/hover. Hilangkan untuk CMP sesuai requirement. |
| Portfolio | PortfolioProjects.jsx | Default 10 project, override dari /api/projects; filter All/Automation/Engineering/Marine/Construction; grid, skeleton, empty state. Carousel 4 detik, pause on hover, pagination 6/item, gallery modal, prev/next. |
| Contact | Contacts.jsx | Contact settings dari /api/settings dengan fallback, info panel, form. Floating labels, loading/success/error, POST inbox, EmailJS attempt, Google Maps link; 2-column desktop dan stacked mobile. |
| Footer | Tidak ditemukan | MainSite berakhir setelah Contact. CMP perlu component Footer baru. |

## 7. Design System

### Color palette aktual

Tidak ada CSS variables/design-token file; warna ditulis langsung pada Tailwind class atau inline style.

| Peran | HEX aktual | Penggunaan |
|---|---|---|
| Navy | #03365b, #021f35, #022e4f, #02243e | Navbar, heading, background |
| Cyan accent | #00A3E0 | Active state, accent, SVG line, headings |
| Dark cyan CTA | #007CA7, #005f80, #0089b8 | Buttons, contact gradient |
| Body background | #f8fafc | index.css |
| Body text | #1e293b | index.css/cards |
| White | #ffffff | Cards, transition, text |
| Supporting blue | #38BDF8, #0284c7 | Contact/map |
| Status | emerald, red, rose, amber Tailwind colors | Toast/form/inbox |

### Typography dan tokens

- index.html memuat Manrope, sedangkan index.css mengimpor dan menetapkan Montserrat; Montserrat menjadi font global yang terlihat digunakan.
- Tidak ada spacing/token custom; memakai default Tailwind.
- Breakpoint yang dipakai: sm, md, lg, xl.
- Container utama: max-w-7xl, max-w-6xl, max-w-5xl, max-w-4xl dengan padding responsive.
- Grid: hero stats 3 kolom, services 6 kolom desktop, portfolio 2/3 kolom, contact 2 kolom desktop.
- Radius: rounded-xl/2xl/3xl/full.
- Shadow: md/lg/xl/2xl serta arbitrary cyan shadows.
- Button: rounded-xl/full, solid cyan/dark cyan atau white-on-navy, hover color/scale/shadow.
- Card: white, slate border, rounded, shadow, gradient hover overlay, bottom accent line.
- Animation: CSS transition, inline opacity/transform, animate-spin/pulse/bounce/ping, SVG stroke draw, requestAnimationFrame, IntersectionObserver.
- App.css kosong; global style diterapkan melalui main.jsx → index.css → @import tailwindcss.

Rekomendasi CMP: pindahkan semua warna menjadi semantic tokens agar rebranding tidak memerlukan edit hex di banyak JSX.

## 8. Interactive Features

| Fitur | Lokasi | Implementasi/temuan |
|---|---|---|
| Sticky navigation | Navbar.jsx | fixed nav, scroll listener, active section IntersectionObserver |
| Mobile navigation | Navbar.jsx | menuOpen, hamburger, max-height transition, close setelah link |
| Smooth scroll | Navbar.jsx, Homepage.jsx, Services.jsx, PortfolioProjects.jsx | Custom requestAnimationFrame di beberapa lokasi; pagination memakai native smooth; logic terduplikasi |
| Scroll animation | hooks/useInView.js dan sections | IntersectionObserver opacity/transform; default once false membuat animasi dapat reverse |
| Typewriter/counter | Homepage.jsx, useInView.js | Timers dan requestAnimationFrame |
| Filtering | PortfolioProjects.jsx | Filter tag case-insensitive; Services mengirim CustomEvent changeCategory |
| Pagination | PortfolioProjects.jsx | 6 item/page; reset saat filter; delayed transition |
| Carousel | ProjectCard | Auto-slide 4 detik, pause hover, dot indicator, manual controls |
| Gallery/lightbox | Modal dalam PortfolioProjects.jsx | Main image, thumbnails, counter, prev/next image dan project, close overlay |
| Contact form | Contacts.jsx | FloatField, status idle/loading/success/error, POST messages |
| Form validation | Contacts.jsx + backend | Backend hanya presence check; FloatField tidak meneruskan required; email type ada pada component tetapi validation tidak komprehensif |
| Email integration | Contacts.jsx | EmailJS memakai literal placeholder service/template/public key; error ditelan sehingga inbox success masih ditampilkan |
| Loading/error | Public/admin | Skeleton/spinner/fallback; banyak catch kosong/alert |
| Auth | LoginPortal, Admin, auth.js | HMAC token 7 hari, Bearer header, verify saat load, localStorage cleanup |
| Upload/crop | ProjectFormModal, ImageCropModal, upload.js | Multer disk upload; Canvas menghasilkan JPEG 960x600; URL disimpan ke project |

## 9. Data Management

| Data | Lokasi | Bentuk |
|---|---|---|
| Company profile/history/vision/mission | Homepage.jsx, About.jsx | Hardcoded JSX |
| Services | Services.jsx, array SERVICES | Hardcoded |
| Default projects | PortfolioProjects.jsx DEFAULT_PROJECTS dan backend/seed.js PROJECTS | Fallback + database seed |
| Runtime projects | PostgreSQL table projects | REST API |
| Hero/contact | backend/data/settings.json dan defaults controller/frontend | JSON + API |
| Messages | backend/data/messages.json | JSON + API |
| Images | frontend/src/assets dan backend/uploads | Bundled assets + local disk |
| Global map | world.geojson, worldMapPath.js, GlobalReach constants | Static frontend |
| TypeScript interfaces/schemas | Tidak ditemukan | JavaScript tanpa runtime schema validation |

Schema aktual dibuat oleh backend/seed.js:

~~~sql
projects(
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tag VARCHAR(100),
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
~~~

Contoh project aktual:

~~~json
{
  "category": "Automation",
  "title": "Industrial PLC & SCADA Control Panels",
  "description": "Custom engineered low-voltage switchboards...",
  "tag": "Automation",
  "images": ["/uploads/general_plc_control_panel.png"]
}
~~~

Model saat ini hybrid dan belum konsisten: projects PostgreSQL, settings/messages JSON filesystem, images local filesystem. Tidak ada CMS eksternal.

## 10. Backend and API

### Architecture

backend/server.js memasang CORS wildcard, JSON/urlencoded parser, static /uploads, lalu route modules. config/db.js membuat pg.Pool. Controller memproses request dan tidak memakai ORM.

### Endpoint inventory

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| GET | /api/health | Public | none | status ok dan time |
| GET | /api/projects | Public | none | Array project newest first |
| GET | /api/projects/:id | Public | id | Project atau 404 |
| POST | /api/projects | Bearer | category/title/description/tag/images | Created row |
| PUT | /api/projects/:id | Bearer | partial project | Updated row |
| DELETE | /api/projects/:id | Bearer | id | Deleted row |
| GET | /api/settings | Public | none | hero/contact settings |
| PUT | /api/settings | Bearer | partial hero/contact | Merged JSON settings |
| POST | /api/messages | Public | name/email/phone?/subject?/message | 201 + message |
| GET | /api/messages | Bearer | none | Sorted messages |
| PUT | /api/messages/:id/status | Bearer | status | Updated message |
| DELETE | /api/messages/:id | Bearer | id | Delete message |
| POST | /api/upload | Bearer | multipart images, max 20 | Public URLs |
| DELETE | /api/upload | Bearer | filename | Delete guarded file |
| POST | /api/auth/login | Public | username/password | Signed token + user |
| GET | /api/auth/verify | Bearer | none | Token validity |
| GET | /api/auth/profile | Bearer | none | Current user |
| PUT | /api/auth/update-profile | Bearer | current/new credential | Writes backend .env, new token |
| POST | /api/auth/logout | Public | none | Acknowledgement only |
| GET | /uploads/:filename | Public | filename | Static file |

Auth: auth.js membuat payload username + expiry, base64url encode, dan HMAC-SHA256 signature. Token berlaku 7 hari. Tidak ada refresh token, revoke list, password hashing, role database, rate limit, atau CSRF protection.

File upload: Multer disk storage, nama timestamp/random, extension + MIME regex, 10 MB/file, public static serving. Tidak ada image decoding/virus scan.

Email: tidak ada email service backend. EmailJS hanya dicoba pada browser dan memakai placeholder credential.

Error handling: SQL controller memakai try/catch; JSON controller fallback ke empty/default; 404 handler JSON ada di server.js. Tidak ada centralized error middleware, schema validation, structured logging, atau consistent error schema.

## 11. Branding Dependencies

| Dependency | Lokasi aktual | Yang harus diganti untuk CMP |
|---|---|---|
| Company name CITASys/PT Cipta Total Solusindo | Homepage.jsx, Navbar.jsx, LoginPortal.jsx, server.js, authController.js, README | Nama, labels, fallback/API text |
| Logo | frontend/src/assets/CITASys-LogoWhite.png, CITASys-Logos.png | Logo CMP dan alt text |
| Color palette | Semua section/admin dan server.js inline HTML | CMP tokens |
| Description/history | Homepage.jsx, About.jsx, settings.json, settingsController.js | Konten resmi CMP; established 2020 |
| Services | Services.jsx | Titles/descriptions/images/category |
| Projects | PortfolioProjects.jsx, seed.js, DB, backend/uploads | Dataset CMP |
| Contact | Contacts.jsx, settings.json, settingsController.js, WebsiteSettingsModal.jsx | Kontak resmi CMP |
| Admin identity | .env.example, authController.js, middleware/auth.js, localStorage keys | Namespace CMP dan secure credential handling |
| SEO metadata | frontend/index.html title citasys-frontend, lang en | CMP title, description, lang id, OG/canonical |
| Favicon | frontend/public/favicon.svg | Favicon CMP |
| Social media | Tidak ditemukan | Tambahkan hanya official CMP links |
| Upload URLs | seed.js, uploadController.js, frontend API | Infrastruktur bisa dipakai setelah storage hardening |

Path utama yang perlu diubah: frontend/src/App.jsx, frontend/src/components/sections/, components/layout/Navbar.jsx, pages/Admin.jsx, components/admin/, utils/api.js, frontend/index.html, public/favicon.svg, backend/seed.js, backend/data/settings.json, controllers/settingsController.js, controllers/authController.js, middleware/auth.js, dan environment deployment.

## 12. Code Quality and Technical Debt

| Temuan | Prioritas | Evidence/impact |
|---|---|---|
| Default credential dan default HMAC secret ada di source | Critical | middleware/auth.js dan authController.js; production dapat memakai secret lemah |
| CORS wildcard | High | server.js; semua origin dapat mengakses API |
| Password plaintext di .env dan direct comparison | High | authController.js; tidak ada hashing/secret manager |
| Endpoint update profile menulis .env dari HTTP request | High | Tidak cocok untuk immutable/serverless runtime |
| Token tidak direvoke saat logout | Medium | logout hanya acknowledgement |
| EmailJS memakai placeholder literal | High | Contact email aktual tidak akan bekerja |
| Contact form tidak memeriksa res.ok | High | Response API 4xx/5xx dapat tetap berakhir success |
| Tidak ada central validation/schema | High | Request body hanya divalidasi minimal |
| JSON file persistence tidak aman untuk concurrent/serverless writes | High | messagesController/settingsController |
| Upload MIME check lemah dan file public | Medium | Extension/MIME dapat dipalsukan; tidak ada scan |
| Tidak ada rate limit login/contact/upload | High | Brute force dan spam |
| Delete project tidak membersihkan image files | Medium | Orphan files |
| Custom smooth scroll terduplikasi | Medium | Navbar/Homepage/Services |
| Hardcoded branding tersebar | High | Banyak JSX, seed, defaults, dan admin labels |
| Duplicate heading “Get In Touch” | Low | Contacts.jsx |
| @headlessui/react dan @heroicons/react tampak tidak dipakai | Low | Tercantum dependency tanpa import yang ditemukan |
| Tidak ada tests | High | Tidak ada tests/config |
| Modal/focus/keyboard accessibility belum lengkap | Medium | Tidak terlihat focus trap/ESC handling konsisten |
| Reduced motion tidak konsisten | Medium | Hanya GlobalReach yang tampak mendeteksi |
| Responsive arbitrary sizes tersebar | Medium | Risiko layout drift |
| SEO minimal | Medium | Title default, no description/OG/structured data, lang en |
| Error observability lemah | Medium | catch kosong, alert, console-only |
| timingSafeEqual tanpa normalisasi signature length | Medium | Malformed token dengan panjang berbeda berpotensi throw |

Tidak ada unused component yang pasti: admin components di-import Admin dan public sections di-import App. Helper default About tidak dipakai sebagai page component, tetapi bukan issue fungsional.

## 13. Reusability Assessment

| Classification | Module | Alasan |
|---|---|---|
| KEEP | hooks/useInView.js | Generic viewport/count-up |
| KEEP | ProjectCard, gallery Modal, filter/pagination behavior | Fitur portfolio diminta tetap |
| KEEP | ImageCropModal, ConfirmDialog, Toast, MessagesInboxModal | Generic CMS primitives |
| KEEP | projectsController, projects routes, PostgreSQL schema | CRUD cukup jelas dan parameterized |
| KEEP with hardening | Multer upload pipeline | Relevan untuk CMS images |
| MODIFY | App.jsx/routing | CMP page composition |
| MODIFY | Navbar.jsx | Retain sticky/mobile/scroll; replace links/logo/tokens |
| MODIFY | Homepage.jsx | Retain typewriter/counter bila relevan; replace copy/assets |
| MODIFY | About.jsx | Retain Reveal/VMCard; replace facts and timeline 2020 |
| MODIFY | Services.jsx | Retain click-to-filter/animation; replace solution data |
| MODIFY | PortfolioProjects.jsx | Retain behavior; move category/data to CMP content/API |
| MODIFY | Contacts.jsx | Retain form UX; add real validation/error handling |
| MODIFY | Admin.jsx dan modals | Retain workflow; rename branding and harden auth |
| MODIFY | settings/messages persistence | Move to consistent production-safe database |
| REPLACE/REMOVE | GlobalReach.jsx dan map assets | CMP explicitly removes Global Reach |
| REMOVE/REPLACE | Certifications dan cert assets | CMP explicitly removes Certifications |
| REPLACE | CITASys logos, photos/backgrounds, seed content | Branding/content-specific |
| REMOVE | Our Commitment, Our People, Global Reach, Certifications | Di luar scope CMP |
| REMOVE after migration | CITASys fallback strings/default arrays | Mencegah leakage saat API kosong |

## 14. Migration Plan to CMP Website

### Target CMP design tokens

~~~css
:root {
  --cmp-primary: #010066;
  --cmp-accent: #FE0000;
  --cmp-cta: #E00000;
  --cmp-cta-hover: #B80000;
  --cmp-background: #FFFFFF;
  --cmp-background-alt: #F7F7F7;
  --cmp-border: #D8D9E2;
  --cmp-text-secondary: #4A4F63;
  --cmp-text-primary: #1B1D2E;
  --cmp-text-light-on-navy: #C9CBE8;
}
~~~

Gunakan semantic tokens, bukan arbitrary hex di banyak JSX.

### Struktur CMP

1. Navbar.
2. Hero — company positioning CMP dan established 2020.
3. About Us.
4. Vision & Mission.
5. Turn-Key Solutions.
6. Our Work / Project Portfolio.
7. Contact Us.
8. Footer baru.

Our Commitment, Our People, Global Reach, dan Certifications tidak dirender.

### Strategi mempertahankan fungsi

1. Pisahkan content model dari JSX; project, solution, hero, contact, dan company facts berasal dari API/config.
2. Pertahankan kontrak project API agar filter/pagination/gallery dapat direimplementasi tanpa mengubah backend lebih dulu.
3. Buat presentational components dengan CMP tokens dan inject data melalui props.
4. Ekstrak behavior reusable: smooth scroll, filter, pagination, gallery, form status.
5. Ganti global CustomEvent changeCategory dengan callback/state contract; event dapat dipertahankan sementara untuk kompatibilitas.
6. Hapus fallback CITASys setelah seed CMP tersedia.
7. Pertahankan admin workflow, tetapi rename localStorage namespace, tambah route guard, validation, error boundary, centralized API client.
8. Migrasikan settings/messages dari JSON ke PostgreSQL atau managed store.
9. Tambahkan visual regression, API integration, accessibility, dan responsive tests.

### Urutan implementasi

1. Inventory dan approval logo/assets/konten resmi CMP.
2. Design tokens dan layout primitives.
3. Rebuild Navbar, Hero, About, Vision/Mission, Solutions, Contact, Footer.
4. Reuse dan restyle portfolio behavior.
5. Remove Global Reach/Certifications.
6. Seed CMP data.
7. Harden authentication/API/upload/CORS/rate limit/error handling.
8. Test, accessibility, SEO, performance.
9. Staging review lalu production cutover.

## 15. Development and Deployment Guide

### Prerequisites

- Node.js 18+.
- npm.
- PostgreSQL 14+.
- Database kosong sesuai DB_NAME.

### Installation

~~~bash
cd backend
npm install

cd ../frontend
npm install
~~~

Buat backend/.env dari backend/.env.example. Nama environment variable yang digunakan:

~~~text
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
ADMIN_USER
ADMIN_PASSWORD
AUTH_SECRET
~~~

Nilai password, API key, token, dan secret tidak ditampilkan di dokumen ini.

### Database seed

~~~bash
cd backend
node seed.js
~~~

Seeder membuat/mereset table projects, menyalin asset, lalu memasukkan 10 sample project CITASys. Karena menjalankan DELETE FROM projects, jangan jalankan pada database production tanpa backup/approval.

### Development

~~~bash
cd backend
npm run dev
~~~

~~~bash
cd frontend
npm run dev
~~~

Default: frontend http://localhost:5173 dan backend http://localhost:3001.

### Build, preview, lint, production start

~~~bash
cd frontend
npm run build
npm run preview
npm run lint
~~~

~~~bash
cd backend
npm start
~~~

### Testing

Tidak ada script test atau test suite yang ditemukan. Validasi minimum saat ini adalah npm run lint, npm run build, smoke test /api/health, API project, login admin, upload, dan contact form. CMP sebaiknya menambahkan unit/component, API integration, auth/upload, dan Playwright E2E tests.

### Deployment

- frontend/vercel.json mendefinisikan frontend Vite, backend service, dan rewrite /api.
- Deployment membutuhkan environment variables backend dan PostgreSQL yang dapat diakses runtime.
- JSON files dan local uploads tidak ideal untuk serverless/ephemeral runtime; gunakan PostgreSQL dan object storage/CDN.
- Batasi CORS ke domain production frontend.
- Secrets harus diset melalui platform environment settings.
- Ganti index.html title/lang/favicon dan tambahkan description, Open Graph, canonical, serta structured data CMP.

## 16. Executive Summary

### Kondisi

CITASys sudah memiliki prototype/product internal yang cukup lengkap: public landing page, portfolio dengan filter/pagination/gallery, contact inbox, dan CMS admin. Struktur modular dan mudah dipahami, tetapi content/visual/fallback sangat hardcoded untuk CITASys dan backend belum production-hardened.

### Kelayakan sebagai fondasi CMP

**Layak sebagai fondasi fungsional dan referensi arsitektur, tetapi tidak layak dipakai langsung tanpa cleanup.** Nilai reusable terbesar adalah portfolio/CMS workflow, upload/crop, contact inbox, routing, dan responsive interactions. Global Reach, Certifications, visual assets, copy, serta branding harus dibuang atau dibuat ulang.

### Rekomendasi arsitektur final

Pertahankan React/Vite + Express REST API untuk tahap awal. Gunakan PostgreSQL sebagai source of truth untuk projects, settings, messages, dan admin users; gunakan object storage untuk images. Frontend perlu design tokens, content/API layer, reusable layout primitives, centralized API client, dan typed/validated contracts. Headless CMS baru diperlukan bila skala konten bertambah.

### Tahapan akhir

1. Freeze dan backup baseline.
2. Validasi konten resmi CMP.
3. Bangun design tokens/layout shell.
4. Rebuild delapan section CMP.
5. Reuse portfolio interactions dan admin.
6. Migrasi data/storage production-safe.
7. Security/API hardening.
8. Tests, accessibility, SEO, performance QA.
9. Staging review.
10. Production deployment dan monitoring.
