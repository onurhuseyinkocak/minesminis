# MinesMinis 🚀

> **The most fun and engaging English learning platform for children!**  
> *Çocuklar için en eğlenceli ve etkileşimli İngilizce öğrenme platformu.*

![MinesMinis Banner](public/images/mine-logo.jpeg)

## 🌟 Proje Hakkında (About the Project)

**MinesMinis**, çocukların İngilizce öğrenimini sıkıcı bir süreçten çıkarıp, oyunlaştırma (gamification) dinamikleriyle dolu, interaktif ve eğlenceli bir maceraya dönüştüren modern bir web platformudur. Geleceğin eğitim vizyonuyla tasarlanan bu projede, çocuklar sadece kelime ezberlemekle kalmaz; oyunlar, videolar, çalışma kağıtları ve AI destekli sohbet arkadaşları ile dili yaşayarak öğrenirler.

Proje, modern web teknolojilerinin gücünü arkasına alarak **hızlı, güvenli ve kullanıcı dostu** bir deneyim sunar. Hem öğrenciler, hem ebeveynler hem de yöneticiler için özel paneller içerir.

---

## ✨ Temel Özellikler (Key Features)

### 🎮 Öğrenci Deneyimi (Student Experience)
- **Oyunlaştırılmış Öğrenme:** Kelime oyunları, eşleştirme kartları ve interaktif bulmacalar ile öğrenirken eğlenin.
- **AI Sohbet Arkadaşı (Mimi):** Yapay zeka destekli maskotumuz Mimi ile gerçek zamanlı İngilizce sohbet pratiği yapın.
- **İlerleme Takibi (XP & Level):** Her aktivitede XP kazanın, seviye atlayın ve liderlik tablosunda yerinizi alın.
- **Ödül Sistemi:** Günlük giriş ödülleri, rozetler ve sürpriz hediyeler.
- **Zengin İçerik Kütüphanesi:** Eğitici videolar, hikayeler ve özel çalışma kağıtları (Worksheets).
- **Kişiselleştirme:** Kendi avatarınızı seçin ve profilinizi özelleştirin.

### 👨‍👩‍👧‍👦 Ebeveyn Kontrolü (Parent Dashboard)
- **Gelişim Raporları:** Çocuğunuzun hangi konularda ne kadar ilerlediğini detaylı grafiklerle takip edin.
- **Aktivite İzleme:** Günlük kullanım süreleri ve tamamlanan görevleri görüntüleyin.
- **Güvenli İçerik:** Çocuğunuzun sadece yaş grubuna uygun içeriklere eriştiğinden emin olun.

### 🛠 Yönetici Paneli (Admin Panel)
- **Kullanıcı Yönetimi:** Öğrenci ve veli hesaplarını kolayca yönetin.
- **İçerik Yönetimi:** Yeni kelimeler, videolar ve çalışma kağıtları ekleyin/düzenleyin.
- **Premium Üyelik Sistemi:** Abonelikleri ve ödeme durumlarını (Stripe entegrasyonu) kontrol edin.

---

## 💻 Teknolojik Altyapı (Tech Stack)

Bu proje, sektör standartlarında, performans odaklı ve ölçeklenebilir teknolojiler kullanılarak geliştirilmiştir.

| Alan | Teknolojiler |
|------|-------------|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Vanilla CSS, TailwindCSS (Utility-first), Framer Motion (Animations) |
| **State Management** | React Context API, Custom Hooks |
| **Backend / Database** | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| **Routing** | React Router DOM v6 |
| **Forms & Validation** | React Hook Form, Zod |
| **AI Integration** | OpenAI API (Mimi Chatbot) |
| **Deployment** | Vercel / Netlify Ready |

---

## 🚀 Kurulum ve Çalıştırma (Getting Started)

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

### Gereksinimler
- Node.js (v18+)
- npm veya yarn

### Adımlar

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/onurhuseyinkocak/minesminis.git
   cd minesminis
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın (.env):**
   `cp .env.example .env` — Firebase, Supabase ve `SUPABASE_SERVICE_ROLE_KEY` değerlerini girin.
   Admin paneli için `SUPABASE_SERVICE_ROLE_KEY` zorunludur (Supabase Dashboard → Settings → API → service_role).

4. **Veritabanı Migration:**
   Supabase link yoksa: Dashboard → SQL Editor'de `run_migrations_manual.sql` içeriğini çalıştırın.
   Veya `supabase link` sonrası `npx supabase db push`.

5. **Projeyi Başlatın:**
   ```bash
   npm run dev
   ```

6. **Tarayıcıda Açın:**
   `http://localhost:5173` adresine gidin.

---

## 🤝 Katkıda Bulunma (Contributing)

Bu proje açık kaynak ruhuyla geliştirilmeye devam etmektedir. Her türlü katkı, öneri ve hata bildirimi (issue) bizim için değerlidir. Pull request göndermekten çekinmeyin!

---

## 📞 İletişim (Contact)

**Geliştirici:** Onur Hüseyin Koçak  
**GitHub:** [onurhuseyinkocak](https://github.com/onurhuseyinkocak)

---

<p align="center">
  <i>Made with ❤️ for future generations.</i>
</p>
