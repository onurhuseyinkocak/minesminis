# 🚀 Backend Server Başlatma Rehberi

## ✅ Kurulum Tamamlandı!

Backend proxy server başarıyla oluşturuldu. Artık OpenAI API çağrıları güvenli backend üzerinden yapılacak.

## 📁 Ne Değişti?

### Yeni Dosyalar:
- ✅ `server/package.json` - Backend dependencies
- ✅ `server/server.js` - Express proxy server
- ✅ `server/.env` - API key (GÜVENLİ - backend'de)

### Güncellenen Dosyalar:
- ✅ `src/services/aiService.ts` - Artık backend'i çağırıyor
- ✅ `package.json` - Server scriptleri eklendi
- ✅ `vite.config.ts` - API key kaldırıldı

## 🎯 Nasıl Çalıştırılır?

### Manuel Yöntem (2 Terminal):

**Terminal 1 - Backend:**
```bash
cd server
npm install  # İlk seferinde
npm run dev
```
✅ Backend çalışıyor: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend çalışıyor: http://localhost:5173

## ✨ Test Etme

1. **Backend Health Check:**
   - Tarayıcıda aç: http://localhost:3001/api/health
   - Görmeli: `{"status":"ok","message":"Server is running"}`

2. **Chat Test:**
   - Frontend'i aç: http://localhost:5173
   - Mimi'ye tıkla
   - Mesaj gönder
   - Console'da (F12) göreceksin:
     ```
     🚀 Sending request to backend proxy...
     ✅ Response received from backend
     ```

## 🔍 Sorun Giderme

### "Backend server not running" Hatası:
```bash
# Terminal 1'de backend'i başlat:
cd server
npm run dev
```

### Backend Konsol Logs:
Backend terminal'de göreceksin:
```
✅ OpenAI API Key loaded: sk-proj-amOHiNBrz...
🚀 Backend proxy server running on http://localhost:3001
✅ Ready to proxy requests to OpenAI API
📨 Received chat request with X messages
✅ OpenAI response received
```

### Port zaten kullanılıyor:
```bash
# Başka bir uygulamayı kapat veya port değiştir
# server/server.js içinde PORT = 3001'i değiştir
```

## 🎉 Avantajlar

✅ **CORS Sorunu YOK** - Backend proxy çözdü
✅ **API Key GÜVENLİ** - Browser'da görünmez
✅ **Hata Yönetimi** - Backend detaylı loglar
✅ **Production Ready** - Sunucu ortamında çalışır

## 📝 Önemli Notlar

- ❗ Backend **MUTLAKA** çalışmalı
- ❗ `server/.env` dosyası **GİZLİ** tut (Git'e ekleme)
- ❗ Production'da backend URL'i güncelle

## 🚀 Production Deployment

1. Backend'i ayrı bir sunucuya deploy et (Heroku, Railway, etc.)
2. Frontend'de `BACKEND_URL` değiştir:
   ```typescript
   const BACKEND_URL = 'https://your-backend.herokuapp.com';
   ```
3. CORS ayarlarını güncelle (production domain ekle)

## ✅ Her Şey Hazır!

Backend ve frontend'i başlat, Mimi ile konuş! 🐻💬
