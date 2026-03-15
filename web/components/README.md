# MarkdownRenderer Component

Komponen premium untuk render Markdown dengan desain fintech yang clean dan profesional.

## 🎨 Fitur Desain

### Tipografi
- **Font**: Menggunakan font sistem (Inter/Geist/Satoshi style)
- **Line-height**: 1.6-1.8 untuk readability optimal
- **Warna**: Muted zinc (tidak hitam pekat) untuk mengurangi eye strain
  - Light mode: `zinc-700` untuk body text
  - Dark mode: `zinc-300` untuk body text

### Tabel Fintech Style
- **Border**: Bottom border tipis (`border-zinc-200` / `border-zinc-800`)
- **Padding**: Vertikal 14px (py-3.5) untuk spacing yang lega
- **Header**: Uppercase, small font (0.75rem), muted color
- **Auto-align**: Kolom angka/harga otomatis rata kanan
- **Hover effect**: Subtle background change pada row
- **Zebra striping**: Alternating row colors untuk readability

### Headers (H1-H4)
- **H1**: Bold (700), tracking-tight, border-bottom tebal
- **H2**: Semibold (600), tracking-tight, border-bottom tipis
- **H3-H4**: Medium weight, subtle spacing

### List Styling
- **Bullet points**: Custom dot dengan warna muted
- **Indentasi**: Konsisten dan cantik
- **Spacing**: space-y-2 untuk breathing room

### Text Emphasis
- **Bold/Strong**: Font-weight 600
- **Kata "Total"**: Otomatis lebih dominan (text-base, weight 600)
- **Italic**: Subtle muted color

## 📦 Cara Penggunaan

### Basic Usage

```tsx
import { MarkdownRenderer } from "@/components/markdown-renderer";

function MyComponent() {
  const markdownContent = `
# Transaction Report

## Items
| Item | Qty | Price |
|------|-----|-------|
| Apple | 2 | $5.00 |
| Bread | 1 | $3.50 |

**Total**: $8.50
  `;

  return (
    <MarkdownRenderer content={markdownContent} />
  );
}
```

### Dengan Custom Class

```tsx
<MarkdownRenderer 
  content={markdown} 
  className="prose-lg" 
/>
```

## 🎯 Deteksi Otomatis

### Kolom Angka (Auto Right-Align)
Komponen otomatis mendeteksi kolom yang berisi angka/harga dan meratakannya ke kanan:

```
✅ Terdeteksi sebagai angka:
- $100.00
- Rp 50.000
- 1,234.56
- ¥500
- €99.99
- -15.00

❌ Tetap rata kiri:
- Item name
- Description
- Date
```

### Kata Kunci Emphasis
Teks bold yang mengandung kata berikut akan mendapat styling khusus:
- Total
- Subtotal
- Grand Total
- Jumlah
- Keseluruhan

## 🌙 Dark Mode Support

Komponen sepenuhnya mendukung dark mode dengan palet warna zinc/slate:

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Body Text | zinc-700 | zinc-300 |
| Headings | zinc-900 | white |
| Muted | zinc-600 | zinc-400 |
| Borders | zinc-200 | zinc-800 |
| Tables (header) | zinc-50 | zinc-900/50 |
| Links | blue-600 | blue-400 |

## 🧩 Komponen Pendukung

Komponen ini menggunakan:
- `react-markdown` - Core Markdown renderer
- `remark-gfm` - GitHub Flavored Markdown (tables, strikethrough, dll)
- `@tailwindcss/typography` - Base prose styles

## 📝 Contoh Output

### Tabel Transaksi
```markdown
| Item | Quantity | Unit Price | Total |
|------|----------|------------|-------|
| Milk | 2 | $3.50 | $7.00 |
| Bread | 1 | $2.99 | $2.99 |
| Eggs | 12 | $0.25 | $3.00 |

**Subtotal**: $12.99
**Tax (10%)**: $1.30
**Total**: $14.29
```

Akan dirender dengan:
- Header tabel uppercase dan muted
- Kolom angka (Quantity, Unit Price, Total) rata kanan
- Row dengan hover effect
- Bottom border pada setiap row
- Kata "Subtotal", "Tax", "Total" dengan emphasis khusus

## 🎨 Customization

Untuk menyesuaikan styling, edit file `components/markdown-renderer.tsx`:

```tsx
// Ubah warna heading
h1: ({ node, children, ...props }) => (
  <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100" {...props}>
    {children}
  </h1>
),

// Ubah padding tabel
td: ({ node, children, ...props }: any) => (
  <TableCell align="left">
    {children}
  </TableCell>
),
```

Atau override di `globals.css`:

```css
.markdown-premium :where(h1) {
  color: your-custom-color;
}
```

## ♿ Accessibility

- Semantic HTML (h1-h4, table, th, td)
- Proper contrast ratios untuk WCAG AA
- Focus states untuk interactive elements
- Screen reader friendly

## 📱 Responsive Design

Komponen otomatis responsive:
- Tabel dengan overflow-x untuk mobile
- Font sizes yang scalable
- Padding yang menyesuaikan layar kecil

## 🔧 Troubleshooting

### Tabel tidak muncul styling
Pastikan menggunakan GFM (GitHub Flavored Markdown) syntax:
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Warna tidak sesuai dark mode
Periksa apakah parent container memiliki class `dark`:
```tsx
<html className="dark">
```

### Angka tidak rata kanan
Format angka harus konsisten (gunakan titik/koma desimal):
```
✅ $100.00
✅ Rp 50.000
❌ 100 dollar (tidak terdeteksi)
```
