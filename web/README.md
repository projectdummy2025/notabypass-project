# NotaBypass Web

Next.js web application untuk upload gambar transaksi, OCR processing, dan AI data cleaning.

## ✨ Fitur Utama

- **🎨 Premium UI/UX**: Glassmorphism design dengan Tailwind CSS Typography
- **📤 Drag & Drop Upload**: Upload gambar receipt/transaksi dengan drag & drop
- **🔍 Smart OCR**: Ekstrak teks dari gambar menggunakan OCR Worker (PaddleOCR)
- **🤖 AI Cleaning**: Bersihkan dan strukturkan data menggunakan AI (Google Gemma via OpenRouter)
- **📄 Markdown Export**: Hasilkan dokumen markdown yang rapi dengan informasi transaksi
- **📱 Fully Responsive**: Tampilan optimal di semua perangkat
- **🌙 Dark Mode Support**: Mendukung mode gelap secara otomatis

## 🎨 Design Features

### Typography System
- **Font**: Geist Sans & Geist Mono untuk tampilan modern dan tajam
- **Hierarki Visual**: H1-H6 dengan styling yang jelas dan konsisten
- **Muted Colors**: Warna teks deskripsi yang nyaman di mata

### Table Styling
- Border tipis minimalis
- Padding yang lega untuk readability
- Row kontras (zebra striping) untuk data transaksi
- Hover effects untuk interaksi yang lebih baik

### Visual Elements
- **Glassmorphism**: Kontainer dengan efek kaca buram
- **Subtle Shadows**: Bayangan halus untuk depth
- **Gradient Accents**: Aksen gradient untuk visual yang menarik
- **Smooth Transitions**: Animasi halus pada semua interaksi

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan masukkan API key:

```env
# Dapatkan dari: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_actual_api_key_here

# URL aplikasi (untuk OpenRouter HTTP-Referer)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# URL OCR Worker (jika running di Docker)
OCR_WORKER_URL=http://localhost:8000
```

### 3. Jalankan OCR Worker

Pastikan OCR Worker sudah berjalan di port 8000:

```bash
# Dari root project
docker-compose up ocr-worker
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Alur Kerja

1. **Upload Gambar**: User upload gambar receipt/transaksi
2. **OCR Processing**: Gambar dikirim ke OCR Worker (`/api/ocr` → `ocr-worker:8000/process`)
3. **AI Cleaning**: Teks mentah dari OCR dibersihkan dengan AI (`/api/clean` → OpenRouter API)
4. **Hasil**: User diarahkan ke halaman hasil dengan dokumen markdown yang rapi

## API Routes

### POST `/api/ocr`

Forward gambar ke OCR Worker.

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData dengan field `file` (image)

**Response:**
```json
{
  "status": "success",
  "filename": "image.jpg",
  "raw_text": "Toko ABC Jl. Maju Mundur No 1 ..."
}
```

### POST `/api/clean`

Bersihkan teks OCR menggunakan AI.

**Request:**
- Content-Type: `application/json`
- Body: `{ "rawText": "..." }`

**Response:**
```json
{
  "markdown": "# Transaction Document\n\n## Store: Toko ABC\n..."
}
```

## Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Typography**: @tailwindcss/typography
- **Markdown**: react-markdown, remark-gfm
- **AI**: OpenRouter API (Google Gemma 3n E2B)
- **OCR**: External OCR Worker (FastAPI + PaddleOCR)
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
web/
├── app/
│   ├── page.tsx              # Home = Upload page
│   ├── results/
│   │   └── page.tsx          # Results page dengan markdown view
│   ├── api/
│   │   ├── ocr/
│   │   │   └── route.ts      # OCR forwarding API
│   │   └── clean/
│   │       └── route.ts      # AI cleaning API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── markdown-renderer.tsx # Premium Markdown renderer component
│   └── README.md             # Component documentation
├── .env.example
├── package.json
└── tsconfig.json
```

## 🎨 MarkdownRenderer Component

Komponen `MarkdownRenderer` adalah custom renderer untuk menampilkan hasil transaksi dengan desain premium ala fintech.

### Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Auto Numeric Alignment** | Kolom angka/harga otomatis rata kanan |
| **Fintech Tables** | Border tipis, padding lega, hover effects |
| **Muted Typography** | Warna zinc yang nyaman di mata |
| **Dark Mode** | Support penuh untuk dark mode |
| **Smart Emphasis** | Kata "Total" dll otomatis lebih dominan |

### Cara Penggunaan

```tsx
import { MarkdownRenderer } from "@/components/markdown-renderer";

<MarkdownRenderer content={markdown} />
```

Lihat `components/README.md` untuk dokumentasi lengkap.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | API key untuk OpenRouter | Required |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi untuk HTTP-Referer | `http://localhost:3000` |
| `OCR_WORKER_URL` | URL OCR Worker service | `http://localhost:8000` |

## Error Handling

- **File validation**: Hanya menerima file gambar (PNG, JPG, JPEG, WEBP)
- **OCR errors**: Menampilkan error dari OCR Worker
- **AI errors**: Menampilkan error dari OpenRouter API
- **Missing API key**: Error 500 jika `OPENROUTER_API_KEY` tidak dikonfigurasi
