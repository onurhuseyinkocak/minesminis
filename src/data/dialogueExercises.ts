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
            text: 'I am a cat.',
            textTr: 'Ben bir kediyim.',
            correct: false,
          },
          {
            id: 'c',
            text: 'Yes, apple.',
            textTr: 'Evet, elma.',
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
            text: 'I like pizza.',
            textTr: 'Pizzayı severim.',
            correct: false,
          },
          {
            id: 'f',
            text: 'It is raining.',
            textTr: 'Yağmur yağıyor.',
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
            text: 'I want ice cream.',
            textTr: 'Dondurma istiyorum.',
            correct: false,
          },
          {
            id: 'i',
            text: 'My dog is big.',
            textTr: 'Köpeğim büyük.',
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
    title: 'Let\'s Talk Colors!',
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
        text: 'That\'s right! And what color is the sky?',
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
            text: 'I eat green.',
            textTr: 'Yeşil yerim.',
            correct: false,
          },
          {
            id: 'i',
            text: 'Blue is a dog.',
            textTr: 'Mavi bir köpek.',
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
            text: 'I drink a cat.',
            textTr: 'Bir kedi içiyorum.',
            correct: false,
          },
          {
            id: 'c',
            text: 'The fish is tall.',
            textTr: 'Balık uzun.',
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
            text: 'A fish has a long neck!',
            textTr: 'Balığın uzun boynu var!',
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
];
