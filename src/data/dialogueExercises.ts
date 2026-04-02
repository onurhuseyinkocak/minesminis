import type { DialogueLine } from '../components/games/DialogueGame';

export interface DialogueExercise {
  id: string;
  title: string;
  titleTr: string;
  topic: string;
  lines: DialogueLine[];
}

export const DIALOGUE_EXERCISES: DialogueExercise[] = [
  // ── Exercise 1: Greetings ──────────────────────────────────────────────────
  {
    id: 'greetings-1',
    title: 'Say Hello!',
    titleTr: 'Merhaba De!',
    topic: 'greetings',
    lines: [
      {
        speaker: 'mimi',
        text: 'Hello! How are you?',
        textTr: 'Merhaba! Nasılsın?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'a',
            text: 'I am fine, thank you!',
            textTr: 'İyiyim, teşekkürler!',
            correct: true,
            feedback: 'Perfect!',
          },
          {
            id: 'b',
            text: 'I am happy!',
            textTr: 'Mutluyum!',
            correct: false,
          },
          {
            id: 'c',
            text: 'Good morning!',
            textTr: 'Günaydın!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Great! What is your name?',
        textTr: 'Harika! Adın ne?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'd',
            text: 'My name is Alex.',
            textTr: 'Benim adım Alex.',
            correct: true,
            feedback: 'Nice to meet you!',
          },
          {
            id: 'e',
            text: 'I am five years old.',
            textTr: 'Ben beş yaşındayım.',
            correct: false,
          },
          {
            id: 'f',
            text: 'I live in the city.',
            textTr: 'Şehirde yaşıyorum.',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Nice to meet you, Alex! See you later!',
        textTr: 'Tanıştığıma memnun oldum, Alex! Görüşürüz!',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'g',
            text: 'Bye bye! See you!',
            textTr: 'Hoşça kal! Görüşürüz!',
            correct: true,
            feedback: 'Great job!',
          },
          {
            id: 'h',
            text: 'Hello! Nice to meet you!',
            textTr: 'Merhaba! Tanıştığıma memnun oldum!',
            correct: false,
          },
          {
            id: 'i',
            text: 'Good morning, Mimi!',
            textTr: 'Günaydın, Mimi!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Bye! You did amazing!',
        textTr: 'Hoşça kal! Harika yaptın!',
      },
    ],
  },

  // ── Exercise 2: Colors ─────────────────────────────────────────────────────
  {
    id: 'colors-1',
    title: "Let's Talk Colors!",
    titleTr: 'Renkleri Konuşalım!',
    topic: 'colors',
    lines: [
      {
        speaker: 'mimi',
        text: 'Hi! I love colors! What color is the sun?',
        textTr: 'Merhaba! Renkleri çok seviyorum! Güneş ne renk?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'a',
            text: 'The sun is yellow!',
            textTr: 'Güneş sarı!',
            correct: true,
            feedback: 'Yes! Yellow sun!',
          },
          {
            id: 'b',
            text: 'The sun is green!',
            textTr: 'Güneş yeşil!',
            correct: false,
          },
          {
            id: 'c',
            text: 'The sun is purple!',
            textTr: 'Güneş mor!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: "That's right! And what color is the sky?",
        textTr: 'Doğru! Peki gökyüzü ne renk?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'd',
            text: 'The sky is blue!',
            textTr: 'Gökyüzü mavi!',
            correct: true,
            feedback: 'Brilliant!',
          },
          {
            id: 'e',
            text: 'The sky is orange!',
            textTr: 'Gökyüzü turuncu!',
            correct: false,
          },
          {
            id: 'f',
            text: 'The sky is pink!',
            textTr: 'Gökyüzü pembe!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Wonderful! What is your favorite color?',
        textTr: 'Harika! En sevdiğin renk hangisi?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'g',
            text: 'My favorite color is red!',
            textTr: 'En sevdiğim renk kırmızı!',
            correct: true,
            feedback: 'Red is so cool!',
          },
          {
            id: 'h',
            text: 'My favorite color is yellow!',
            textTr: 'En sevdiğim renk sarı!',
            correct: false,
          },
          {
            id: 'i',
            text: 'My favorite color is blue!',
            textTr: 'En sevdiğim renk mavi!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Red is awesome! You know so many colors!',
        textTr: 'Kırmızı harika! Çok fazla renk biliyorsun!',
      },
    ],
  },

  // ── Exercise 3: Animals ────────────────────────────────────────────────────
  {
    id: 'animals-1',
    title: 'Animal Talk!',
    titleTr: 'Hayvanlar Konuşuyor!',
    topic: 'animals',
    lines: [
      {
        speaker: 'mimi',
        text: 'I love animals! Do you have a pet?',
        textTr: 'Hayvanları çok seviyorum! Evcil hayvanın var mı?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'a',
            text: 'Yes! I have a dog!',
            textTr: 'Evet! Bir köpeğim var!',
            correct: true,
            feedback: 'Dogs are so fun!',
          },
          {
            id: 'b',
            text: 'No, I do not have a pet.',
            textTr: 'Hayır, evcil hayvanım yok.',
            correct: false,
          },
          {
            id: 'c',
            text: 'Yes! I have a cat!',
            textTr: 'Evet! Bir kedim var!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Awesome! What does a dog say?',
        textTr: 'Harika! Köpek ne der?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'd',
            text: 'A dog says "Woof woof!"',
            textTr: 'Köpek "Hav hav!" der!',
            correct: true,
            feedback: 'Woof woof! Correct!',
          },
          {
            id: 'e',
            text: 'A dog says "Moo!"',
            textTr: 'Köpek "Möö!" der.',
            correct: false,
          },
          {
            id: 'f',
            text: 'A dog says "Tweet!"',
            textTr: 'Köpek "Cik cik!" der.',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Woof woof! Correct! What animal has a long neck?',
        textTr: 'Hav hav! Doğru! Hangi hayvanın uzun boynu var?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          {
            id: 'g',
            text: 'A giraffe has a long neck!',
            textTr: 'Zürafa uzun boyunlu!',
            correct: true,
            feedback: 'So tall and beautiful!',
          },
          {
            id: 'h',
            text: 'An elephant has a long neck!',
            textTr: 'Filin uzun boynu var!',
            correct: false,
          },
          {
            id: 'i',
            text: 'A rabbit has a long neck!',
            textTr: 'Tavşanın uzun boynu var!',
            correct: false,
          },
        ],
      },
      {
        speaker: 'mimi',
        text: 'A giraffe! So tall! You are great at animals!',
        textTr: 'Zürafa! Çok uzun! Hayvanlarda gerçekten iyisin!',
      },
    ],
  },

  // ── Exercise 4: Food ───────────────────────────────────────────────────────
  {
    id: 'food-1',
    title: 'What Do You Eat?',
    titleTr: 'Ne Yiyorsun?',
    topic: 'food',
    lines: [
      {
        speaker: 'mimi',
        text: 'I am hungry! What do you like to eat?',
        textTr: 'Açım! Ne yemeyi seversin?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'a', text: 'I like pizza and apples!', textTr: 'Pizza ve elma severim!', correct: true, feedback: 'Yummy choices!' },
          { id: 'b', text: 'I like bananas and milk!', textTr: 'Muz ve süt severim!', correct: false },
          { id: 'c', text: 'I like bread and cheese!', textTr: 'Ekmek ve peynir severim!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Great! Do you like bananas?',
        textTr: 'Harika! Muz sever misin?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'd', text: 'Yes, I love bananas!', textTr: 'Evet, muzları çok severim!', correct: true, feedback: 'Bananas give you energy!' },
          { id: 'e', text: 'No, I prefer apples.', textTr: 'Hayır, elmayı tercih ederim.', correct: false },
          { id: 'f', text: 'I do not like fruit.', textTr: 'Meyve sevmem.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'What do you drink in the morning?',
        textTr: 'Sabahları ne içersin?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'g', text: 'I drink milk in the morning!', textTr: 'Sabahları süt içerim!', correct: true, feedback: 'Milk makes you strong!' },
          { id: 'h', text: 'I drink orange juice.', textTr: 'Portakal suyu içerim.', correct: false },
          { id: 'i', text: 'I drink water only.', textTr: 'Sadece su içerim.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Milk is perfect! You eat so healthy!',
        textTr: 'Süt mükemmel! Çok sağlıklı besleniyorsun!',
      },
    ],
  },

  // ── Exercise 5: Family ─────────────────────────────────────────────────────
  {
    id: 'family-1',
    title: 'My Family!',
    titleTr: 'Ailem!',
    topic: 'family',
    lines: [
      {
        speaker: 'mimi',
        text: 'Tell me about your family! Do you have a brother or sister?',
        textTr: 'Ailenden bahset! Kardeşin var mı?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'a', text: 'I have a little sister!', textTr: 'Küçük bir kız kardeşim var!', correct: true, feedback: 'How sweet!' },
          { id: 'b', text: 'I have a big brother!', textTr: 'Büyük bir erkek kardeşim var!', correct: false },
          { id: 'c', text: 'I do not have a brother or sister.', textTr: 'Erkek ya da kız kardeşim yok.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Sweet! What does your mom do?',
        textTr: 'Sevimli! Annen ne yapıyor?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'd', text: 'My mom cooks delicious food!', textTr: 'Annem nefis yemekler pişiriyor!', correct: true, feedback: 'She sounds amazing!' },
          { id: 'e', text: 'My mom reads books all day!', textTr: 'Annem bütün gün kitap okuyor!', correct: false },
          { id: 'f', text: 'My mom works in an office.', textTr: 'Annem bir ofiste çalışıyor.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'What do you do with your dad?',
        textTr: 'Babanla ne yaparsın?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'g', text: 'I play football with my dad!', textTr: 'Babamla futbol oynarım!', correct: true, feedback: 'That is so fun!' },
          { id: 'h', text: 'I watch TV with my dad.', textTr: 'Babamla televizyon izlerim.', correct: false },
          { id: 'i', text: 'I read books with my dad.', textTr: 'Babamla kitap okurum.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'You have a wonderful family!',
        textTr: 'Harika bir ailen var!',
      },
    ],
  },

  // ── Exercise 6: At School ──────────────────────────────────────────────────
  {
    id: 'school-1',
    title: 'At School!',
    titleTr: 'Okulda!',
    topic: 'school',
    lines: [
      {
        speaker: 'mimi',
        text: 'Good morning! Are you ready for school?',
        textTr: 'Günaydın! Okula hazır mısın?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'a', text: 'Yes! I have my bag and book!', textTr: 'Evet! Çantam ve kitabım hazır!', correct: true, feedback: 'Great student!' },
          { id: 'b', text: 'Yes! My pencil and eraser are ready!', textTr: 'Evet! Kalemim ve silgim hazır!', correct: false },
          { id: 'c', text: 'Not yet, I am still eating!', textTr: 'Henüz değil, hâlâ yiyorum!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'What is your favorite subject?',
        textTr: 'En sevdiğin ders hangisi?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'd', text: 'I love art and English!', textTr: 'Resim ve İngilizceyi seviyorum!', correct: true, feedback: 'Excellent choices!' },
          { id: 'e', text: 'I love maths and science!', textTr: 'Matematik ve fen bilgisini seviyorum!', correct: false },
          { id: 'f', text: 'I love music class!', textTr: 'Müzik dersini seviyorum!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Who is your best friend at school?',
        textTr: 'Okulda en iyi arkadaşın kim?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'g', text: 'My best friend is Sam!', textTr: 'En iyi arkadaşım Sam!', correct: true, feedback: 'Sam is lucky to have you!' },
          { id: 'h', text: 'My best friend is Lily!', textTr: 'En iyi arkadaşım Lily!', correct: false },
          { id: 'i', text: 'I play with everyone!', textTr: 'Herkesle oynarım!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'You are a great student! Keep learning!',
        textTr: 'Harika bir öğrencisin! Öğrenmeye devam et!',
      },
    ],
  },

  // ── Exercise 7: Body Parts ─────────────────────────────────────────────────
  {
    id: 'body-1',
    title: 'My Body!',
    titleTr: 'Vücudum!',
    topic: 'body',
    lines: [
      {
        speaker: 'mimi',
        text: "Let's learn body parts! Touch your head!",
        textTr: 'Vücut bölümlerini öğrenelim! Başına dokun!',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'a', text: 'I am touching my head!', textTr: 'Başıma dokunuyorum!', correct: true, feedback: 'Good! Head!' },
          { id: 'b', text: 'I am touching my nose!', textTr: 'Burnuma dokunuyorum!', correct: false },
          { id: 'c', text: 'I am clapping my hands!', textTr: 'El çırpıyorum!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Great! How many eyes do you have?',
        textTr: 'Harika! Kaç gözün var?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'd', text: 'I have two eyes!', textTr: 'İki gözüm var!', correct: true, feedback: 'Two beautiful eyes!' },
          { id: 'e', text: 'I have one eye.', textTr: 'Bir gözüm var.', correct: false },
          { id: 'f', text: 'I have four eyes.', textTr: 'Dört gözüm var.', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Now wiggle your fingers!',
        textTr: 'Şimdi parmaklarını oynat!',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'g', text: 'I am wiggling my fingers!', textTr: 'Parmaklarımı oynatıyorum!', correct: true, feedback: 'Amazing! Ten fingers!' },
          { id: 'h', text: 'I am stomping my feet!', textTr: 'Ayaklarımı yere vuruyorum!', correct: false },
          { id: 'i', text: 'I am blinking my eyes!', textTr: 'Gözlerimi kırpıştırıyorum!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'You know your body so well! Wonderful!',
        textTr: 'Vücudunu çok iyi biliyorsun! Harika!',
      },
    ],
  },

  // ── Exercise 8: Weather ────────────────────────────────────────────────────
  {
    id: 'weather-1',
    title: "What's the Weather?",
    titleTr: 'Hava Nasıl?',
    topic: 'weather',
    lines: [
      {
        speaker: 'mimi',
        text: 'Look outside! What is the weather like today?',
        textTr: 'Dışarıya bak! Bugün hava nasıl?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'a', text: 'It is sunny today!', textTr: 'Bugün güneşli!', correct: true, feedback: 'Lovely sunny day!' },
          { id: 'b', text: 'It is rainy today!', textTr: 'Bugün yağmurlu!', correct: false },
          { id: 'c', text: 'It is cloudy today!', textTr: 'Bugün bulutlu!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Nice! What do you wear when it rains?',
        textTr: 'Güzel! Yağmur yağdığında ne giyersin?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'd', text: 'I wear a raincoat and boots!', textTr: 'Yağmurluk ve çizme giyerim!', correct: true, feedback: 'Smart choice!' },
          { id: 'e', text: 'I wear a hat and sunglasses!', textTr: 'Şapka ve güneş gözlüğü giyerim!', correct: false },
          { id: 'f', text: 'I wear my pyjamas!', textTr: 'Pijamamı giyerim!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'Do you like snow?',
        textTr: 'Kar yağmasını sever misin?',
      },
      {
        speaker: 'child',
        text: '',
        options: [
          { id: 'g', text: 'Yes! I love playing in the snow!', textTr: 'Evet! Karda oynamayı çok seviyorum!', correct: true, feedback: 'Snow is so magical!' },
          { id: 'h', text: 'No, snow is too cold for me!', textTr: 'Hayır, kar benim için çok soğuk!', correct: false },
          { id: 'i', text: 'I have never seen snow!', textTr: 'Hiç kar görmedim!', correct: false },
        ],
      },
      {
        speaker: 'mimi',
        text: 'You know all about the weather! Amazing!',
        textTr: 'Hava durumu hakkında her şeyi biliyorsun! İnanılmaz!',
      },
    ],
  },
];
