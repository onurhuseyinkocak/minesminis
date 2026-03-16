# Quality Gates – Kapsam ve Kullanım

## Gate'ler ne yapar, ne yapmaz?

| Ne yapar | Ne yapmaz |
|----------|-----------|
| **Kaynak kodu** tarar (CSS, JS, TS) | Canlı siteyi **açmaz**, tarayıcıda **çalıştırmaz** |
| Dosyalardaki **statik** kuralları kontrol eder | Render edilmiş renkleri / layout'u **ölçmez** |
| Gelecek commit'lerde bu kuralların bozulmasını **engeller** | Mevcut sitedeki görsel hataları **tek başına düzeltmez** |

Yani: Gate'ler **“kodu böyle yazarsan ileride tutarlı olur”** garantisi verir; **“şu an sitede her sayfa/buton/metin aynı temada”** demek için yeterli değildir. Canlı görsel kontrol için uygulamayı çalıştırıp sayfa sayfa (ve light/dark) test etmen veya E2E/visual regression eklemen gerekir.

## UI/UX Gate – Renk ve tema

UI gate artık şunları **uyarı** olarak raporlar:

1. **Tema değişken eşleşmesi (parity)**  
   `:root` ile `[data-theme="dark"]` arasında kritik değişkenler (örn. `--text-dark`, `--bg-soft`, `--primary-orange`) aynı isimlerle dark’ta da var mı diye bakar. Eksikse: “Dark temada bazı sayfalar yanlış renkte görünebilir” uyarısı verir.

2. **Hardcoded renk kullanımı**  
   Her CSS dosyasında `var(--…)` dışında kalan hex/rgb sayısını sayar. Bir dosyada 30’dan fazla hardcoded renk varsa: “Bu dosyada tema değişkeni yerine sabit renk kullanılıyor; buton/metin/arka plan tutarsız olabilir” uyarısı verir.

Bu uyarılar, sitede gördüğün **renk uyumsuzluklarının** büyük ihtimalle nereden geldiğini (hangi sayfa/hangi CSS) işaret eder. Düzeltmek için ilgili CSS’te sabit renkleri `var(--text-dark)`, `var(--primary-orange)` vb. ile değiştirmen gerekir.

## Nasıl çalıştırılır?

```bash
npm run gate          # Tüm gate'ler
npm run gate:ui       # Sadece UI/UX (renk, !important, z-index)
npm run gate:lint     # Sadece ESLint
```

## Gelecek değişimler

- Gate’ler **her çalıştırmada** güncel kaynak kodu tarar; yeni eklediğin sayfa/buton/metin stilleri de bu kurallara girer.
- İstersen E2E (örn. Playwright) veya görsel regression ile “açılan sitede şu sayfada bu renk var mı?” gibi canlı kontroller ekleyebilirsin; bu gate’lerin yerini almaz, üzerine eklenir.
