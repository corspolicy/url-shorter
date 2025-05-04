# URL Kısaltıcı

Bu proje, URL'leri kısaltmak için bir web uygulamasıdır. Next.js frontend ve Bun.js backend kullanılarak geliştirilmiştir.

![Proje Görüntüsü](https://i.imgur.com/XWPpAN6.png)
![Proje Görüntüsü](https://i.imgur.com/DYZs2uT.png) 

## Özellikler

- URL kısaltma
- Kısaltılmış URL'leri kopyalama
- Responsive tasarım
- Backend durum kontrolü

## Kurulum

1. Gerekli paketleri yükleyin:

\`\`\`bash
yarn install
\`\`\`

2. Uygulamayı geliştirme modunda başlatın:

\`\`\`bash
yarn dev
\`\`\`

Bu komut hem frontend'i (Next.js) hem de backend'i (Bun.js) aynı anda başlatacaktır.

### Alternatif Başlatma Yöntemi

Eğer `yarn dev` komutu ile backend ve frontend'i aynı anda başlatmakta sorun yaşıyorsanız, aşağıdaki adımları izleyin:

#### Windows için:

\`\`\`bash
start-dev.bat
\`\`\`

#### macOS/Linux için:

\`\`\`bash
chmod +x start-dev.sh  # İlk kullanımda çalıştırma izni verin
./start-dev.sh
\`\`\`

## Sorun Giderme

Eğer backend çalışmıyorsa:

1. Terminal'de `yarn dev` komutunun çalıştığından emin olun
2. Backend'in başlatılmasını bekleyin (30-60 saniye sürebilir)
3. Eğer hala çalışmıyorsa, yeni bir terminal açıp `cd backend && bun run index.ts` komutunu çalıştırın
4. Bun.js'in yüklü olduğundan emin olun. Yüklü değilse: `npm install -g bun`

## Kullanım

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Kısaltmak istediğiniz URL'yi girin ve "URL'yi Kısalt" butonuna tıklayın
3. Kısaltılmış URL'yi kopyalayın veya tıklayarak açın

## Teknik Detaylar

- Frontend: Next.js, React, Tailwind CSS, shadcn/ui
- Backend: Bun.js
- Veritabanı: JSON dosyası (data/db.json)

## Proje Yapısı

- `/app`: Next.js frontend kodları
- `/components`: React bileşenleri
- `/backend`: Bun.js backend kodları
- `/data`: Veritabanı dosyaları
- `/public`: Statik dosyalar
