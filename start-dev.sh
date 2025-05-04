#!/bin/bash

echo "URL Kisaltici Uygulamasi Baslatiliyor..."
echo ""
echo "1. Backend (Bun.js) baslatiliyor..."
cd backend
bun run index.ts &
BACKEND_PID=$!
cd ..
echo ""
echo "2. Frontend (Next.js) baslatiliyor..."
echo ""
echo "Lutfen bekleyin..."
sleep 5
next dev &
FRONTEND_PID=$!
echo ""
echo "Uygulama baslatildi!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo ""
echo "Kapatmak icin Ctrl+C tuslarina basin."

# Sinyalleri yakala
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Süreçlerin tamamlanmasını bekle
wait
