# Sistem Manajemen Asset - PT Fumindo

Aplikasi pengelolaan data inventaris dan aset PT Fumindo yang dibangun menggunakan **PostgreSQL**, **NestJS** (Layered Architecture & Prisma ORM), serta **Vue.js 3** (Component-First Architecture & Tailwind CSS).

---

## 🏗️ Arsitektur Proyek

### 1. Database (PostgreSQL)
- **Nama Database**: `asset_fumindo`
- **Tabel**: `asset`
- **Field**:
  - `asset_id` (Primary Key, Auto Increment)
  - `asset_name` (VARCHAR 255)
  - `stock_quantity` (INTEGER)
  - `category` (VARCHAR 50, nilai: `'Consumable'` atau `'Non-Consumable'`)
  - `created_at` & `updated_at` (TIMESTAMPTZ)

### 2. Backend (NestJS + Prisma ORM + Layered Architecture)
Mengikuti pola **Layered Architecture** untuk pemisahan tanggung jawab (*Separation of Concerns*):
- **Controller Layer** (`src/assets/asset.controller.ts`): Menangani HTTP routing, parameter parsing, HTTP status codes, dan query pipes.
- **Service Layer** (`src/assets/asset.service.ts`): Menangani logika bisnis, validasi ketersediaan aset, validasi nilai stok, serta koordinasi repository.
- **Repository Layer** (`src/assets/asset.repository.ts`): Lapisan akses database (*data access layer*) yang mengisolasi pemanggilan Prisma Client.
- **DTO Layer** (`src/assets/dto/`): `CreateAssetDto`, `UpdateAssetDto`, `QueryAssetDto` dengan validasi ketat via `class-validator` & `class-transformer`.
- **Entity Layer** (`src/assets/entities/asset.entity.ts`): Domain model representasi aset.
- **Prisma Module** (`src/prisma/`): Singleton Prisma Client provider dengan graceful lifecycle hooks.

#### Endpoint API:
- `GET /assets` - Mendapatkan daftar aset (mendukung filter `category`, pencarian `search`, dan sorting `sortBy` & `sortOrder`).
- `GET /assets/stats` - Mendapatkan statistik ringkasan aset (total item, jumlah consumable, non-consumable, dan total kuantitas stok).
- `GET /assets/:id` - Mendapatkan detail satu aset berdasarkan ID.
- `POST /assets` - Menambahkan aset baru ke database.
- `PUT /assets/:id` - Memperbarui data aset yang sudah ada.
- `DELETE /assets/:id` - Menghapus data aset dari database.

---

### 3. Frontend (Vue.js 3 + Component-First + Tailwind CSS)
Didesain secara bersih, minimalis, dan fungsional tanpa kesan desain AI berlebihan (tidak memakai gradasi norak/neon glassmorphism):
- **Component-First Architecture**:
  - `AssetHeader.vue`: Header navigasi & indikator status koneksi API real-time.
  - `AssetStats.vue`: 4 kartu metrik informatif (Total Asset, Consumable, Non-Consumable, Total Stok Fisik).
  - `AssetToolbar.vue`: Search bar instan, filter kategori, tombol muat ulang (*refresh*), dan tombol tambah aset.
  - `AssetTable.vue`: Tabel data interaktif dengan fitur sorting kolom, badge kategori, indikator stok menipis, format tanggal lokal Indonesia, dan tombol aksi Edit & Hapus.
  - `AssetFormModal.vue`: Modal form untuk Tambah & Edit dengan validasi input.
  - `AssetDeleteModal.vue`: Dialog konfirmasi penghapusan demi keamanan data.
  - `AssetNotification.vue`: Toast notifikasi status berhasil atau gagal.
- **Styling**: Tailwind CSS v4 dengan palet netral Slate profesional.

---

## 🚀 Cara Menjalankan Aplikasi

### Menjalankan Backend (NestJS)
```bash
cd backend
bun install # atau npm install
bunx prisma generate
bun run start # berjalan di http://localhost:3000
```

### Menjalankan Frontend (Vue.js)
```bash
cd frontend
bun install # atau npm install
bun run dev # berjalan di http://localhost:5173
```

