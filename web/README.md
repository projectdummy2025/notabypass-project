# NotaBypass Web

Next.js web application untuk upload gambar transaksi, OCR processing, dan AI data cleaning.

## Fitur

- **Drag & Drop Upload**: Upload gambar receipt/transaksi dengan drag & drop atau click to browse
- **OCR Processing**: Ekstrak teks dari gambar menggunakan OCR Worker (PaddleOCR)
- **AI Cleaning**: Bersihkan dan strukturkan data menggunakan AI (Google Gemma via OpenRouter)
- **Markdown Export**: Hasilkan dokumen markdown yang rapi dengan informasi transaksi

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
- **AI**: OpenRouter API (Google Gemma 3n E2B)
- **OCR**: External OCR Worker (FastAPI + PaddleOCR)

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
├── .env.example
├── package.json
└── tsconfig.json
```

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
