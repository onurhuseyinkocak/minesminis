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
]
