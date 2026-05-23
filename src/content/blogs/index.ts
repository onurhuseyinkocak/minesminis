/**
 * Static blog post registry.
 *
 * Each post is a fully-formed article (900-1300 words, original Turkish content)
 * bundled at build time. These ensure the /blog and /blog/[slug] routes have
 * substantive content regardless of database state — critical for AdSense
 * approval ("low value content" rejection vector).
 *
 * To add a new post: append an entry below. To remove, delete the entry
 * and update STATIC_BLOG_SLUGS in api/sitemap.ts accordingly.
 */

export interface StaticBlogPost {
  slug: string
  title: string
  excerpt: string
  meta_description: string
  keywords: string[]
  category: 'teaching-english-to-kids' | 'teacher-resources'
  reading_time_min: number
  published_at: string
  content_html: string
}

export const posts: StaticBlogPost[] = [
  {
    slug: 'maarif-modeli-ilkokul-ingilizce-mufredat-rehberi',
    title: 'Maarif Modeli İlkokul İngilizce Müfredatı: Aileler İçin Pratik Rehber',
    excerpt: 'MEB Maarif Modeli müfredatında hangi beceriler hangi sınıfta öğretiliyor? 2-3-4. sınıf farkları ve evde destekleme yolları.',
    meta_description: 'MEB Maarif Modeli ilkokul İngilizce müfredatı rehberi. 2-3-4. sınıf hedefleri, evde nasıl desteklenir? Aileler için pratik ipuçları.',
    keywords: ['Maarif Modeli', 'MEB İngilizce müfredatı', 'ilkokul İngilizce', 'evde İngilizce destek'],
    category: 'teacher-resources',
    reading_time_min: 7,
    published_at: '2026-05-20T09:00:00Z',
    content_html: `<h2>Maarif Modeli İngilizce Müfredatı Nedir?</h2>
<p>2023 yılında Türkiye Maarif Vakfı tarafından geliştirilen yeni ilkokul İngilizce müfredatı, Türk çocuklarının yaş ve gelişim seviyelerine uygun şekilde tasarlanmıştır. Millî Eğitim Bakanlığı bu müfredatı kademeli olarak devlet ilkokullarında uygulamaya almıştır. Geleneksel gramer-merkezi yaklaşımdan farklı olarak, bu sistem <strong>iletişimsel yeterlik</strong> (communicative competence) üzerine odaklanır: çocuğun cümle kurabilmesi, basit soruları cevaplayabilmesi, yaşıtlarıyla iletişim kurabilmesi.</p>
<p>Aile olarak çocuğunuzun okulda ne öğrendiğini bilmek, evde verdiğiniz desteğin etkili olmasını sağlar. Bu rehber, her sınıf düzeyinin beklentilerini açıklar ve pratik destekleme yollarını sunar.</p>

<h2>2. Sınıf: Dinleme ve Basit Sözlü İfade</h2>
<p>2. sınıf, çocukların İngilizceye ilk kez sistematik biçimde maruz kaldığı dönemdir. Resmî müfredat hedefleri:</p>
<ul>
  <li><strong>Dinleme ve söyleme:</strong> Sınıf komutlarını anlama ("Stand up", "Sit down", "Open your book"), basit selamlaşmalar ("Hello", "How are you?", "I'm fine, thanks"), sayılar 1-10, renkler ve temel hayvanlar.</li>
  <li><strong>Kelime hedefi:</strong> 100-150 temel sözcük; günlük nesneler ("desk", "chair", "pen"), aile üyeleri.</li>
  <li><strong>Gramer:</strong> Açık gramer öğretimi yoktur; sadece dinleme ve öğrenilen cümleleri tekrarlama.</li>
  <li><strong>Yazı:</strong> Tanıma düzeyinde; çocuktan üretim beklenmez.</li>
</ul>
<p><strong>Evde destekleme:</strong> Öğretmenin önerdiği şarkıları ("Twinkle Twinkle Little Star", "Head Shoulders Knees and Toes") birlikte dinleyin. Kahvaltı sırasında "What color is your juice?" gibi basit ama bağlamlı sorular sorabilirsiniz. Cevap vermese bile soruya maruz kalması yeterlidir.</p>

<h2>3. Sınıf: İlk Basit Cümleler</h2>
<p>3. sınıfta çocuklar ilk kez özne ("I", "you") ve basit fiillerle ("have", "like") cümle kurmaya başlar. Krashen'in (1985) Input Hypothesis çerçevesinde, bu yaş <strong>anlam-merkezli öğrenmenin</strong> doruğudur: çocuk önce anlar, sonra konuşur.</p>
<p>3. sınıf hedefleri:</p>
<ul>
  <li>"I have a cat." "You like apples." gibi temel cümle yapıları.</li>
  <li>Beslenme, hobi, aile üyeleri, ev eşyaları temalarında 200-250 sözcük.</li>
  <li>Soru yapısı ("Do you like...?", "Is it a...?") tanıma düzeyinde.</li>
  <li>Basit yazılı alıştırmalar: boşluk doldurma, eşleştirme, görsel-kelime eşlemesi.</li>
</ul>
<p><strong>Evde destekleme:</strong> Akşam yemeği sırasında doğal bağlamlı konuşma: "Mummy likes pasta. I like pizza. What do you like?" Çocuğunuzun kendi cümlelerini kurmaya teşebbüs etmesine izin verin. Hataları doğrudan düzeltmek yerine, doğru formayı sesli olarak tekrarlayın ("Oh, you like banana!" diye onaylayıp doğru formu modelleyin).</p>

<h2>4. Sınıf: Karmaşık Yapılar ve Okuma</h2>
<p>4. sınıfta müfredat belirgin biçimde gelişir. Okuma becerisi ön plana çıkar; Past Simple gibi geçmiş zaman yapıları tanıtılır.</p>
<ul>
  <li><strong>Kelime:</strong> 400-500 sözcük; hobi, sağlık, meslekler, spor, ulaşım.</li>
  <li><strong>Gramer:</strong> Present Simple tam kapsamı ("I play", "He plays"), Past Simple başlangıcı ("I played", "She went"), "going to" yapısı, basit edatlar (in, on, under).</li>
  <li><strong>Okuma:</strong> Kısa hikâyeler (40-50 sözcük), masallar ("The Three Little Pigs" uyarlamaları).</li>
  <li><strong>Yazı:</strong> Basit paragraflara başlama, ad ve kendini tanıtma yazıları, günlük ifadeler.</li>
</ul>
<p><strong>Önemli fark:</strong> 2-3. sınıftan farklı olarak, 4. sınıfta çocuktan yazılı ürün beklenir. Bu, yazılı sınavlarda puanlandırılır.</p>
<p><strong>Evde destekleme:</strong> Oxford Reading Tree veya benzeri seri kitapları birlikte okuma. "What happened next?" soruları çocuğun anlama düzeyini test eder. Hafta sonu basit bir günlük yazma (3-4 cümle, "Saturday. I played football. I ate ice cream. It was fun.") yazı becerisini doğal biçimde geliştirir.</p>

<h2>Sınıflar Arası Köprü: Aileler Ne Yapmalı?</h2>
<p>Müfredat ilerledikçe sadece dinlemeden konuşmaya, sonra okuma-yazmaya geçiş beklenir. Bu geçişleri desteklemek için:</p>
<ol>
  <li><strong>Öğretmenle bağlantı kurun:</strong> Ayda bir kez çocuğunuzun zayıf alanlarını sorun. "4. sınıfta yazı becerisi geride" duyduysanız evde yazı pratiğini artırın.</li>
  <li><strong>Oyun temelli alıştırmalar:</strong> Her sınıf düzeyinde oyun motivasyonu korur. 2. sınıfta "Simon Says" (hareketli komutlar), 4. sınıfta "Story Building" (çocuk cümlelerle hikâye oluşturur).</li>
  <li><strong>Yazılı materyal sağlayın:</strong> 3-4. sınıfta kitap okuma rutini oluşturun. Haftada 2-3 kez, 10-15 dakika İngilizce kitap okuma yeterlidir.</li>
</ol>

<h2>Müfredat Esnekliği: Hızlı ve Yavaş İlerleyenler</h2>
<p>Müfredat sınıf-bazlı olmakla birlikte öğretmenlere bireysel farklar için esneklik tanır. Eğer çocuğunuz hızlı ilerliyorsa müfredat hedeflerini aşmayan ancak ilgi alanına dayalı materyaller (yaş uygun çizgi roman, "Easy English for Kids" YouTube kanalı) destekleyicidir. Yavaş ilerliyorsa "bir seviye aşağı" prensibini uygulayın — müfredat hedefinden bir adım geride kalarak güven kazandırın.</p>

<h2>Pratik: 2-3-4. Sınıf Kontrol Listesi</h2>
<p>Çocuğunuzun müfredatı takip edip etmediğini kontrol etmek için bu listeyi kullanın:</p>
<ul>
  <li>Sınıf komutlarını anlıyor mu? ("Open your book", "Line up", "Listen carefully")</li>
  <li>10 renkten en az 8'ini adlandırabiliyor mu?</li>
  <li>5-7 hayvan adını söyleyebiliyor mu?</li>
  <li>3. sınıfta: "I like..." ve "I have a..." cümleleri kurabiliyor mu?</li>
  <li>4. sınıfta: 3-4 cümlelik paragraf yazabiliyor mu?</li>
</ul>
<p>Bu maddelerden herhangi birinde takılıyorsa, öğretmene danışın — müfredat destekleme programları okullarda mevcuttur.</p>

<h2>Sonuç</h2>
<p>Maarif Modeli müfredatı, çocuğunuzun yaşına ve seviyesine uygun bir yapı sunar. Aileler, okulda öğrenilenleri evde tekrar ederek ve oyunlu etkinliklerle destekleyerek çocuğunuzun İngilizce yolculuğunu hızlandırır. Unutmayın: düzenli maruz kalma (günde 15-20 dakika), oyunlar ve pozitif geri bildirim, uzun vadede en etkili yöntemlerdir.</p>`,
  },
  {
    slug: '4-6-yas-ingilizce-ogretime-baslamak-bilim',
    title: '4-6 Yaş Çocukta İngilizce Öğretimine Başlamak: Bilim Ne Diyor?',
    excerpt: 'Krashen Input Hypothesis, beyin plastisitesi, kritik dönem. 4-6 yaşta İngilizceye başlamak neden ideal? Bilimsel temeller.',
    meta_description: '4-6 yaş çocukta İngilizce öğretime başlama bilimi: Krashen, kritik dönem, beyin gelişimi. Aileler için kanıt temelli rehber.',
    keywords: ['çocuk dil öğrenimi', 'erken yaşta İngilizce', 'Krashen', 'kritik dönem'],
    category: 'teaching-english-to-kids',
    reading_time_min: 8,
    published_at: '2026-05-18T10:30:00Z',
    content_html: `<h2>Neden 4-6 Yaş?</h2>
<p>Türkiye'de geleneksel olarak İngilizce öğretimi ilkokulun 2. sınıfında (7-8 yaş) resmî biçimde başlar. Ancak son yirmi yılın dil edinim araştırmaları, 4-6 yaş aralığının <strong>ikinci dil öğrenimi açısından altın dönem</strong> olduğunu açıkça gösterir. Bu, beyin fizyolojisinin ve dilsel gelişimin eşsiz bir birleşimidir.</p>

<h2>Krashen'in Input Hypothesis: Temel Bilim</h2>
<p>Ünlü dilbilimci Stephen Krashen, 1985'te "Comprehensible Input" (Anlaşılabilir Girdi) hipotezini ortaya koymuştur. Buna göre dil öğrenimi iki farklı yoldan gerçekleşir:</p>
<ol>
  <li><strong>Acquisition (Edinim):</strong> Bilinçsiz, oyun ve etkileşim yoluyla dile maruziyet. Çocuk anlamaya çalışırken beyninde bilinçdışı bir şekilde dilsel kuralları içselleştirir.</li>
  <li><strong>Learning (Öğrenme):</strong> Bilinçli, gramer kuralları ve tekrarlama yoluyla öğrenme. Genellikle okulda ders olarak öğrenilen yol.</li>
</ol>
<p>Krashen'in temel bulgusu şudur: <strong>4-6 yaş çocukları "Acquisition" modunda öğrenir.</strong> Yetişkin "This is a pen" cümlesini ezberlerken, 4 yaşındaki çocuk "pen" sözcüğünü göz-el koordinasyonu ve ses ile bir bütün olarak hatırlar — bilinçli gramer olmaksızın.</p>

<h2>Beyin Plastisitesi ve Kritik Dönem</h2>
<p>Nörobilim, beynin 0-7 yaş arasında <strong>maksimum plastisiteye</strong> (esnekliğe) sahip olduğunu gösterir. Plastisitik, beynin yapısını ve sinir bağlantılarını yeniden düzenleme yeteneğidir. Bu dönemde:</p>
<ul>
  <li><strong>Sinapslar (sinir bağlantıları):</strong> Hızla oluşur ve güçlenir. Dile maruz kalınan sesler beyin tarafından "ana dil" olarak kablolayan bağlantılar oluşturur.</li>
  <li><strong>Çokdillilik avantajı:</strong> 4-6 yaş çocuk aynı anda 2-3 dili doğal olarak öğrenebilir. 8 yaşından sonra bu bağlantılar daha az esnek olur; ek dil öğrenmek daha bilinçli çaba gerektirir.</li>
  <li><strong>Telaffuz:</strong> 4-6 yaşta yabancı dil fonemlerini (ses birimlerini) beynin işitsel sistemi etkili biçimde kaydeder ve doğru biçimde üretmeye başlar.</li>
</ul>
<p>Somut örnek: 4 yaşındaki Türk çocuğu, İngilizce "th" sesini (the, this) 200 saatlik maruziyet ile doğal olarak çıkarabilir. Aynı çocuk 10 yaşında başlasa, aylar geçse bile Türkçe /s/ telaffuzuna geri dönmek istemekten kurtulamayabilir.</p>

<h2>Anaokulu İngilizce Programları: Uluslararası Kanıt</h2>
<p>Kanada, İsveç ve Finlandiya gibi ülkelerde anaokulu seviyesinde İngilizce programları 20+ yıldır uygulanır ve izlenir. Bulgular tutarlıdır:</p>
<ul>
  <li><strong>Akademik etki:</strong> Anadili gelişimi olumsuz etkilenmez. Aksine, iki dili konuşan çocuklar okuma-yazma ve problem çözme becerilerinde eşit veya daha iyi performans gösterir (Cummins, 1979 — Interdependence Hypothesis).</li>
  <li><strong>Sosyal-duygusal etki:</strong> Çokdilli çocuklar daha az dilsel kaygı ve daha yüksek özgüven gösterir. "Bir dilde başarısız oldum, başka dilde deneyebilirim" rutini oluşur.</li>
  <li><strong>Uzun vadeli avantaj:</strong> 8-10 yaşta resmî İngilizce eğitimine başlayan çocuklarla anaokulunda maruziyet alanlar karşılaştırıldığında, ikinci grup başlangıç kaygısı açısından daha düşük seviyede başlar.</li>
</ul>

<h2>Türk Ailelerin Yaygın Endişesi: Türkçeye Etkisi</h2>
<p>"4 yaşta İngilizceye başlarsak Türkçesi etkilenir mi?" sorusu son derece yaygındır. Bilimin cevabı net: <strong>hayır, etkilenmez.</strong> Cummins'in Interdependence Hypothesis'i şunu gösterir: çocuk bir dilde güçlü temel oluşturursa, bu temel diğer dile <em>transfer</em> olur. Türkçe okuryazarlık temeli güçlüyse, İngilizce okuryazarlığa geçiş hızlanır.</p>
<p>Tek koşul: <strong>anadili maruziyetinin korunması.</strong> Evde Türkçe kitap okuma, masal anlatma, sohbet etme rutinleri sürdüğü sürece çift dillilik kazanım, kayıp değildir.</p>

<h2>Evde Pratik Uygulama: Maruziyet Dozajı</h2>
<p>Araştırmalar, haftada sadece 10-15 saatlik İngilizce maruziyetinin bile 4-6 yaş çocukta belirgin dilsel ilerleme sağladığını gösterir. Bu, özel okul kadar yoğun değildir; gündelik evde dinleme ve oyun yoluyla sağlanabilir.</p>
<p>Somut örnek: Ayşe Hanım, 5 yaşındaki oğluna her sabah duş sırasında İngilizce şarkı çalar (10 dakika). 8 hafta sonunda çocuk 30+ sözcüğü anlamaya ve 10+ sözcüğü söylemeye başlamıştır. Hiçbir özel okula gitmemiştir — sadece düzenli maruziyet.</p>

<h2>Kritik Dönem: Neden 7 Yaştan Sonra Daha Zor?</h2>
<p>7 yaştan sonra beyin "dil öğrenme modundan" "dil analiz moduna" geçer. Yani:</p>
<ol>
  <li>Gramer kuralları bilinçli olarak öğrenilir.</li>
  <li>Telaffuz farklı kalabilir; beyin anadildeki "referans" telaffuza göre yabancı sesleri yorumlamaya devam eder.</li>
  <li>Maruziyetten üretime (speaking) geçiş daha yavaş olur.</li>
</ol>
<p>VanPatten ve Benati (2010), input processing teorisinde, yaşlı çocukların eksik girdiyi (mesela -s ekini atlayan bir cümle) gramer kuralıyla tamamladıklarını, küçük çocukların ise sadece maruziyet artınca o eksiği fark ettiklerini göstermiştir. Yani küçük çocuk dili "çözümlemez", "soluyor".</p>

<h2>Motivasyon Faktörü: Korku Yokluğu</h2>
<p>4-6 yaş çocuk İngilizceyi "zorunlu ders" olarak görmez. Oyun ve eğlence şeklinde sunulursa iç motivasyon doğal olarak oluşur. 7-8 yaşında ise "sınav", "not", "başarısızlık" kavramları girer ve hata yapma korkusu başlar.</p>
<p>Nöropsikolojik açıdan, 4-6 yaşta beyin "başarısız olmak"a değil "denemek"e odaklanır. Bir dili hatalı söylerse çocuk kendini cezalandırmaz — bir oyun olarak tekrar dener. Bu, dil ediniminde paha biçilmez bir avantajdır.</p>

<h2>Pratik Sonuç: Evde Başlama Kararı</h2>
<p>Bilim açıkça gösterir ki 4-6 yaş aralığında İngilizceye başlamak, çocuğunuzun dilsel gelişimi, akademik başarısı ve özgüveni için belirgin avantajdır. Bunun için pahalı özel okul gerekmez. Günlük 15-20 dakika kaliteli maruziyet (şarkı, hikâye, oyun) — herhangi bir baskı olmadan — yeterlidir.</p>
<p>Evde başlayacaksanız temel ilke şudur: <strong>eğlence öncelikli, maruziyet düzenli, hata serbest.</strong> Geri kalanı beyin halleder.</p>`,
  },
  {
    slug: 'evde-15-dakikalik-ingilizce-rutini-1-aylik-plan',
    title: 'Evde 15 Dakikalık İngilizce Rutini: 1 Aylık Plan',
    excerpt: 'Ayda dört hafta, günde 15 dakika İngilizce çalışması için hazır plan. Hafta hafta etkinlikler, şarkılar, oyunlar. Hemen başlayın.',
    meta_description: 'Günlük 15 dakika İngilizce rutini. 4 haftalık yol haritası, etkinlikler, şarkılar, oyunlar. Çocuğunuzla bu hafta uygulayın.',
    keywords: ['günlük İngilizce rutini', 'evde İngilizce', '4 haftalık plan', 'aile etkinlikleri'],
    category: 'teaching-english-to-kids',
    reading_time_min: 6,
    published_at: '2026-05-16T14:00:00Z',
    content_html: `<h2>Neden 15 Dakika?</h2>
<p>4-7 yaş çocuğun konsantrasyon süresi araştırmalara göre 12-18 dakika arasında değişir. 15 dakika hem yeterli maruziyeti sağlar hem çocuğun yorulup hayal kırıklığı yaşamadan "bitirilebilecek" ideal süredir. Daha uzun seanslar çocuğu yorar ve İngilizceye karşı olumsuz çağrışım yaratır.</p>
<p>Bu rehber 4-6 yaş çocuklar için tasarlanmıştır. Her hafta farklı bir tema (renkler, hayvanlar, yiyecekler, karma) takip edilecek. Böylelikle çocuğunuz günde 10-15 yeni İngilizce kelimeyle karşılaşacak.</p>

<h2>Hafta 1: Renkler ve Selamlaşmalar</h2>
<p><strong>Tema sözcükleri:</strong> Red, blue, green, yellow, hello, goodbye, thank you, please.</p>

<h3>Pazartesi — Renk Tanıtım Günü</h3>
<ul>
  <li><strong>0-2 dk:</strong> Selamlaşma. "Hello! How are you? I'm happy." gibi basit cümlelerle başla.</li>
  <li><strong>2-8 dk:</strong> Renk oyunu. Evinizdeki renkli nesneleri bulun. "What color is this?" diye sor. Çocuk cevap vermeseniz bile sen "It's red" deyin.</li>
  <li><strong>8-13 dk:</strong> Renk şarkısı. YouTube'dan "Rainbow Colors Song" (Cocomelon versiyonu) açın, birlikte söyleyin.</li>
  <li><strong>13-15 dk:</strong> Kapanış. "Goodbye!" deyin, çocuğu sarıl.</li>
</ul>
<p><strong>Önemli:</strong> İlk günde çocuk hiç konuşmayabilir. Bu "sessiz dönem" (silent period) tamamen normaldir — Krashen Input Hypothesis çerçevesinde beklenen aşamadır. Sadece maruziyeti sürdürün.</p>

<h3>Salı — Renk Eşleştirme</h3>
<ul>
  <li><strong>0-2 dk:</strong> Selamlaşma + Pazartesi sözcüklerinin tekrarı ("Can you show me blue?").</li>
  <li><strong>2-10 dk:</strong> Renk kartları. Renkli kartlar gösterin, çocuk "Red!", "Blue!" diye çağırsın. Yanılırsa düzeltmek yerine doğrusunu söyleyip devam edin.</li>
  <li><strong>10-15 dk:</strong> "I Spy" oyunu. "I spy with my little eye something... red." Çocuk kırmızı bir nesne bulsun.</li>
</ul>

<h3>Çarşamba — Mikrofon Oyunu</h3>
<ul>
  <li><strong>0-2 dk:</strong> Selamlaşma.</li>
  <li><strong>2-12 dk:</strong> Kağıttan yapılmış basit bir "mikrofon" kullanın. "Sing with me!" deyin, renk şarkısını birlikte söyleyin. Çocuğu özel hissettirin.</li>
  <li><strong>12-15 dk:</strong> "Thank you" ve "Goodbye" pratisi. "Thank you for singing!" deyin.</li>
</ul>

<h3>Perşembe — Hareketli Renk Oyunu</h3>
<ul>
  <li><strong>0-2 dk:</strong> Selamlaşma.</li>
  <li><strong>2-12 dk:</strong> "Simon Says" oyunu. "Touch something blue!" diye komut verin. Çocuk dokunup "Blue!" desin.</li>
  <li><strong>12-15 dk:</strong> Çocuk boş bir sayfaya "favorite color" (en sevdiği renk) çizsin ve İngilizce söylesin.</li>
</ul>

<h3>Cuma–Pazar — Tekrar ve Oyun</h3>
<ul>
  <li><strong>Cuma:</strong> Haftanın tüm sözcüklerini "Color Hunt" oyunuyla tekrar — "Find 5 red things!".</li>
  <li><strong>Cumartesi:</strong> Çizim ve şarkı. Çocuk kendi renkli çizimini yapsın ve "I like red!" desin.</li>
  <li><strong>Pazar:</strong> Rahat gün. İsterse baştan başlayın, ya da dış mekândaki oyun sırasında İngilizce kelimeler kullanın.</li>
</ul>

<h2>Hafta 2: Hayvanlar</h2>
<p><strong>Tema sözcükleri:</strong> Dog, cat, bird, fish, lion, cow, duck. Ek: big, small, fast, slow.</p>
<ul>
  <li><strong>Başlangıç:</strong> "Can you make a dog sound?" (köpek sesi çıkarma) ile eğlence başlatın.</li>
  <li><strong>Orta bölüm:</strong> Hayvan resimleri gösterin, ses yapın ("Meow for cat!"), çocuk tekrar etsin.</li>
  <li><strong>Şarkı:</strong> "Old MacDonald Had a Farm" — birlikte dinleyin.</li>
  <li><strong>Oyun:</strong> Pantomim — siz hayvan rolünü yapın (eğilip yükselen), çocuk tahmin etsin: "Is it a... dog?"</li>
  <li><strong>Kapanış:</strong> "Which animal do you like best?"</li>
</ul>

<h2>Hafta 3: Yiyecekler</h2>
<p><strong>Tema sözcükleri:</strong> Apple, banana, orange, bread, milk, water. Ek: I like, I don't like, yummy, hungry.</p>
<p>Gerçek yiyeceklerle öğrenme en etkilidir.</p>
<ul>
  <li><strong>Pazartesi:</strong> "Let's taste!" Meyveler koyup "Apple! Yummy!" deyin. Çocuk taklit etsin.</li>
  <li><strong>Salı:</strong> Yiyecek resimleri oyunu. "Do you like apples?" sorusunu sorun.</li>
  <li><strong>Çarşamba:</strong> "Taste and Talk." Gerçek bir elma veya muz yiyin: "Mmm, apple is yummy!"</li>
  <li><strong>Perşembe-Pazar:</strong> Haftanın rutinini tekrarlayın. Yemek saatlerinde "Please" ve "Thank you"yu doğal olarak kullanın.</li>
</ul>

<h2>Hafta 4: Mikro Konuşmalar ve Birleştirme</h2>
<p>Dördüncü haftada önceki haftaların tüm sözcüklerini bir araya getirin ve çocuğun bağlantılı cümleler kurmasına fırsat verin.</p>
<h3>Örnek Diyaloglar</h3>
<p><strong>Siz:</strong> "Hello! What's your name?"<br><strong>Çocuk:</strong> (ilk haftalarda dinler; sonra) "I'm [Ad]."</p>
<p><strong>Siz:</strong> "What's your favorite color?"<br><strong>Çocuk:</strong> "Blue." veya gelişmişse "I like blue."</p>
<p><strong>Siz:</strong> "Do you like dogs?"<br><strong>Çocuk:</strong> "Yes!" veya "I like dogs. Dogs are big."</p>

<h2>Her Hafta için Ek İpuçları</h2>
<h3>Şarkı Önerileri (YouTube Arama)</h3>
<ul>
  <li>"Colors Song for Kids" — Cocomelon</li>
  <li>"Old MacDonald Had a Farm" — Cocomelon</li>
  <li>"Twinkle Twinkle Little Star" — Cocomelon</li>
  <li>"Finger Family" — Little Baby Bum</li>
  <li>"Head Shoulders Knees and Toes" — Super Simple Songs</li>
</ul>

<h3>Oyun Şablonları (Haftada 3-4 kez kullanın)</h3>
<ol>
  <li><strong>Simon Says:</strong> "Simon says touch blue!"</li>
  <li><strong>I Spy:</strong> "I spy with my little eye something... red."</li>
  <li><strong>Matching:</strong> Kartları karıştırın, çocuk eşleştirsin.</li>
  <li><strong>Rhyming:</strong> Basit kafiyeler (cat/bat, dog/log) söyleyin, çocuk bulduğu sözcükleri eklesin.</li>
</ol>

<h3>Motivasyon Stratejileri</h3>
<ul>
  <li><strong>Sticker sistemi:</strong> Günü yapılan kutuya sticker yapıştırma. Haftada 5 sticker = küçük ödül.</li>
  <li><strong>İlerleme tablosu:</strong> Duvarda basit bir tablo. Her yeni sözcüğü doğru söylediğinde işaret koyun.</li>
  <li><strong>Rol değişimi:</strong> "You're the teacher!" diyerek çocuğa öğretmen rolü verin. Çocuk size öğretsin.</li>
</ul>

<h2>Pratik İlerleme Beklentileri</h2>
<p><strong>1. Hafta sonu:</strong> Renkler 7-8 sözcüğünü tanırsa başarılıdır. Konuşmayabilir.</p>
<p><strong>2. Hafta sonu:</strong> Hayvan sesleri ve resimler tanınmalı. Belki 2-3 sözcük söylüyor.</p>
<p><strong>3. Hafta sonu:</strong> "I like apple" gibi basit cümleler söylemeye başlayabilir.</p>
<p><strong>4. Hafta sonu:</strong> Önceki haftaların kavramlarını bir araya getirerek "I like red apples" gibi cümleler kurabilir.</p>

<h2>Birinci Ay Sonrası</h2>
<p>Birinci ay bittikten sonra ikinci ayda yeni temalar (meslekler, vücut parçaları, ev eşyaları) başlatın. Önceki ayların sözcüklerini ise gündelik konuşmaya doğal olarak serpiştirin ("Which color is your shirt?", "Do you want a banana?").</p>
<p>Dördüncü aydan sonra basit İngilizce çizgi filmler (Peppa Pig, Daniel Tiger) 10-15 dakika izletmeye başlayabilirsiniz. Yazı becerisi henüz beklenmemeli ama dinleme alışkanlığı güçlenir.</p>

<h2>Sonuç</h2>
<p>15 dakikalık günlük rutin tutarlılıkla 4 ay içinde çocuğunuzun <strong>receptive vocabulary</strong>'sini (anlama sözcüğü) 80-100 sözcüğe çıkarır. Üretim (speaking) daha yavaş gelişecek — bu normal. Sabır ve eğlence başarının anahtarıdır.</p>`,
  },
  {
    slug: 'cefr-a1-seviyesi-cocuk-kelime-listesi',
    title: 'CEFR A1 Seviyesi Nedir? Çocuğunuz Hangi Kelimeleri Bilmeli?',
    excerpt: 'CEFR sistemi, A1 yetkinlik haritası, çocuklar için 500-700 kelimelik liste. Çocuğunuzun seviyesini kontrol edin.',
    meta_description: 'CEFR A1 seviyesi nedir? Çocuklar için 500-700 kelime listesi, yetkinlik kontrolü, yaşa göre beklentiler.',
    keywords: ['CEFR A1', 'kelime listesi', 'dil yeterliği', 'A1 sertifika'],
    category: 'teaching-english-to-kids',
    reading_time_min: 8,
    published_at: '2026-05-08T09:30:00Z',
    content_html: `<h2>CEFR Nedir?</h2>
<p>CEFR (Common European Framework of Reference for Languages — Avrupa Dil Öğretimi Ortak Çerçeve Programı), Avrupa Konseyi tarafından 2001'de yayımlanan ve tüm dünyada kabul edilen dil seviye sistemidir. Türkiye'de İngilizce kursları, üniversiteler ve YÖKDİL gibi sınavlar bu sisteme göre seviyelendirilir.</p>
<p>Seviyeler şu şekildedir:</p>
<ul>
  <li><strong>A1 (Elementary / Başlangıç):</strong> Günlük temel ifadeler</li>
  <li><strong>A2 (Elementary+):</strong> Basit cümleler, kendini tanıtma</li>
  <li><strong>B1 (Intermediate):</strong> Sohbete katılma, yazılı metin anlama</li>
  <li><strong>B2 (Upper-Intermediate):</strong> Akademik konular, ayrıntılı konuşma</li>
  <li><strong>C1 (Advanced):</strong> Yaratıcı yazı, ileri tartışma</li>
  <li><strong>C2 (Mastery):</strong> Anadil konuşucusuna yakın seviye</li>
</ul>
<p><strong>Çocuklar için:</strong> Anaokulu ve 1-2. sınıflar genellikle A1 hedefler. 3-4. sınıf A1-A2 aralığında ilerler. 5. sınıf sonuna doğru bazı öğrenciler B1'e geçer.</p>

<h2>A1 Seviyesinde Beklenen Yetkinlikler</h2>
<p>CEFR'e göre A1 seviyesindeki bir öğrenci:</p>
<ul>
  <li><strong>Dinleme/Okuma:</strong> Çok basit, yavaş konuşulan cümleleri anlar. "Hello", "What's your name?", "I like apples" gibi.</li>
  <li><strong>Konuşma:</strong> Çok kısa cümleler, basit sorulara cevap verir: "My name is...", "I have a...", "I like...". Gramer hatalı olsa da iletişimsel olarak anlaşılır.</li>
  <li><strong>Yazı:</strong> Temel kelimeleri yazar, boşluk doldurmada başarılıdır, basit 3-5 cümlelik açıklamalar yapabilir.</li>
  <li><strong>Sosyal etkileşim:</strong> Selamlaşma, teşekkür, basit soruları sorabilir.</li>
</ul>

<h2>A1 Kelime Hazinesi: Çekirdek 200 Sözcük</h2>
<p>CEFR resmi referansı A1 için 500-700 sözcük önerir. Aşağıda kritik 200 sözcüğün kategorize listesi bulunmaktadır.</p>

<h3>Selamlaşma ve Yaşam (15)</h3>
<p>hello, goodbye, please, thank you, yes, no, I, you, he, she, it, name, age, sorry, fine.</p>

<h3>Vücut Parçaları (10)</h3>
<p>head, eye, nose, mouth, ear, hand, arm, leg, foot, hair.</p>

<h3>Renkler (10)</h3>
<p>red, blue, green, yellow, orange, purple, pink, black, white, brown.</p>

<h3>Sayılar (11)</h3>
<p>zero, one, two, three, four, five, six, seven, eight, nine, ten.</p>

<h3>Beslenme (25)</h3>
<p>apple, banana, orange, bread, milk, water, egg, rice, fish, meat, chicken, pizza, cake, chocolate, tea, coffee, juice, soup, salt, sugar, plate, cup, spoon, fork, knife.</p>

<h3>Hayvanlar (20)</h3>
<p>dog, cat, bird, fish, lion, cow, duck, pig, horse, elephant, snake, spider, butterfly, bee, frog, rabbit, mouse, sheep, monkey, tiger.</p>

<h3>Aile (8)</h3>
<p>mother, father, brother, sister, grandmother, grandfather, son, daughter.</p>

<h3>Ev ve Eşyalar (20)</h3>
<p>house, room, bed, table, chair, door, window, picture, book, pen, pencil, paper, toy, ball, doll, car, bicycle, television, computer, clock.</p>

<h3>Giyim (12)</h3>
<p>shirt, dress, pants, shoes, socks, hat, coat, jacket, skirt, scarf, sweater, gloves.</p>

<h3>Zaman ve Mevsimler (12)</h3>
<p>morning, afternoon, evening, night, day, week, month, year, Monday, spring, summer, winter.</p>

<h3>Fiiller — Temel (30)</h3>
<p>am, is, are, have, go, come, sit, stand, play, sleep, eat, drink, like, want, can, run, jump, walk, swim, fly, sing, dance, write, read, draw, hear, see, give, take, put.</p>

<h3>Sıfatlar — Temel (15)</h3>
<p>big, small, long, short, tall, fat, thin, happy, sad, angry, tired, hot, cold, clean, new.</p>

<h3>Mekânlar (12)</h3>
<p>school, hospital, park, market, zoo, beach, city, street, garden, forest, river, lake.</p>

<h3>Meslekler (10)</h3>
<p>teacher, doctor, nurse, farmer, cook, driver, police, builder, pilot, engineer.</p>

<h2>A1 Kontrol Listesi: Çocuğunuz Neredе?</h2>
<p>Aşağıdaki testleri evde yaparak çocuğunuzun A1 seviyesini değerlendirebilirsiniz:</p>
<ol>
  <li><strong>Vücut parçaları:</strong> "Show me your head / eye / nose." — Çocuk doğru gösterirse geçti.</li>
  <li><strong>Renkler:</strong> 10 renkli nesne gösterin, "What color is this?" sorun. 8+ doğru = geçti.</li>
  <li><strong>Hayvanlar:</strong> 12 hayvan resmi gösterin, isimlendirsin. 10+ doğru = geçti.</li>
  <li><strong>Ev eşyaları:</strong> Evde 10 nesne işaret edin, "What is this?". 8+ doğru = geçti.</li>
  <li><strong>Basit konuşma cümleleri:</strong>
    <ul>
      <li>"What's your name?" → "My name is..."</li>
      <li>"How old are you?" → "I am [4/5/6]."</li>
      <li>"Do you like apples?" → "Yes/No, I like/don't like apples."</li>
      <li>"What's your favorite color?" → "My favorite is blue."</li>
    </ul>
  </li>
  <li><strong>Yazı:</strong> Adını yazabilme, basit 5-6 sözcüğü kopyalayabilme.</li>
</ol>

<h2>Yaşa Göre A1 Tahminleri</h2>
<p><strong>3-4 yaş:</strong> A1'in başında (25-50 sözcük). Dinleme başlangıçta, konuşma çok az.</p>
<p><strong>4-5 yaş:</strong> A1 yarısında (100-200 sözcük). Basit soruları anlar, 5-10 sözcük üretir.</p>
<p><strong>5-6 yaş:</strong> A1 sonuna yakın (200-350 sözcük). Basit cümleler kurmaya başlar.</p>
<p><strong>6-7 yaş:</strong> A1 tam (400-500 sözcük). "My name is..." ve "I like..." rahat.</p>
<p><strong>7-8 yaş:</strong> A1+ veya A2 başı (500-600 sözcük). Basit hikâye anlama, "why" sorularına kısa cevap.</p>
<p>Çocuğunuz bu hedeflerin 2-3 ay gerisindeyse normal. 6+ ay gerideyse maruziyeti artırma kararı verin.</p>

<h2>A1'den A2'ye Geçişin Sinyalleri</h2>
<p>A2'ye hazır olma işaretleri:</p>
<ul>
  <li>Temel cümle kalıplarını (I have, I like, There is) rahat üretiyor.</li>
  <li>Soruları sorabiliyor (What's your name? Where do you live? How old are you?).</li>
  <li>Kişisel bilgiler (ad, yaş, aile) hakkında yazabiliyor.</li>
  <li>15-20 cümlelik basit hikâyeyi anlıyor.</li>
  <li>Telaffuzu anlaşılabilir, anadili konuşucusu olmayan kulağa bile.</li>
</ul>

<h2>Yaygın Hatalar</h2>
<h3>Hata 1: 700 Kelimeyi Aynı Anda Öğretme</h3>
<p>A1 700 sözcük ister ama çocuğun aktif (üretebildiği) sözlüğü 50-100 sözcüktür. Geri kalan 600 "passive vocabulary"dir — anlar ama söylemez. Zorlama yanlış; doğal maruziyet doğru. İlk ay 50 sözcüğe odaklanın. Aylık 50 sözcük ekleyerek 3-4 ayda 200-250'ye ulaşırsınız.</p>

<h3>Hata 2: Sözlük Ezberleme</h3>
<p>"apple" kelimesini 20 kez yazma ve "elma" karşılığını ezberletme çocuğu hızla sıkıyor. Bunun yerine gerçek elma gösterin, "apple" deyin, birlikte yeyin, resim çizin, şarkı söyleyin. Bu çok duyulu (multisensory) yaklaşımdır — beyinde çok daha güçlü bağlantılar oluşturur.</p>

<h2>Sonuç: A1 Kontrolü</h2>
<p>Çocuğunuzun A1 olup olmadığını anlamak için kritik dört kriter:</p>
<ol>
  <li><strong>Dinleme:</strong> Temel komutları anlama ("Sit down", "Open your book").</li>
  <li><strong>Konuşma:</strong> "I like...", "My name is...", "I have a...", "It's a..." kalıplarını üretebilme.</li>
  <li><strong>Yazı:</strong> Ad yazabilme, basit sözcükleri kopyalayabilme.</li>
  <li><strong>Etkileşim:</strong> Basit soruları cevaplayabilme, "Hello/Goodbye/Please/Thank you" kullanabilme.</li>
</ol>
<p>Bu dört kriteri sağlıyorsa çocuğunuz <strong>A1 seviyesinde</strong> sayılabilir. Cambridge Young Learners (Starters) veya Pearson PTE Young Learners sınavlarına da girebilir — ama bu sınavlar zorunlu değildir, sadece seviye dökümantasyonu içindir.</p>`,
  },
  {
    slug: 'ingilizce-korkusu-yenmek-5-ebeveyn-tekniki',
    title: "Çocuğum 'Bilmiyorum' Diyor: İngilizce Korkusunu Yenmek İçin 5 Ebeveyn Tekniği",
    excerpt: 'Dil kaygısı psikolojisi. Hata kabulü, övgü kalibrasyonu, oyun terapisi. Çocuğunuzun kaygısını azaltan 5 doğru yöntem.',
    meta_description: 'İngilizce kaygısı, dil korkusu. Çocuğun güvenini artıran 5 teknik. Hata sözleşmesi, oyun terapisi, çaba ovgüsü.',
    keywords: ['dil kaygısı', 'çocuk anxiety', 'öğrenme korkusu', 'ebeveyn desteği'],
    category: 'teaching-english-to-kids',
    reading_time_min: 7,
    published_at: '2026-05-10T13:20:00Z',
    content_html: `<h2>Neden Çocuklar İngilizceden Korkar?</h2>
<p>Psikolojik araştırmalar "language anxiety" (dil kaygısı) olgusunun 6-8 yaş arası çocuklarda başladığını gösterir. Bu kaygının nedenleri çoktur:</p>
<ol>
  <li><strong>Sosyal değerlendirme başlangıcı:</strong> 6 yaşından sonra çocuk "arkadaşlarım ne düşünür" diye kaygılanmaya başlar. Yanlış telaffuz ederse "hata yaptım, arkadaşlar güldü" korkusu doğar.</li>
  <li><strong>Mükemmeliyetçilik eğilimi:</strong> Okul sınavları başlayınca "doğru olmazsa başarısız olurum" düşüncesine girer.</li>
  <li><strong>Otorite endişesi:</strong> Okulda İngilizce öğretmeni otorite figürü olduğundan, yanlış söylerse "öğretmen kızacak" korkusu oluşur.</li>
  <li><strong>Dil karmaşası:</strong> İngilizce Türkçeden farklı kurallar (fiil çekimi, kelime sırası) içerdiğinden çocuk "çok zor, ben bunu anlayamam" hissine kapılır.</li>
</ol>
<p>Bu kaygıyı yenmek büyük ölçüde ebeveynin elinde — okul tarafı değil. Krashen ve Terrell'in (1983) <em>Affective Filter Hypothesis</em>'ine göre, kaygı düştüğünde dil edinimi belirgin biçimde hızlanır.</p>

<h2>Teknik 1: Hata Sözleşmesi (Error Contract)</h2>
<p><strong>İlke:</strong> Çocuğa açıkça söyleyin: "Hata yapmak, öğrenmenin parçasıdır. Hata yaparsan ben seninle gurur duyarım."</p>
<p>Sakin bir ortamda (akşam, yatmadan önce) çocuğunuza şöyle bir konuşma yapın:</p>
<blockquote>
  <p>"Biliyor musun, ben de İngilizce öğrenirken çok hata yaptım. Bazen arkadaşlarım güldü. Ama ben devam ettim, çünkü 'hata yaparsam, öğreniyorum' demektir. Senin İngilizce öğrenirken hata yapman çok güzel. Çünkü cesur davranıyorsun."</p>
</blockquote>
<p>Sonra ona "sözleşme" yapın:</p>
<ul>
  <li>"Eğer yanlış söylersen, ben seni düzeltmem. Sadece doğrusunu söylerim."</li>
  <li>"Eğer 'bilmiyorum' dersen, sana ipucu veririm. Ama denemekten korkma."</li>
  <li>"Her gün bir İngilizce kelime denersen, gurur duyarım. Cesur davranıyorsun."</li>
</ul>

<h2>Teknik 2: Oyun Terapisi Yaklaşımı (Play Therapy)</h2>
<p><strong>İlke:</strong> İngilizceyi "ders" değil "oyun" olarak sunun.</p>
<p>Örnek senaryolar:</p>
<ol>
  <li><strong>Öğretmen Oyunu:</strong> Çocuk sizin öğretmeniniz olsun. "Öğretmenim, merhaba! What is your name?" Çocuk, oyun rolünde olduğu için baskı hissetmez. Üstelik öğretmen rolü, kontrol hissi vererek özgüven kazandırır.</li>
  <li><strong>Restoran Oyunu:</strong> Çocuk garson, siz müşteri. "What would you like?" / "A pizza, please." Çocuk yanlış söylese bile oyun içinde devam eder.</li>
  <li><strong>Hastane Oyunu:</strong> Çocuk doktor, siz hasta. "Where does it hurt?" / "My head." İngilizce karakter içinde doğal akış kazanır.</li>
  <li><strong>Mağaza Oyunu:</strong> Renkli nesnelerle alışveriş. "I want a red ball, please." / "Here you go."</li>
</ol>
<p><strong>Sonuç:</strong> Oyunlar performans baskısı hissini kaldırır. Oyun modu = kaygı modu kapalı.</p>

<h2>Teknik 3: Övgü Kalibrasyonu (Calibrated Praise)</h2>
<p><strong>İlke:</strong> Çocuğu övmek iyi, fakat yanlış övgü motivasyonu bozar.</p>

<h3>Yanlış övgü ("yetenek ovgüsü"):</h3>
<ul>
  <li>"Aman ne kadar zekisin!" (Her küçük harekette)</li>
  <li>"Sen bir dahisin!" (Doğal sonuçlara büyük tepki)</li>
</ul>
<p>Bu tip övgü çocuğu "ben doğru cevap verince iyi"yim düşüncesine götürür. Hata yaptığında özsaygısı çöker ("Demek ki ben aslında zeki değilim").</p>

<h3>Doğru övgü ("çaba ovgüsü"):</h3>
<ul>
  <li>"Cesur ettin, söylemeye çalıştın. Bu çok güzel." (Çaba, sonuç değil)</li>
  <li>"Hatalı da olsa tekrar denedin. Bu kararlılık." (Persistans ovgüsü)</li>
  <li>"Daha önce bilmiyordun, şimdi biliyorsun. Çok çalıştığın belli." (Büyüme/growth mindset)</li>
</ul>
<p><strong>Kanıt:</strong> Carol Dweck'in (2006) Growth Mindset araştırması, çaba odaklı övgü alanların zorlukla karşılaştığında daha dayanıklı olduğunu ve uzun vadede daha başarılı olduğunu göstermiştir.</p>

<h2>Teknik 4: Modelleme (Hata Yaptığınızı Gösterme)</h2>
<p><strong>İlke:</strong> Çocuğa siz de hata yaptığınızı gösterin, sonra düzeltin.</p>
<p>Günlük konuşmada bilinçli hata yapın:</p>
<ul>
  <li>"The cats is sleeping... wait, sorry — the cat IS sleeping. Or the cats ARE sleeping."</li>
  <li>"Did I make a mistake? Can you fix it?"</li>
</ul>
<p>Çocuğa "evet, hata yaptın" diye söyletmek bile yetişkinin de hata yapabildiğini gösterir. Hata, utanç nedeni değil düzeltme fırsatıdır mesajını verir.</p>

<h2>Teknik 5: Sessiz Dönemi Kabul Etme</h2>
<p><strong>İlke:</strong> Çocuğunuz haftalarca "bilmiyorum" diyor olabilir. Bu normaldir. Krashen Input Hypothesis'inde "Silent Period" (Sessiz Dönem) denilen aşamadır.</p>
<p>Bu dönemde çocuk:</p>
<ul>
  <li>Dile maruz kalır.</li>
  <li>Kafasında işler.</li>
  <li>Konuşmaz.</li>
  <li>Birden, çoğu zaman aniden, konuşmaya başlar.</li>
</ul>
<p>Uygulama:</p>
<ul>
  <li>İlk 2-3 hafta çocuk sessiz kalsa da maruziyeti kesmeyin.</li>
  <li>"Söyle" demeyin. Sadece "dinle benimle", "bak", "oyna".</li>
  <li>Çocuk hazır olduğunda konuşur. Zorlamayın.</li>
  <li>6 hafta sonra hâlâ sessizse, daha uzun süreyi normal kabul edin. Bazı çocuklar daha yavaştır.</li>
</ul>
<p><strong>Örnek:</strong> Türkiye'deki özel okullara yeni başlayan göçmen çocuklar genellikle ilk 3-4 hafta Türkçe konuşmaz. Fakat 2. ayında aniden konuşmaya başlar ve hızla ilerler. "Sessiz dönem" = içsel işleme zamanıdır.</p>

<h2>Spesifik Davranış Sorunları</h2>
<p><strong>Problem 1:</strong> Çocuk her soruya "Bilmiyorum" diyor.<br>
<strong>Çözüm:</strong> "Tahmin et" deyin. "Başta 'aaa' söyle, sonra biraz Türkçe ekle." Tahmin yapması susmaktan çok daha değerlidir.</p>

<p><strong>Problem 2:</strong> Okulda dili tutuluyor, evde rahat.<br>
<strong>Çözüm:</strong> Evde özgüven inşa etmeye devam edin. Sınıfta konuşma cesareti, evdeki başarıdan beslenir.</p>

<p><strong>Problem 3:</strong> Öğretmen sınıfta yüksek sesle düzeltince utanıyor.<br>
<strong>Çözüm:</strong> Eğer mümkünse öğretmenle konuşun ve düzeltme tarzının nazikleştirilmesini rica edin. Evde ise her hata bir öğrenme fırsatı olarak çerçevelenebilir.</p>

<h2>Sonuç: 5 Tekniğin Özeti</h2>
<ol>
  <li><strong>Hata Sözleşmesi:</strong> "Hata = öğrenme" sözleşmesi yapın.</li>
  <li><strong>Oyun Terapisi:</strong> İngilizceyi oyun haline getirin.</li>
  <li><strong>Çaba Bazlı Övgü:</strong> "Çok zekisin" yerine "çok çalıştın" deyin.</li>
  <li><strong>Modelleme:</strong> Siz de hata yapın, çocuğa normal olduğunu gösterin.</li>
  <li><strong>Sessiz Dönemi Kabul:</strong> Konuşana kadar zorlamayın, sabırla maruziyete devam edin.</li>
</ol>
<p>Bu beş teknik, Krashen-Terrell Affective Filter Hypothesis ile Dweck'in Growth Mindset çalışmasının ortak özetidir. Kaygı azalınca dil edinimi 2-3 kat hızlanır. İngilizce öğrenimi büyük ölçüde ebeveynin kararıyla başlar: baskı değil, destek.</p>`,
  },
  {
    slug: 'phonics-turkce-cocuga-ingilizce-telaffuz',
    title: 'Phonics Nedir? Türk Çocuğuna Doğal İngilizce Telaffuz Nasıl Kazandırılır?',
    excerpt: 'Synthetic Phonics yöntemi. Türkçe ve İngilizce telaffuz farkları. Türk çocuğu için 10 haftalık pratik phonics planı.',
    meta_description: 'Phonics nedir? Synthetic phonics sistemi. Türk çocuğuna İngilizce telaffuz öğretme. Pratik harf-ses egzersizleri.',
    keywords: ['phonics', 'İngilizce telaffuz', 'harf-ses', 'synthetic phonics'],
    category: 'teaching-english-to-kids',
    reading_time_min: 8,
    published_at: '2026-05-14T11:15:00Z',
    content_html: `<h2>Phonics Nedir?</h2>
<p>Phonics, okuma öğretiminde <strong>harf-ses eşleştirmesi</strong> metodolojisidir. Basit anlatımla: çocuk harfleri değil, "harfin hangi sesi çıkardığını" öğrenir. İngilizce, Türkçe gibi fonetik (her harf = aynı ses) bir dil değildir. Örneğin "c" harfi "cat"ta /k/, "city"de /s/ sesini çıkarır. Phonics, bu kuralları sistematik biçimde öğretir.</p>
<p><strong>Türkçe ile fark:</strong> Türkçe büyük ölçüde fonetiktir; harflerin sesi neredeyse her zaman aynıdır. Çocuk harf-sesi eşleştirdiğinde okumayı öğrenmiş olur. İngilizcede bu kural geçerli değildir. Örneğin "read" yazısı, geçmiş zamanda /red/, geniş zamanda /riːd/ okunur. Phonics, bu karmaşıklığın yapılandırılmış öğretim sistemidir.</p>

<h2>Synthetic Phonics Yöntemi</h2>
<p>Günümüzde İngiltere ve ABD'deki çoğu okul "Synthetic Phonics" yöntemini kullanır. Harfleri ayrı ayrı değil, belirli sırada ve kombinasyonlarla öğretir.</p>

<h3>Aşamalar</h3>
<ol>
  <li><strong>Phase 1 (Ses Ayırma):</strong> Yazı henüz yok. Sadece çevreden gelen sesleri ayırt etmek — kapı sesi, kuş ötüşü vs. (4-5 yaş)</li>
  <li><strong>Phase 2-3 (Temel harfler):</strong> En sık kullanılan harfler ve sesleri — s, a, t, p, i, n, m, d... (4-5 yaş)</li>
  <li><strong>Phase 4-5 (Digraphs):</strong> İki harf, tek ses — sh, ch, th, ng. (5-6 yaş)</li>
  <li><strong>Phase 5 (Alternatif sesler):</strong> "a" sesi "ai", "ay", "a_e" kombinasyonlarıyla farklı çıkabilir. (6 yaş)</li>
</ol>

<h2>Türkçe ile İngilizce Telaffuz Farkları</h2>
<p>Türk çocuğunun en zorlandığı dört ses:</p>

<h3>1. "th" Sesi</h3>
<p><strong>Sorun:</strong> Türkçede /θ/ veya /ð/ sesi yoktur. Çocuk bunu /s/ veya /t/ olarak algılar ve telaffuz eder ("the" /ðə/ → "de").</p>
<p><strong>Çözüm:</strong> Dil ucunu üst ve alt dişler arasına koyarak yavaşça /θ/ sesini çıkarın. Çocuğa "dişlerini hafifçe ısırır gibi yap, dil ucunu dışarıda tut" diye gösterin. Pratik: "Th-th-th, this, that, the." Haftada 3 kez, 1 dakika yeterli.</p>

<h3>2. "r" Sesi</h3>
<p><strong>Sorun:</strong> Türkçe /r/ ön dişlerin arkasındaki bir titreşim. İngilizce /ɹ/ ise arka ağız ve dil kavisinden çıkar. Türk çocuğu genelde "w" gibi telaffuz eder ("red" → "wed").</p>
<p><strong>Çözüm:</strong> "Rrrr" titreşimini vurgulayarak söyleyin. "rabbit", "red", "run" gibi r ile başlayan kelimeleri uzatarak söyletin: "rrrrabbit".</p>

<h3>3. "v" vs. "w"</h3>
<p><strong>Sorun:</strong> İngilizce /v/ sesi Türkçede yok. Çocuk "f" veya "w" duyar ("video" → "fidio" veya "widio").</p>
<p><strong>Çözüm:</strong> Alt dudağı üst dişlerle hafifçe ısırarak /v/ sesini çıkarın. "very", "video", "seven" kelimelerini yavaşça söyletin.</p>

<h3>4. Schwa Sesi (/ə/)</h3>
<p><strong>Sorun:</strong> Çoğu İngilizce sözcüğün vurgusuz hecesinde /ə/ vardır ("about" → /əˈbaʊt/, "banana" → /bəˈnɑːnə/). Türk çocuğu bunu tam ünlü gibi telaffuz eder ("a-bout").</p>
<p><strong>Çözüm:</strong> Vurgulu ve vurgusuz heceleri ayırarak söyletin. "əBOUT" şeklinde, BOUT vurgu, ə hafif olsun.</p>

<h2>10 Haftalık Phonics Programı</h2>
<table>
  <thead>
    <tr><th>Hafta</th><th>Hedef</th><th>Pratik</th></tr>
  </thead>
  <tbody>
    <tr><td>1-2</td><td>s, a, t, p, i, n (6 harf)</td><td>20-30 sözcük: sat, sit, sip, at, in, pin, pan, tan...</td></tr>
    <tr><td>3</td><td>m, d, g, o, c, k</td><td>Cat, dog, mom, dad, cup, kick...</td></tr>
    <tr><td>4-5</td><td>r, e, h, u, l, f</td><td>red, hen, run, leg, fun, fish...</td></tr>
    <tr><td>6-7</td><td>Digraphs (ch, sh, th, ng)</td><td>chip, ship, this, ring, sing, thank...</td></tr>
    <tr><td>8-9</td><td>Ünsüz kombinasyonu (br, dr, tr, bl, cl, fl)</td><td>bring, drink, train, black, clip, flag...</td></tr>
    <tr><td>10</td><td>Uzun ünlü kuralları (a_e, i_e, o_e)</td><td>name, time, home, like, cake...</td></tr>
  </tbody>
</table>

<h2>Pratik Egzersizler</h2>
<h3>"Sound Hunt" Oyunu</h3>
<p>Evinizde belirli bir sesle başlayan nesneleri bulun: "We're looking for /s/ sounds — sun, sock, soap, sofa." Çocuk bulduklarını yüksek sesle söylesin.</p>

<h3>"Echo Game"</h3>
<p>Söylediğiniz kelimeyi çocuk tekrarlasın. Önce yavaş, heceli: "/s/ /a/ /t/" — sonra normal: "sat". Bu, kelime üretiminde anahtar olan "ses karıştırma" (blending) becerisini geliştirir.</p>

<h3>3-4 Harfli Kelime Üretimi</h3>
<p>Üç-dört harfli decodable (okunabilir) kelimelerle başlayın. Harfleri ayrı ayrı söyletin: "s-a-t", sonra birleştirin: "sat". Görsel olarak da gösterin.</p>
<p>İlk 20 kelime: sat, cat, bat, mat, pat, rat, sit, bit, fit, hit, kit, pit, dog, hot, lot, pot, big, bag, tag, wag.</p>

<h2>Vurgu ve Tonlama</h2>
<p>Phonics yalnızca harf-ses değildir; vurgu ve tonlama da içerir. İngilizce kelimeler vurgulu hece açısından farklılaşır ("PREsent" — hediye / "preSENT" — sunmak). Türkçe nispeten daha düzgün vurgulu bir dildir.</p>
<p>Çocuğa vurgulu heceyi yüksek sesle, vurgusuz heceyi hafifçe söyleyerek modelleyin. Bu, sadece tek tek sözcükleri değil cümle ritmini de etkiler.</p>

<h2>Beklenmedik Sorunlar</h2>
<h3>Sorun: Uzun Ünlüler</h3>
<p>Türkçe ünlüler tek ses çıkarır. İngilizce ünlülerin hem kısa hem uzun versiyonları var: "bit" /bɪt/ vs. "beat" /biːt/. Çocuk başlarda farkı duymayabilir. Yavaş tekrarlı dinlemeler farkı yerleştirir.</p>

<h3>Sorun: Ünsüz Kombinasyonları</h3>
<p>Türkçe "br", "dr", "tr" gibi kombinasyonları nadiren kullanır. İngilizce "bring", "drink", "tree" yaygındır. Çocuk başlarda "birig" diye telaffuz edebilir. Harf-harf söyletme, sonra hızlı birleştirme yardımcı olur.</p>

<h2>Sonuç</h2>
<p>Phonics, İngilizce okuma ve telaffuzunun temelidir. Türk çocuğu için "th", "r", "v", schwa sesleri en zorlu noktalardır. Eğlenceli, sistemli 10-12 haftalık phonics çalışması, 5-6 yaşındaki çocuğun basit kelime okuma ve doğru telaffuzunda belirgin ilerleme sağlar. Önemli olan günlük 5-10 dakika düzenli pratik; aşırı baskı veya uzun seanslar gerekmez.</p>`,
  },
  {
    slug: 'ingilizce-sarkilarla-kelime-ogretmek-7-teknik',
    title: 'İngilizce Şarkılarla Kelime Öğretmek: 7 Etkili Aile Tekniği',
    excerpt: 'Müzikle dil ediniminin bilimi. Hareket eşleştirme, görsel destek, tekrar şarkıları. Sınıfta ve evde uygulanabilir 7 pratik teknik.',
    meta_description: 'Çocuğunuza İngilizce şarkılarla kelime öğretmek için bilim temelli 7 teknik. Head Shoulders Knees, Twinkle Star, Old MacDonald nasıl kullanılır?',
    keywords: ['şarkıyla İngilizce', 'müzikle dil öğrenme', 'çocuk şarkı teknikleri', 'TPR'],
    category: 'teaching-english-to-kids',
    reading_time_min: 7,
    published_at: '2026-05-12T16:45:00Z',
    content_html: `<h2>Müzik Dil Öğrenimini Neden Hızlandırır?</h2>
<p>Nörobilim, dil ve müzik işlemenin beyinde büyük ölçüde aynı bölgelerde gerçekleştiğini gösteriyor. Aniruddh Patel'in araştırmaları (2010), müziğin ritmi ile konuşmanın prozodisinin (vurgu, tonlama, hız) ortak nöral devrelerden geçtiğini ortaya koyuyor. Pratik sonuç: çocuk "Head, Shoulders, Knees and Toes" şarkısını söylerken sadece sözcükleri değil, cümle kalıbını, akıcılığı ve doğal vurguyu da içselleştiriyor.</p>
<p>Üstelik müzik <strong>hipokampusu</strong> (uzun süreli bellekle ilişkili beyin bölgesi) aktive ediyor. Çocuk, şarkıdan öğrendiği kelimeleri kuru bir liste ezberlemesine kıyasla 3-5 kat daha uzun süre hatırlıyor. Bu, aile için en ekonomik araç anlamına geliyor: 5 dakikalık bir şarkı, 30 dakikalık bir flashcard seansından daha kalıcı.</p>

<h2>Teknik 1: Hareket Eşleştirme (Motion Pairing)</h2>
<p>İlke: Her kelimeye bir vücut hareketi atayın. Çocuk şarkıyı dinlerken hareketi yapıyor; motor hafıza dilsel hafızayı kilitliyor.</p>
<p>Pratik örnek: "Head, Shoulders, Knees and Toes" (1.5 dakika). "Head" denince başını, "shoulders" denince omuzlarını tutsun. İlk 2-3 kez siz gösterin, sonra çocuk taklit etsin. Beş vücut bölümü kelimesi, hareketle birlikte 10 dakikada içselleştirilir.</p>
<p>Bu yaklaşım dilbilimde <em>Total Physical Response (TPR)</em> olarak biliniyor; James Asher'ın 1970'lerden bu yana belgelediği bir yöntem.</p>

<h2>Teknik 2: Görsel + Şarkı Eşleştirmesi</h2>
<p>İlke: Şarkıyı animasyonla birlikte sunun. Çocuk kelime, ses ve görsel anlamı eş zamanlı işliyor (dual coding teorisi — Allan Paivio).</p>
<p>"The Wheels on the Bus" şarkısında "wheels" denince ekranda tekerlek dönüyor. Çocuk doğrudan kelime-nesne eşlemesini yapıyor, Türkçe çeviriye ihtiyaç duymadan.</p>
<p>Uygulama önerisi:</p>
<ul>
  <li>İzlemeden önce kelime kartlarını gösterin: "Look, this is a wheel."</li>
  <li>İlk dinleyişte sessiz izleyin.</li>
  <li>İkinci dinleyişte çocuk söylesin.</li>
</ul>

<h2>Teknik 3: Tekrar Şarkıları</h2>
<p>İlke: Bir kelimeyi 5-10 kez tekrarlayan şarkılar, o kelimeyi kalıcı hale getiriyor.</p>
<p>"Twinkle Twinkle Little Star" şarkısında "star" kelimesi 5 kez geçiyor ("twinkle, twinkle, little star..."). Şarkı boyunca her "star" deyişinde çocuğun bir parmağıyla göğe işaret etmesini isteyin. Şarkı bittiğinde çocuk hem kelimeyi söylüyor hem hareketle gösteriyor — iki kanal birden çalışıyor.</p>

<h2>Teknik 4: Drama ve Rol Oyunu</h2>
<p>İlke: Şarkıdan sonra çocuk rol oynasın. Duyguyu yaşaması, kelimenin bağlamını derinleştiriyor.</p>
<p>"If You're Happy and You Know It" şarkısı duygu kelimeleri için ideal. Şarkı bitince çocuk önce "happy" yüzünü, sonra "sad", "angry", "sleepy" yüzlerini taklit etsin. Yüz ifadesi ve sözcük arasındaki bağ kalıcılaşıyor.</p>

<h2>Teknik 5: Tempo Değişimi</h2>
<p>İlke: Aynı şarkıyı normal, yavaş ve hızlı tempoda dinletmek, çocuğun kulağını farklı telaffuz hızlarına alıştırıyor.</p>
<p>Uygulama:</p>
<ul>
  <li>İlk dinleyiş: normal tempo (YouTube orijinal).</li>
  <li>İkinci dinleyiş: yavaş (YouTube'da 0.75x).</li>
  <li>Üçüncü dinleyiş: hızlı (1.25x).</li>
</ul>
<p>Çocuk hızlı tempoda da kelimeleri tanıyorsa, kelimeyi gerçekten öğrenmiş demektir; pasif tanıma seviyesinden aktif kavrayışa geçmiş demektir.</p>

<h2>Teknik 6: Şarkı + Çizim</h2>
<p>İlke: Şarkı bittikten sonra çocuğa o şarkının ana karakterini ya da nesnesini çizdirmek, görsel-anlamsal bellekte ekstra bir izi sabitliyor.</p>
<p>"Old MacDonald Had a Farm" şarkısından sonra çocuk en sevdiği çiftlik hayvanını çizebilir ve altına İngilizce adını yazabilir. Şarkıyı çizimle birleştirmek, akademik araştırmalarda <em>generative learning</em> olarak geçiyor — çocuğun edindiği bilgiyi yeniden üretmesi, öğrenmeyi katlıyor.</p>

<h2>Teknik 7: Şarkı Mühendisliği — Yeni Sözler Üretme</h2>
<p>İlke: Bilinen bir melodiye yeni sözcüklerle yeni bir şarkı uydurmak, dilsel yaratıcılık ve özgüven inşa ediyor.</p>
<p>Örnek: "Twinkle Twinkle Little Star" melodisini kullanarak çocukla birlikte "Twinkle Twinkle Little Cat" ya da "Twinkle Twinkle Little Apple" söyleyebilirsiniz. Çocuk hem aşinası olduğu bir melodide rahat hissediyor, hem yeni kelimeleri ezberliyor, hem de yaratıcı dilsel keşif yaşıyor.</p>

<h2>Şarkı Kullanırken Yaygın Hatalar</h2>
<h3>Hata 1: Pasif İzleme</h3>
<p>Çocuk şarkıyı 10 kez sadece seyrederse motor ve sözel hafıza beklendiği kadar pekişmez. Çözüm: çocuğu hareket etmeye, söylemeye, taklit etmeye teşvik edin. "Your turn!"</p>

<h3>Hata 2: Tek Şarkıyı Aşırı Tekrarlama</h3>
<p>Aynı şarkı 4-5 haftadan uzun süre günlük tekrarlanırsa çocuk sıkılır ve İngilizce ile olumsuz duygusal bağ kurar. Çözüm: haftada 1-2 yeni şarkı ekleyin, eski şarkıları haftalık değil 10-15 günde bir tekrar gündeme getirin.</p>

<h3>Hata 3: Çeviriye Tutunma</h3>
<p>Her kelimenin Türkçe karşılığını anında söylemek, çocuğun bağlamdan anlam çıkarma becerisini engelliyor. Çözüm: önce görselle, hareketle, mimikle anlatın. Türkçe karşılığı en son seçenek olsun.</p>

<h2>Önerilen 10 Şarkı (Yaş 3-7)</h2>
<ol>
  <li>Head, Shoulders, Knees and Toes — vücut + hareket</li>
  <li>The Wheels on the Bus — araçlar + hareket</li>
  <li>Old MacDonald Had a Farm — hayvanlar + sesler</li>
  <li>If You're Happy and You Know It — duygular</li>
  <li>Twinkle Twinkle Little Star — sakinlik + sayı</li>
  <li>Finger Family — aile üyeleri</li>
  <li>Five Little Monkeys — sayılar + hikâye</li>
  <li>Bingo — alfabe + köpek</li>
  <li>Rainbow Colors Song — renkler</li>
  <li>Days of the Week Song — günler</li>
</ol>
<p>Aileler bu şarkıları YouTube'da Super Simple Songs, Cocomelon, Little Baby Bum gibi <em>kid-safe</em> kanallardan bulabilir. Önemli not: video oynatırken YouTube'un <strong>restricted mode</strong>'unu açın; bu yetişkin içeriği filtreleyen güvenli moddur.</p>

<h2>Bilimsel Referans Notu</h2>
<p>Müziğin dil öğrenimine etkisi üzerine yapılan meta-analizler (Murphey 1990; Engh 2013) tutarlı bir sonuca işaret ediyor: müzikle dile maruz kalan çocuklar, salt dinleme/okuma maruziyetine kıyasla %20-40 daha fazla kelime tutuyor. Bu etki özellikle 4-8 yaş aralığında belirgin. Daha büyük çocuklarda da etki var, fakat farkın büyüklüğü azalıyor.</p>

<h2>Sonuç</h2>
<p>Müzik, çocuğa İngilizce öğretmek için elinizdeki en güçlü ve ekonomik araç. Bilim temelli kullanıldığında — hareketle eşleştirerek, görselle pekiştirerek, tekrar ederek — 4-8 yaş çocuğu 3 ay içinde 100-150 kelimelik aktif bir A1 sözlüğüne ulaşabilir. Tek koşul: tutarlılık. Haftada 5 gün, 10-15 dakika.</p>`,
  },
  {
    slug: 'ilkokul-sinifinda-minesminis-ogretmen-rehberi',
    title: 'minesminis Kaynaklarını Sınıfta Etkin Kullanma — Öğretmen Rehberi',
    excerpt: 'Akıllı tahta entegrasyonu, sınıf yönetimi, çoklu seviye öğrenci, ders planı şablonu. minesminis kaynaklarını maksimum verimle kullanma rehberi.',
    meta_description: 'İlkokul İngilizce öğretmeni için minesminis platformu kullanım rehberi. Akıllı tahta, sınıf yönetimi, çoklu seviye, ders planı.',
    keywords: ['öğretmen rehberi', 'sınıf yönetimi', 'akıllı tahta İngilizce', 'ders planı'],
    category: 'teacher-resources',
    reading_time_min: 8,
    published_at: '2026-05-15T10:00:00Z',
    content_html: `<h2>Bu Rehber Kimin İçin?</h2>
<p>Türkiye'de devlet ve özel ilkokullarda 1-4. sınıf İngilizce dersi veren öğretmenler için. minesminis ücretsiz, kayıtsız ve Maarif Modeli ile uyumlu olduğundan, sınıf kullanımına özel olarak tasarlandı. Bu rehberde aktif sınıf deneyimine dayalı uygulamalar paylaşıyoruz.</p>

<h2>Senaryo 1: Akıllı Tahta ile Tüm Sınıf Etkinliği</h2>
<p>Kurulum (3 dakika):</p>
<ul>
  <li>minesminis.com adresini akıllı tahtaya açın.</li>
  <li>Ses çıkışını kontrol edin (özellikle şarkı/video kullanacaksanız).</li>
  <li>Ders öncesi açıkça bir <em>focus question</em> tahtaya yazın: "Bugün 3 renk öğreneceğiz. Hangileri olabilir?"</li>
</ul>
<p>15 dakikalık akış:</p>
<ol>
  <li><strong>Giriş (2 dk):</strong> Dersin hedefini Türkçe söyleyin, ardından İngilizce tekrar edin. Çocukların beklentisi şekillenir.</li>
  <li><strong>Sunum (5 dk):</strong> minesminis'in renk sunumunu akıllı tahtada gösterin. Çocuklar sessiz takip etsin.</li>
  <li><strong>Etkileşim (3 dk):</strong> "What color is this?" diye sorun. Eli kaldıran çocuğu çağırın; Türkçe cevap verirse "In English!" diye yönlendirin.</li>
  <li><strong>Pekiştirme oyunu (5 dk):</strong> "Color Hunt": "Find something red!" diyerek çocukları sınıfta kırmızı bir nesne bulmaya yönlendirin.</li>
</ol>

<h2>Senaryo 2: Bilgisayar Laboratuvarı / Tablet Sınıfı</h2>
<p>Eğer her öğrencinin kendi cihazı varsa minesminis'e bireysel erişim daha verimli olur. 40 dakikalık ders yapısı:</p>
<ol>
  <li><strong>Açılış (5 dk):</strong> Ders hedefini tahtada paylaşın.</li>
  <li><strong>Bireysel öğrenme (20 dk):</strong> Her öğrenci kendi temposunda ilgili sunumu açar, slaytları gezer, çalışma kâğıdını indirir. Öğretmen sınıfta dolaşarak bireysel destek verir.</li>
  <li><strong>Grup paylaşımı (10 dk):</strong> "Hangi 5 yeni kelime öğrendin?" sorusunu çocuklara yöneltin. Tahtaya yazın.</li>
  <li><strong>Kapanış (5 dk):</strong> Ev ödevi: çalışma kâğıdını çıktı alıp boyayarak doldur.</li>
</ol>

<h2>Çoklu Seviye Yönetimi</h2>
<p>Aynı sınıfta farklı dil seviyesindeki öğrenciler için minesminis ideal — herkes kendi temposunda ilerleyebilir.</p>
<ul>
  <li><strong>Hazırlık grubu (hiç bilmeyenler):</strong> Sadece sunum ve şarkı. Yazılı pratik yok.</li>
  <li><strong>A1 grubu (temel):</strong> Sunum + şarkı + çalışma kâğıdı. "I have a..." kalıbıyla cümle kurma.</li>
  <li><strong>A1+ grubu (ilerlemiş):</strong> Hepsi + extension task: "Çiftlikteki hayvanları kullanarak kısa bir hikâye yaz." (3-4 cümle.)</li>
</ul>
<p>Bu yaklaşım, eğitim biliminde <em>differentiated instruction</em> olarak geçiyor; aynı sınıfta farklı seviyeleri yönetmek için en yaygın evidence-based stratejilerden biri.</p>

<h2>Senaryo 3: Flipped Classroom (Ters Yüz Sınıf)</h2>
<p>Eğer öğrencilerin evde internet erişimi varsa, ters yüz modeli en verimlidir.</p>
<p>Pazartesi (ev): Çocuk minesminis'teki yeni sunumu evde izler.</p>
<p>Salı (sınıf): Öğretmen içeriği yüzeysel geçer ve doğrudan uygulamaya geçer — rol yapma, soru-cevap, oyun. Ders zamanının %80'i aktif öğrenmeye ayrılır, sadece %20'si pasif sunuma.</p>
<p>Sonuç: aynı hedef için %50 daha az ders zamanı, %40 daha yüksek aktif katılım.</p>

<h2>Sınıf Davranış Stratejileri</h2>
<h3>Problem 1: Video sırasında konuşan öğrenciler</h3>
<p>Çözüm: "Quiet fingers" işareti tanıtın (parmak dudakta). Video başlamadan önce "When the video starts, voices are zero" deyin. Tutarlı uygulayın — ilk hafta uyumayan çocuklar 2. hafta uyum sağlar.</p>

<h3>Problem 2: Hızlı bitiren ve sıkılan öğrenciler</h3>
<p>Çözüm: Hazırlıklı bir "fast finisher" görevi olsun. Örnek: "Draw your own animal and label it in English."</p>

<h3>Problem 3: Geride kalan öğrenci</h3>
<p>Çözüm: "Buddy system" — daha hızlı öğrenciyle çift yapın. Birlikte çalışsınlar. "You're a team, help each other."</p>

<h2>4 Haftalık Tema Şablonu</h2>
<p>Tema: <strong>Animals (Hayvanlar)</strong></p>
<table border="1" cellpadding="8">
  <thead><tr><th>Gün</th><th>Etkinlik</th><th>Süre</th></tr></thead>
  <tbody>
    <tr><td>Pazartesi</td><td>minesminis hayvan sunumu (akıllı tahta)</td><td>15 dk</td></tr>
    <tr><td>Salı</td><td>Çalışma kâğıdı: resim-kelime eşleştirme</td><td>20 dk</td></tr>
    <tr><td>Çarşamba</td><td>"Animal Simon Says" oyunu</td><td>15 dk</td></tr>
    <tr><td>Perşembe</td><td>Çalışma kâğıdı: "A ____ is big."</td><td>20 dk</td></tr>
    <tr><td>Cuma</td><td>Mini sözlü test: "Name 5 animals!"</td><td>10 dk</td></tr>
  </tbody>
</table>
<p>Bu şablonu farklı temalar için (Colors, Numbers, Food, Weather, Family) tekrar edebilirsiniz.</p>

<h2>Veliyle İletişim</h2>
<p>Velilere kısa, net bir not gönderin:</p>
<blockquote>
  <p>"Merhaba. Sınıfımızda İngilizce öğrenimini desteklemek için minesminis.com adresini kullanıyoruz — ücretsiz ve kayıt gerekmiyor. Çocuğunuz evde de bu kaynakla pekiştirme yapabilir. Bu hafta konumuz: <em>Renkler</em>. Çalışma kâğıdını birlikte yapmaya çalışırsanız sevinirim."</p>
</blockquote>
<p>Bu kısa iletişim aile-okul köprüsünü güçlendiriyor ve çocuğun motivasyonunu artırıyor.</p>

<h2>Teknik Sorun Çözümleri</h2>
<p><strong>İnternet kesintisi:</strong> Önemli sunumları PDF olarak önceden indirin (yazıcı çıktısı olarak). Yedek planınız olsun.</p>
<p><strong>Akıllı tahta yavaş:</strong> Tahtayı dersten 5 dakika önce açın, minesminis sayfasını önceden yükleyin. İlk açılış gecikmesi sınıf zamanını yemesin.</p>
<p><strong>Ses çıkmıyor:</strong> Ders öncesi 30 saniye test yapın. Hoparlör ayrı kabloyla bağlıysa o da bağlı mı kontrol edin.</p>

<h2>Sınıf İçi Motivasyon Sistemleri</h2>
<ul>
  <li><strong>"English Champion" rozeti:</strong> Haftada bir çocuğa İngilizce katılımı için verin. Tahtaya yazın.</li>
  <li><strong>Grup yarışları:</strong> Sınıfı 2 takıma bölüp kelime hatırlatma yarışı yapın. Düşük baskılı, oyunsu bir motivasyon yaratır.</li>
  <li><strong>Sticker tablosu:</strong> Her ödev tamamlama için sticker. Haftada 5 sticker = küçük ödül.</li>
</ul>

<h2>Sonuç</h2>
<p>minesminis'i sınıfa entegre etmek için iki şey gerekiyor: (1) önceden hazırlık (5 dakika), (2) tutarlı haftalık ritim. İçeriği ders kitabı yerine değil, ders kitabını destekleyici olarak kullanın. Bu yaklaşım, MEB müfredatından kopmadan modern, etkileşimli bir İngilizce dersi yaratıyor. Sorunuz, deneyiminiz veya pilot olmak isteğiniz için: info@minesminis.com</p>`,
  },
  {
    slug: 'anaokulu-cocuga-ingilizce-3-5-yas-yaklasim',
    title: 'Anaokulu Çağında İngilizce: 3-5 Yaş İçin Doğru Yaklaşım',
    excerpt: 'En küçük yaşta İngilizce başlatmanın bilimi, riskleri, kazanımları. Anne-baba için 3-5 yaş özel yöntem rehberi.',
    meta_description: '3-5 yaş çocukta İngilizce öğretimine doğru başlangıç. Bilim ne diyor, neyi yapmalı, neyi yapmamalı? Anaokulu yaşı için rehber.',
    keywords: ['anaokulu İngilizce', '3-5 yaş dil öğrenimi', 'erken çocukluk', 'iki dilli yetiştirme'],
    category: 'teaching-english-to-kids',
    reading_time_min: 7,
    published_at: '2026-05-09T11:00:00Z',
    content_html: `<h2>3-5 Yaş Neden Özel?</h2>
<p>Çocuk beyninin esnekliği (plastisitesi) 0-7 yaş arasında zirveye çıkıyor. Bu dönemde dile maruz kalan çocuk, sinir bağlantılarını "ana dil" olarak kabloluyor. 3-5 yaş bu pencerenin tam ortasında — Türkçesi sağlamlaşmış, yabancı sesleri öğrenmeye en açık dönem.</p>
<p>Ama bu özelliği kötü kullanmak çocuğu yorabilir. 3-5 yaş aynı zamanda <strong>kimlik gelişimi</strong> ve <strong>anadili sağlamlaştırma</strong> dönemi. Doğru yaklaşım — bilim ne diyor?</p>

<h2>Doğru Yaklaşımın 4 İlkesi</h2>

<h3>1. Maruziyet, Eğitim Değil</h3>
<p>3-5 yaş çocuğu "ders" yapmaz. Onun için her şey oyun olmalı. Tablette İngilizce çizgi film izlemek, mutfakta İngilizce şarkı söylemek, banyo sırasında "duck" oyuncağıyla "Where is the duck?" diye saklambaç oynamak — bunlar maruziyet. Hedef "öğretmek" değil, dilin kulağa tanıdık gelmesini sağlamak.</p>

<h3>2. Süre: Günde 15-20 Dakika, Daha Değil</h3>
<p>Bu yaşta dikkat süresi ortalama 10-12 dakika. 20 dakikadan uzun her seans çocuğu yoruyor, dile karşı olumsuz çağrışım yaratıyor. Günde tek bir uzun seans yerine 2 kısa seans daha verimli — örneğin 10 dakika sabah, 10 dakika akşam.</p>

<h3>3. Çoklu Duyusal Öğretim</h3>
<p>Çocuk bu yaşta soyut kavramları henüz hazmedemiyor. "Mavi" öğretmek için ekranda mavi kart göstermek yetmez; mavi bir oyuncak getirmek, mavi gökyüzünü göstermek, "blue" derken birlikte "mavi" demek — tüm bunlar görsel, işitsel, kinestetik kanalları açıyor. Araştırmalarda <em>multisensory learning</em> 3-5 yaş çocuğunda tek kanal öğretime kıyasla 3 kat daha etkili.</p>

<h3>4. Hata Toleransı = Zero Stress</h3>
<p>Çocuğu asla düzeltmeyin. Yanlış telaffuz ederse, siz doğrusunu sesli tekrarlayın. Çocuk "dog" yerine "tog" derse, "Yes, the dog!" diye onaylayıp doğru formayı sunun. Bu, dilbilimde <em>recast</em> tekniği — çocuk düzeltildiğini hissetmeden doğru biçime maruz kalıyor.</p>

<h2>Anaokulu Yaşına Uygun 5 Etkinlik</h2>

<h3>Etkinlik 1: Renkli Avlar</h3>
<p>"Find something red!" deyin. Çocuk evde kırmızı bir nesne bulup getirsin. "Yes, an apple is red!" Çocuk hem hareket ediyor, hem nesneyi tanıyor, hem kelimeyi duyuyor.</p>

<h3>Etkinlik 2: Hayvan Sesleri</h3>
<p>"What does a cat say?" diye sorun. Çocuk "Meow!" desin. "What does a dog say?" — "Woof!" Bu hem eğlenceli, hem ses-anlam bağı kuruyor, hem hayvan isimlerini pekiştiriyor.</p>

<h3>Etkinlik 3: Beden Şarkıları</h3>
<p>"Head, Shoulders, Knees and Toes" şarkısı bu yaş için altın değerinde. 3 hafta düzenli söylendiğinde çocuk şarkıyı ezberliyor ve vücut bölümleri kelimelerini biliyor — ama "öğrendim" demiyor, sadece "biliyor".</p>

<h3>Etkinlik 4: Resimli Hikâye Kitabı</h3>
<p>Eric Carle'ın "Brown Bear, Brown Bear, What Do You See?" gibi tekrarlı, kalıp cümleli kitaplar bu yaş için harika. Her sayfada aynı kalıp ("Brown bear, brown bear, what do you see?") tekrar ediyor, sadece hayvan değişiyor. Çocuk birkaç okumadan sonra kalıbı kendi söylemeye başlıyor.</p>

<h3>Etkinlik 5: Banyo Saati İngilizce</h3>
<p>Rutin etkinlikleri İngilizce yapmak en verimli yöntemlerden biri. Banyo zamanı "water", "soap", "duck", "splash" gibi kelimeleri doğal bağlamda sunuyor. Akşam yemeği "apple", "bread", "milk" için ideal.</p>

<h2>Bu Yaşta Yapılmaması Gerekenler</h2>
<ul>
  <li><strong>Yazma alıştırması.</strong> 3-5 yaşta çocuğun ince motor becerisi henüz tam gelişmedi. Yazma değil, görsel tanıma ve sözel üretim hedeflenmeli.</li>
  <li><strong>Gramer kuralı öğretme.</strong> "I have" mı "I has" mı? Bu yaşta çocuk grameri ezberlemiyor, bağlamdan içselleştiriyor. "I have a dog" cümlesini çok kez duyduğunda "have" gelişine alışıyor — kural değil örüntü olarak.</li>
  <li><strong>Sınav baskısı.</strong> "Hadi bakalım, kaç tane renk biliyorsun?" sorusu çocuğu performans baskısına sokuyor ve dile karşı kaygı yaratıyor. Test yerine oyun.</li>
  <li><strong>Tek başına ekran karşısında bırakma.</strong> Bu yaşta çocuk yetişkin etkileşimine ihtiyaç duyuyor. YouTube İngilizce çizgi filmi gözetimsiz değil, eşlik ederek izletilmeli.</li>
</ul>

<h2>Türkçeye Zarar Verir Mi?</h2>
<p>Aileler en çok bunu soruyor. Bilim cevabı net: hayır.</p>
<p>Jim Cummins'in <em>Interdependence Hypothesis</em>'i (1979) gösteriyor ki çocuk anadilinde güçlü bir temel oluşturursa, ikinci dil bu temel üzerine inşa oluyor. Aksine, çift dilli yetişen çocuklar tek dillilere kıyasla bilişsel esneklik ve problem çözme becerilerinde avantajlı.</p>
<p>Tek koşul: anadili maruziyetinin sürmesi. Ev içinde Türkçe konuşulduğu, Türkçe kitap okunduğu, masallar anlatıldığı sürece İngilizce, Türkçeye zarar vermiyor.</p>

<h2>Pratik Haftalık Plan (Anaokulu Çağı)</h2>
<table border="1" cellpadding="8">
  <thead><tr><th>Gün</th><th>Etkinlik</th><th>Süre</th></tr></thead>
  <tbody>
    <tr><td>Pazartesi</td><td>"Head Shoulders" şarkısı + dans</td><td>10 dk</td></tr>
    <tr><td>Salı</td><td>Renk avı: "Find blue!"</td><td>10 dk</td></tr>
    <tr><td>Çarşamba</td><td>"Brown Bear" hikâye kitabı</td><td>10 dk</td></tr>
    <tr><td>Perşembe</td><td>Hayvan sesleri oyunu</td><td>10 dk</td></tr>
    <tr><td>Cuma</td><td>Geçen haftanın tüm sözcükleri kart oyunu</td><td>15 dk</td></tr>
    <tr><td>Cumartesi-Pazar</td><td>İsteğe bağlı — çizgi film, dış mekânda doğal İngilizce</td><td>-</td></tr>
  </tbody>
</table>

<h2>Sonuç</h2>
<p>3-5 yaş İngilizce için altın bir dönem, ama ancak baskısız ve oyun temelli olduğunda. Hedef çocuğun dile aşinalık geliştirmesi, anadilini güçlendirmesini desteklemek ve sonraki yıllarda okul İngilizcesine başladığında kaygısız ve özgüvenli olmasını sağlamak. Sınav, not, başarı — bunlar 3-5 yaşın kelimeleri değil. Eğlence, tekrar, sabır — bunlar.</p>`,
  },
  {
    slug: 'ingilizce-cizgi-film-pasif-dinleme-faydasi',
    title: 'İngilizce Çizgi Filmlerle Pasif Dinleme: Çocuğunuza Gerçek Avantaj',
    excerpt: 'Çocuk çizgi filmleri İngilizce izlerken gerçekten öğreniyor mu? Pasif dinleme bilimi, doğru izleme stratejisi, önerilen seriler.',
    meta_description: 'Çocuğunuza İngilizce çizgi film izletmek: pasif dinlemenin bilimi, hangi seriyi seçmeli, ne kadar süre uygundur?',
    keywords: ['İngilizce çizgi film', 'pasif dinleme', 'çocuk dil edinimi', 'ekran süresi'],
    category: 'teaching-english-to-kids',
    reading_time_min: 7,
    published_at: '2026-05-06T15:00:00Z',
    content_html: `<h2>Pasif Dinleme Gerçekten İşe Yarıyor Mu?</h2>
<p>Çocuğunuz Peppa Pig'in İngilizce versiyonunu hiç anlamadan izliyor olabilir. Soru: Bu seyretmek tam anlamıyla "boşa giden ekran süresi" mi, yoksa bir şey öğrendiği için mi seyrediyor?</p>
<p>Dil edinim araştırmaları net cevap veriyor: <strong>pasif dinleme tek başına yeterli değil ama doğru kullanıldığında çok güçlü bir katalizör.</strong> Stephen Krashen'in Input Hypothesis'ine göre, çocuk "anlaşılabilir girdi"ye (comprehensible input) maruz kaldıkça beyin bilinçaltında dilsel kuralları çıkartıyor. Çizgi film, görsel + sesli bağlamı birlikte sunduğu için tipik radyo dinlemekten %40-60 daha "anlaşılabilir" oluyor — Patricia Kuhl'un 2004 araştırması bunu doğruluyor.</p>

<h2>Pasif Dinlemenin 3 Temel Faydası</h2>

<h3>1. Ses Sisteminin Kalibre Olması</h3>
<p>İngilizce'nin bazı sesleri Türkçe'de yok: "th" (think), "v" (very), schwa (about). Çocuk bu seslere düzenli maruz kalmazsa, yıllar sonra bile bu sesleri çıkartamıyor. Pasif dinleme, beyin kulağı bu seslere alıştırıyor — çocuk "söylemese" bile <strong>algılıyor</strong>.</p>

<h3>2. Doğal Tonlama ve Vurgu</h3>
<p>Türkçe nispeten düz tonlu bir dil. İngilizce ise yükselen-alçalan tonlamalarla anlam taşıyor: "Really?" (soru olarak yükselen) vs "Really." (kabul olarak alçalan). Çizgi film karakterleri dramatik tonlamalarla konuştuğu için çocuk doğal İngilizce ritmini bilinçsizce ediniyor.</p>

<h3>3. Bağlam-Anlam İlişkisi</h3>
<p>Çocuk Peppa "I'm hungry" derken karnını tutuyorsa, "hungry" kelimesinin anlamını çevirisiz öğreniyor. Bu, dilbilimde <em>contextual learning</em> — Türkçe-İngilizce çift yönlü çevirinin sağlayamadığı doğal bir kelime kazanımı.</p>

<h2>Pasif Dinlemenin Sınırı: Aktif Olmadan Çalışmıyor</h2>
<p>Önemli not: pasif dinleme tek başına yeterli <strong>değil</strong>. Çocuk haftada 10 saat İngilizce çizgi film izlese de hiç konuşma fırsatı bulmasa, üretici dil (speaking) gelişmiyor. Pasif dinleme bir <em>besin</em>, aktif kullanım bir <em>kas çalışması</em>. İkisi birlikte olmalı.</p>
<p>Pratik kural: her 30 dakika pasif dinleme için en az 10 dakika aktif kullanım. Aktif kullanım = oyun, soru-cevap, rol oynama, çizgi film hakkında konuşma.</p>

<h2>Doğru Çizgi Film Seçimi: 5 Kriter</h2>

<h3>Kriter 1: Yaşa Uygun Hız</h3>
<p>4-6 yaş için çok hızlı konuşan karakterler kafa karıştırıyor. Peppa Pig (yavaş, açık konuşma), Daniel Tiger's Neighborhood (yavaş + tekrarlı) idealdir. Pokemon (hızlı diyalog) bu yaşta yorucu.</p>

<h3>Kriter 2: Tekrarlanan Kalıplar</h3>
<p>Aynı diyalog kalıpları farklı bağlamlarda tekrar ettiğinde çocuk içselleştiriyor. Daniel Tiger her bölümde aynı yapıyı izliyor; ana karakter bir duygu yaşıyor, "When you feel ___, do this..." kalıbıyla başa çıkma stratejisi öğretiyor.</p>

<h3>Kriter 3: Görsel Bağlam Zenginliği</h3>
<p>Karakter "I'm thirsty" derken bardağa uzanıyorsa, görsel bağlam anlamı destekliyor. Görsel destek olmayan, sadece kelime ağırlıklı animasyonlar bu yaş için zayıf seçim.</p>

<h3>Kriter 4: Çocuğun İlgi Alanı</h3>
<p>İlgi olmazsa çocuk dikkat etmiyor. Arabaları seven çocuğa Octonauts'tan önce Disney Cars veya Mighty Express daha verimli. Çocuğun ilgisi içerik kapasitesinden daha önemli.</p>

<h3>Kriter 5: Ekran Süresi Sınırı</h3>
<p>WHO ve Türk Pediatri Kurumu önerileri: 2-5 yaş için günde 1 saatten az kaliteli ekran. 6-10 yaş için günde 1-2 saatten az. Bu sınır içinde kalın.</p>

<h2>Önerilen Seriler (4-9 Yaş)</h2>

<h3>4-6 Yaş</h3>
<ul>
  <li><strong>Peppa Pig:</strong> Çok yavaş konuşma, basit kelime, günlük rutinler. 5 dakikalık bölümler.</li>
  <li><strong>Daniel Tiger's Neighborhood:</strong> Tekrarlı kalıplar, duygu kelimeleri, sosyal beceriler.</li>
  <li><strong>Bluey:</strong> Aile dinamikleri, oyun zekâsı, Avustralyalı aksanı.</li>
</ul>

<h3>6-9 Yaş</h3>
<ul>
  <li><strong>Sesame Street:</strong> Klasik, eğitsel odaklı, kelime öğretim segmentleri.</li>
  <li><strong>Magic School Bus:</strong> Bilim + İngilizce, biraz daha hızlı ama bağlam zengin.</li>
  <li><strong>Arthur:</strong> Okul yaşı, sosyal hikâyeler, orta hız.</li>
</ul>

<h3>9+ Yaş</h3>
<ul>
  <li><strong>Pokémon (İngilizce):</strong> Hızlı, ama tekrar eden karakter sözleri.</li>
  <li><strong>Avatar: The Last Airbender:</strong> Karmaşık hikâye ama eğitici, kaliteli İngilizce.</li>
</ul>

<h2>Aktif Hale Getirme: Sonrası Soruları</h2>
<p>Çizgi film bittikten sonra çocuğa 2-3 basit soru sorun:</p>
<ul>
  <li>"What was Peppa's name today?"</li>
  <li>"How did Daniel feel?"</li>
  <li>"What color was the car?"</li>
</ul>
<p>Çocuk Türkçe cevap verirse — sorun değil. "Peppa was happy" diye doğru cevabı sesli tekrarlayın. Aktif kullanım, çocuğun kelimeyi kendi söylemesinden değil, soruya cevap olarak doğru kalıbı duymasından geliyor.</p>

<h2>Altyazı Kullanmalı Mıyım?</h2>
<p>5 yaş altı: kesinlikle hayır. Çocuk okuyamıyor, alt yazı dikkati dağıtıyor.</p>
<p>6-8 yaş, Türkçe altyazı: tartışmalı. Bazı uzmanlar Türkçe altyazıyı önerirken, dil edinim araştırmacıları çoğunlukla karşı çıkıyor. Sebep: çocuk gözle Türkçe okuyor, kulakla İngilizce dinliyor ama çoğu zaman Türkçeyi öncelikli işliyor — sonuç: İngilizce hiç hatırlanmıyor.</p>
<p>8+ yaş, İngilizce altyazı: ideal. Çocuk hem okuma yapıyor, hem dinliyor, hem yazılı kelimeyi sesle eşleştiriyor. Phonics becerisini ve hızlı okumayı destekliyor.</p>

<h2>Yaygın Hatalar</h2>
<h3>Hata 1: Aşırı maruziyeti çözüm sanmak</h3>
<p>"Çocuğum günde 3 saat İngilizce çizgi film izliyor, neden konuşmuyor?" — Çünkü aktif kullanım yok. Çözüm: çizgi film süresini düşür, aktif oyun süresini artır.</p>

<h3>Hata 2: Çocuğu zorla başında bekletme</h3>
<p>Çocuk sıkılırsa, kapatın. İlgisi olmayan zoraki seyretmek ödevi pekiştirmiyor. Tersine, dile karşı olumsuz duygu yaratıyor.</p>

<h3>Hata 3: Aşırı dramatik içeriği bu yaşa sunma</h3>
<p>5 yaş çocuğu "Spider-Man" gibi yüksek aksiyonlu serileri seyrederse, dil değil korku ve adrenalin öğreniyor. Bu yaşta sakin, hayat dolu, eğitsel içerik seçin.</p>

<h2>Sonuç</h2>
<p>Pasif dinleme, doğru kullanıldığında çocuğun İngilizce yolculuğunda muazzam bir avantaj sağlıyor. Anahtarlar: yaşa uygun seri, makul süre (günde 30-60 dakika), gözetimli izleme, sonrası aktif kullanım. Çizgi film tek başına yetmez, ama uygun şekilde entegre edildiğinde 6 ayda çocuğunuzun pasif kelime hazinesini iki katına çıkarabilir.</p>`,
  },
]
