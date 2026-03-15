# 1. Gunakan Python versi slim agar ukuran file tidak terlalu raksasa
FROM python:3.9-slim

# 2. Instal library sistem yang dibutuhkan oleh mesin OCR dan OpenCV
# Bagian ini wajib ada agar Docker tidak error saat mengolah gambar
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 3. Tentukan folder kerja di dalam Docker
WORKDIR /app

# 4. Copy file daftar library ke dalam Docker
COPY requirements.txt .

# 5. Instal library Python yang ada di daftar tadi
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy semua file dari folder ocr-worker ke dalam Docker
COPY . .

# 7. Biarkan Docker siap menerima perintah dari Docker Compose
CMD ["python", "ocr_processor.py"]
