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
export const grade3Games: Game[] = [];
export const grade4Games: Game[] = [];

// Get all games combined
export const getAllGames = (): Game[] => {
    return [...grade2Games, ...grade3Games, ...grade4Games, ...primarySchoolGames];
};
