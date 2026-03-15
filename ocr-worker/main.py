from fastapi import FastAPI, UploadFile, File
import uvicorn
import shutil
import os

app = FastAPI()

# Buat folder data jika belum ada
UPLOAD_DIR = "data"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/")
def read_root():
    return {"status": "OCR Worker is Running", "engine": "PaddleOCR"}

@app.post("/process")
async def process_ocr(file: UploadFile = File(...)):
    # 1. Simpan file sementara
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Placeholder Proses OCR (Nanti di Fase 2 kita masukkan logika PaddleOCR)
    # Untuk sekarang kita kembalikan pesan sukses dulu
    return {
        "filename": file.filename,
        "message": "File received. OCR logic will be implemented in Phase 2.",
        "raw_text": "INI ADALAH TEKS CONTOH HASIL SCAN NOTA" 
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)