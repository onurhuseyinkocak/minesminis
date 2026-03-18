// Games Data - Extracted from Games.tsx for admin management

export type Game = {
    id: number;
    title: string;
    embedUrl: string;
    thumbnailUrl: string;
    type: string;
    grade: string;
};

export const grade2Games: Game[] = [
    {
        id: 1,
        title: "2nd Grade Revision",
        embedUrl: "https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21",
        type: "Maze Chase",
        grade: "2"
    },
    {
        id: 2,
        title: "Animals Quiz",
        embedUrl: "https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27",
        type: "Match Up",
        grade: "2"
    },
    {
        id: 3,
        title: "2nd Grade Quiz",
        embedUrl: "https://wordwall.net/tr/embed/7069b22dfc384f9ba0e1c7de9f1fb835?themeId=44&templateId=5&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44",
        type: "Quiz",
        grade: "2"
    },
    {
        id: 4,
        title: "Simple Past Questions",
        embedUrl: "https://wordwall.net/tr/embed/03dd454cab56495a82a08d631b357b9b?themeId=22&templateId=30&fontStackId=15",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/03dd454cab56495a82a08d631b357b9b_22",
        type: "Open Box",
        grade: "2"
    },
    {
        id: 5,
        title: "Unit 1 Vocabulary",
        embedUrl: "https://wordwall.net/tr/embed/af480055f010480683a676e66fa9dda4?themeId=2&templateId=5&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/af480055f010480683a676e66fa9dda4_2",
        type: "Quiz",
        grade: "2"
    },
    {
        id: 6,
        title: "Action Words",
        embedUrl: "https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43",
        type: "Whack-a-Mole",
        grade: "2"
    }
];

export const primarySchoolGames: Game[] = [];

export const grade3Games: Game[] = [
    {
        id: 101,
        title: "Past Tense Verbs",
        embedUrl: "https://wordwall.net/tr/embed/6baae84db07b4ccf9ca1e7d1e0eead89?themeId=21&templateId=69&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/6baae84db07b4ccf9ca1e7d1e0eead89_21",
        type: "Maze Chase",
        grade: "3"
    },
    {
        id: 102,
        title: "Comparatives & Superlatives",
        embedUrl: "https://wordwall.net/tr/embed/4f5e9c2a1d3b4a6e8c0f2d4b6a8e0c2d?themeId=27&templateId=3&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/4f5e9c2a1d3b4a6e8c0f2d4b6a8e0c2d_27",
        type: "Match Up",
        grade: "3"
    },
    {
        id: 103,
        title: "Reading Comprehension Quiz",
        embedUrl: "https://wordwall.net/tr/embed/3a7b5c9d1e2f4a6b8c0d2e4f6a8b0c2d?themeId=44&templateId=5&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/3a7b5c9d1e2f4a6b8c0d2e4f6a8b0c2d_44",
        type: "Quiz",
        grade: "3"
    },
    {
        id: 104,
        title: "Word Families",
        embedUrl: "https://wordwall.net/tr/embed/5d7f9a1b3c4e6a8b0c2d4e6f8a0b2c4d?themeId=22&templateId=30&fontStackId=15",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/5d7f9a1b3c4e6a8b0c2d4e6f8a0b2c4d_22",
        type: "Open Box",
        grade: "3"
    },
    {
        id: 105,
        title: "Irregular Verbs Challenge",
        embedUrl: "https://wordwall.net/tr/embed/7e9a1b3c5d6f8a0b2c4d6e8f0a2b4c6d?themeId=43&templateId=8&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/7e9a1b3c5d6f8a0b2c4d6e8f0a2b4c6d_43",
        type: "Whack-a-Mole",
        grade: "3"
    }
];

export const grade4Games: Game[] = [
    {
        id: 201,
        title: "Sentence Structure Builder",
        embedUrl: "https://wordwall.net/tr/embed/8f0a2b4c6d8e0a2b4c6d8e0f2a4b6c8d?themeId=21&templateId=69&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/8f0a2b4c6d8e0a2b4c6d8e0f2a4b6c8d_21",
        type: "Maze Chase",
        grade: "4"
    },
    {
        id: 202,
        title: "Vocabulary in Context",
        embedUrl: "https://wordwall.net/tr/embed/9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d?themeId=27&templateId=3&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d_27",
        type: "Match Up",
        grade: "4"
    },
    {
        id: 203,
        title: "English Idioms Quiz",
        embedUrl: "https://wordwall.net/tr/embed/0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e?themeId=44&templateId=5&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e_44",
        type: "Quiz",
        grade: "4"
    },
    {
        id: 204,
        title: "Writing Prompts Challenge",
        embedUrl: "https://wordwall.net/tr/embed/1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f?themeId=22&templateId=30&fontStackId=15",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f_22",
        type: "Open Box",
        grade: "4"
    },
    {
        id: 205,
        title: "Synonyms & Antonyms",
        embedUrl: "https://wordwall.net/tr/embed/2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a?themeId=2&templateId=5&fontStackId=0",
        thumbnailUrl: "https://screens.cdn.wordwall.net/200/2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a_2",
        type: "Quiz",
        grade: "4"
    }
];

// Get all games combined
export const getAllGames = (): Game[] => {
    return [...grade2Games, ...grade3Games, ...grade4Games, ...primarySchoolGames];
};
