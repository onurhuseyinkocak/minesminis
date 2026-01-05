// Videos Data - Extracted from Videos.tsx for admin management

export type Video = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    grade: string;
    type: 'song' | 'lesson' | 'story';
    duration: string;
    isPopular?: boolean;
};

export const videos: Video[] = [
    // 2nd Grade - Basic English (8 videos)
    {
        id: 'XqZsoesa55w',
        title: 'Baby Shark Dance',
        description: 'The most popular kids song ever!',
        thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '2:16',
        isPopular: true
    },
    {
        id: 'e0-2XxgHIXk',
        title: 'Phonics Song with TWO Words',
        description: 'A-Apple, B-Ball, learn letters!',
        thumbnail: 'https://img.youtube.com/vi/e0-2XxgHIXk/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '4:06',
        isPopular: true
    },
    {
        id: 'BD75RYqrSEI',
        title: 'Wheels On The Bus',
        description: 'Classic nursery rhyme song!',
        thumbnail: 'https://img.youtube.com/vi/BD75RYqrSEI/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '2:30'
    },
    {
        id: 'WHLZsCz6Yx4',
        title: 'Five Little Ducks Song',
        description: 'Count ducks with this fun song!',
        thumbnail: 'https://img.youtube.com/vi/WHLZsCz6Yx4/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'story',
        duration: '2:45'
    },
    {
        id: 'ZS1J3VrxnM0',
        title: 'Head Shoulders Knees and Toes',
        description: 'Learn body parts with actions!',
        thumbnail: 'https://img.youtube.com/vi/ZS1J3VrxnM0/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '1:53',
        isPopular: true
    },
    {
        id: 'eBVqcTEC3zQ',
        title: "If You're Happy and You Know It",
        description: 'Clap your hands and sing along!',
        thumbnail: 'https://img.youtube.com/vi/eBVqcTEC3zQ/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '2:15'
    },
    {
        id: '75NQK-Sm1YY',
        title: 'ABC Song Classic',
        description: 'Learn the alphabet the fun way!',
        thumbnail: 'https://img.youtube.com/vi/75NQK-Sm1YY/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'song',
        duration: '1:58'
    },
    {
        id: 'M3rg-rh6MPo',
        title: 'Numbers Song 1-10',
        description: 'Count from one to ten!',
        thumbnail: 'https://img.youtube.com/vi/M3rg-rh6MPo/mqdefault.jpg',
        grade: '2nd Grade',
        type: 'lesson',
        duration: '2:35'
    },

    // 3rd Grade - Intermediate (8 videos)
    {
        id: 'loINl3Ln6Ck',
        title: 'The Shapes Song',
        description: 'Circle, square, triangle and more!',
        thumbnail: 'https://img.youtube.com/vi/loINl3Ln6Ck/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '2:08'
    },
    {
        id: '05pYU8saoDs',
        title: 'Days of the Week Song',
        description: 'Monday, Tuesday, Wednesday...',
        thumbnail: 'https://img.youtube.com/vi/05pYU8saoDs/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '2:40',
        isPopular: true
    },
    {
        id: 'v608v42dKeI',
        title: 'Months of the Year Song',
        description: 'January to December!',
        thumbnail: 'https://img.youtube.com/vi/v608v42dKeI/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '2:12'
    },
    {
        id: 'cJynz8jmRBE',
        title: 'Weather Song',
        description: 'Sunny, rainy, cloudy, snowy!',
        thumbnail: 'https://img.youtube.com/vi/cJynz8jmRBE/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '2:30'
    },
    {
        id: 'AOz4DqJuAaA',
        title: 'Finger Family Song',
        description: 'Daddy finger, where are you?',
        thumbnail: 'https://img.youtube.com/vi/AOz4DqJuAaA/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '1:45',
        isPopular: true
    },
    {
        id: 'VuNlGfIfigs',
        title: 'Old MacDonald Had a Farm',
        description: 'E-I-E-I-O! Animal sounds!',
        thumbnail: 'https://img.youtube.com/vi/VuNlGfIfigs/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '3:05'
    },
    {
        id: '3rl7Mdg4Qvk',
        title: 'Colors Song for Kids',
        description: 'Red, blue, yellow, green!',
        thumbnail: 'https://img.youtube.com/vi/3rl7Mdg4Qvk/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'song',
        duration: '2:25'
    },
    {
        id: 'mXMofxtDPUQ',
        title: 'Animal Sounds Song',
        description: 'What does the cow say? Moo!',
        thumbnail: 'https://img.youtube.com/vi/mXMofxtDPUQ/mqdefault.jpg',
        grade: '3rd Grade',
        type: 'lesson',
        duration: '2:50'
    },

    // 4th Grade - Advanced (8 videos)
    {
        id: 'TfkIAyJLvyE',
        title: 'Twinkle Twinkle Little Star',
        description: 'Beautiful lullaby to sing!',
        thumbnail: 'https://img.youtube.com/vi/TfkIAyJLvyE/mqdefault.jpg',
        grade: '4th Grade',
        type: 'song',
        duration: '2:00'
    },
    {
        id: 'M2cckDmNLMI',
        title: 'BINGO Dog Song',
        description: 'B-I-N-G-O! Spell and sing!',
        thumbnail: 'https://img.youtube.com/vi/M2cckDmNLMI/mqdefault.jpg',
        grade: '4th Grade',
        type: 'song',
        duration: '2:20',
        isPopular: true
    },
    {
        id: 'Sj8qPwRzcS8',
        title: 'Daily Routines Song',
        description: 'Wake up, eat, go to school!',
        thumbnail: 'https://img.youtube.com/vi/Sj8qPwRzcS8/mqdefault.jpg',
        grade: '4th Grade',
        type: 'lesson',
        duration: '3:55'
    },
    {
        id: 'L0mL4oZycnU',
        title: 'Fruits Song',
        description: 'Apple, banana, orange, grape!',
        thumbnail: 'https://img.youtube.com/vi/L0mL4oZycnU/mqdefault.jpg',
        grade: '4th Grade',
        type: 'song',
        duration: '2:55'
    },
    {
        id: 'pLpHF9dLc2Q',
        title: 'Row Row Row Your Boat',
        description: 'Classic song for kids!',
        thumbnail: 'https://img.youtube.com/vi/pLpHF9dLc2Q/mqdefault.jpg',
        grade: '4th Grade',
        type: 'song',
        duration: '2:10'
    },
    {
        id: '_cgc6FCyNnk',
        title: 'Walking Walking Song',
        description: 'Action words - walking, running!',
        thumbnail: 'https://img.youtube.com/vi/_cgc6FCyNnk/mqdefault.jpg',
        grade: '4th Grade',
        type: 'lesson',
        duration: '2:30'
    },
    {
        id: 'LRirT_MyHZQ',
        title: 'Vegetables Song',
        description: 'Carrot, potato, tomato!',
        thumbnail: 'https://img.youtube.com/vi/LRirT_MyHZQ/mqdefault.jpg',
        grade: '4th Grade',
        type: 'song',
        duration: '2:15'
    },
    {
        id: '7OyUZBo0VtE',
        title: 'Family Members Song',
        description: 'Mom, dad, sister, brother!',
        thumbnail: 'https://img.youtube.com/vi/7OyUZBo0VtE/mqdefault.jpg',
        grade: '4th Grade',
        type: 'lesson',
        duration: '3:10'
    }
];

export const gradeInfo: Record<string, { color: string; gradient: string; emoji: string }> = {
    '2nd Grade': {
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
        emoji: '🌱'
    },
    '3rd Grade': {
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        emoji: '⭐'
    },
    '4th Grade': {
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        emoji: '🚀'
    }
};
