# Rentivo — Platform Sewa Properti (MERN)

Rentivo menghubungkan **penyewa** dengan **pemilik properti** yang sudah disetujui admin. Dibangun dengan MongoDB, Express, React, dan Node.js.

## Fitur

- Registrasi & login (Renter / Owner), JWT di cookie `httpOnly`, logout, reset password dengan kode 6 digit via email
- Dashboard per role dengan route terproteksi (Renter, Owner, Admin)
- Admin menyetujui / mencabut akses owner
- Owner: tambah (multi foto), lihat, edit, hapus properti; kelola booking (konfirmasi / tolak / kembalikan ke pending)
- Pencarian properti: alamat, jenis iklan, tipe, rentang harga, urutan, pagination 6 per halaman
- Booking oleh renter + riwayat booking; pembatalan booking pending (riwayat tetap tersimpan sebagai `cancelled`)
- Ketersediaan otomatis: properti menjadi `Booked` saat dikonfirmasi; booking pending lain otomatis `rejected`
- Statistik dashboard untuk Admin & Owner; harga dalam Rupiah

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS 4, Ant Design 6 |
| Backend | Node.js, Express 5 (MVC), Multer, Nodemailer |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt, cookie httpOnly |

## Struktur Folder

```
Backend/
├── index.js            Express app, CORS, routes, static uploads
├── config/             connect.js (MongoDB), mailer.js (email kode reset)
├── controllers/        userController, ownerController, adminController
├── middlewares/        authMiddleware (JWT + role check)
├── models/             UserSchema, PropertySchema, BookingSchema
├── routes/             userRoutes, ownerRoutes, adminRoutes
├── scripts/            createAdmin.js, seed.js
└── uploads/            foto properti
Frontend/src/
├── App.jsx             routes, UserContext, ProtectedRoute
├── api.js              axios instance, format Rupiah/tanggal
└── modules/
    ├── admin/          AdminHome, AdminStats, AllUsers, AllProperty, AllBookings
    ├── common/         Home, Login, Register, ForgotPassword, Navbar, StatCards, ...
    └── user/
        ├── AllPropertiesCards.jsx
        ├── owner/      OwnerHome, OwnerStats, AddProperty, AllProperties, AllBookings
        └── renter/     RenterHome, AllProperties (riwayat booking)
```

## Menjalankan

Prasyarat: Node.js 18+ dan MongoDB (lokal atau Atlas).

```bash
git clone https://github.com/OceanCharlie/rentivo.git
cd rentivo

# Backend
cd Backend
npm install
cp .env.example .env      # isi JWT_KEY dengan string acak
npm run seed              # opsional: akun & properti demo
npm run dev               # http://localhost:8001

# Frontend (terminal lain)
cd Frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8001
npm run dev               # http://localhost:5173
```

Akun demo dari `npm run seed` (password `Test@123`): `admin@rentivo.test`, `owner@rentivo.test`, `renter@rentivo.test`.

Admin tidak bisa daftar dari website. Buat lewat:

```bash
cd Backend
npm run create-admin -- "Nama Admin" admin@contoh.com <password>
```

Jika SMTP di `.env` kosong, kode reset password dicetak di console backend.

## API

Base URL `http://localhost:8001`. Respons: `{ success, message, data }`.

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | /api/user/register | Publik | name, email, password, type (Renter/Owner) |
| POST | /api/user/login | Publik | email, password → set cookie |
| POST | /api/user/logout | Publik | hapus cookie |
| POST | /api/user/forgotpassword/request | Publik | email → kirim kode |
| POST | /api/user/forgotpassword/reset | Publik | email, otp, password |
| GET | /api/user/getAllProperties | Publik | semua properti |
| POST | /api/user/getuserdata | Login | data user login |
| POST | /api/user/bookinghandle/:propertyid | Renter | userDetails { fullName, phone } |
| GET | /api/user/getallbookings | Renter | riwayat booking |
| DELETE | /api/user/cancelbooking/:bookingid | Renter | batalkan booking pending |
| POST | /api/owner/postproperty | Owner (granted) | multipart + propertyImages[] |
| GET | /api/owner/getallproperties | Owner (granted) | properti milik owner |
| PATCH | /api/owner/updateproperty/:propertyid | Owner (granted) | field + propertyImage opsional |
| DELETE | /api/owner/deleteproperty/:propertyid | Owner (granted) | hapus properti |
| GET | /api/owner/getallbookings | Owner (granted) | booking untuk properti owner |
| POST | /api/owner/handlebookingstatus | Owner (granted) | bookingId, status (booked/pending/rejected) |
| GET | /api/admin/getallusers | Admin | semua user |
| POST | /api/admin/handlestatus | Admin | userid, status (granted/ungranted) |
| GET | /api/admin/getallproperties | Admin | semua properti |
| GET | /api/admin/getallbookings | Admin | semua booking |

## Developer

**Ocean** — [github.com/OceanCharlie/rentivo](https://github.com/OceanCharlie/rentivo)
