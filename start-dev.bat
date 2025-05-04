@echo off
echo URL Kisaltici Uygulamasi Baslatiliyor...
echo.
echo 1. Backend (Bun.js) baslatiliyor...
cd backend
start cmd /k bun run index.ts
cd ..
echo.
echo 2. Frontend (Next.js) baslatiliyor...
echo.
echo Lutfen bekleyin...
timeout /t 5 /nobreak
start cmd /k next dev
echo.
echo Uygulama baslatildi!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Kapatmak icin terminal pencerelerini kapatin.
