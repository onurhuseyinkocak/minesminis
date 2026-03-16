export interface GlintConfig {
    id: string;
    name: string;
    title: string;
    titleEn: string;
    lore: string;
    loreEn: string;
    story: string;
    storyEn: string;
    trait: string;
    traitEn: string;
    benefit: string;
    benefitEn: string;
    power: string;
    powerEn: string;
    color: string;
    secondaryColor: string;
    accentColor: string;
    glowColor: string;
    type: 'mimi_dragon' | 'nova_fox' | 'bubbles_octo' | 'sparky_alien';
    behaviorPattern: 'harmonic' | 'energetic' | 'zen' | 'erratic';
    element: 'fire' | 'cosmic' | 'water' | 'electric';
    powerMultiplier: {
        words: number;
        listening: number;
        grammar: number;
        stories: number;
        games: number;
    };
}

export const GLINTS: Record<string, GlintConfig> = {
    mimi_dragon: {
        id: 'mimi_dragon',
        name: 'Mimi',
        title: 'Uyum Koruyucusu',
        titleEn: 'Guardian of Harmony',
        lore: 'Echo Vadisinin kadim koruyucusu. Binlerce yil boyunca ogrencilere yol gosteren, bilge ve guclu bir ejderha. Atesi ile karanlik anlari aydinlatir.',
        loreEn: 'Ancient guardian of Echo Valley. A wise and powerful dragon who has guided learners for thousands of years. Its fire illuminates the darkest moments.',
        story: 'Sitenin ana maskotu - her macerada seninle!',
        storyEn: 'The main mascot - always by your side!',
        trait: 'Bilge & Dengeli',
        traitEn: 'Wise & Balanced',
        benefit: 'Tum oyunlardan %20 daha fazla yildiz kazanirsin!',
        benefitEn: 'Earn 20% more stars from all games!',
        power: 'Ejderha Atesi',
        powerEn: 'Dragon Fire',
        color: '#7ED957',
        secondaryColor: '#C5F5A8',
        accentColor: '#FFD93D',
        glowColor: 'rgba(126, 217, 87, 0.4)',
        type: 'mimi_dragon',
        behaviorPattern: 'harmonic',
        element: 'fire',
        powerMultiplier: { words: 1.2, listening: 1.2, grammar: 1.2, stories: 1.2, games: 1.2 },
    },
    nova_fox: {
        id: 'nova_fox',
        name: 'Nova',
        title: 'Yildiz Kasifleri',
        titleEn: 'Star Explorer',
        lore: 'Kozmik ormanlardan gelen gizemli tilki. Yildizlar arasinda ziplar ve her yeni kelimeyi bir yildiz gibi toplar. Super hizli ve enerjik!',
        loreEn: 'A mysterious fox from the cosmic forests. Leaps between stars and collects every new word like a star. Super fast and energetic!',
        story: 'Kelime oyunlarinda 2x puan kazandiran sihir!',
        storyEn: '2x points magic in word games!',
        trait: 'Enerjik & Cesur',
        traitEn: 'Energetic & Brave',
        benefit: 'Kelime oyunlarinda 2 kat puan kazanirsin!',
        benefitEn: 'Earn 2x points in word games!',
        power: 'Kozmik Pati',
        powerEn: 'Cosmic Paw',
        color: '#FF9F1C',
        secondaryColor: '#FFF4E6',
        accentColor: '#E040FB',
        glowColor: 'rgba(255, 159, 28, 0.4)',
        type: 'nova_fox',
        behaviorPattern: 'energetic',
        element: 'cosmic',
        powerMultiplier: { words: 2.0, listening: 1.0, grammar: 1.0, stories: 1.0, games: 1.3 },
    },
    bubbles_octo: {
        id: 'bubbles_octo',
        name: 'Bubbles',
        title: 'Okyanus Sihirbazi',
        titleEn: 'Ocean Sorcerer',
        lore: 'Derin denizlerin en sevimli ahtapotu. 8 kolu ile ayni anda 8 farkli sey ogrenebilir! Muzigi ve sesleri cok sever.',
        loreEn: 'The cutest octopus of the deep seas. Can learn 8 different things at once with 8 arms! Loves music and sounds.',
        story: 'Dinleme ve telaffuzda super guc!',
        storyEn: 'Super power in listening and pronunciation!',
        trait: 'Sakin & Muzikci',
        traitEn: 'Calm & Musical',
        benefit: 'Dinleme oyunlarinda 2x puan ve ekstra sure!',
        benefitEn: '2x points in listening games and extra time!',
        power: 'Ses Dalgasi',
        powerEn: 'Sound Wave',
        color: '#00BCD4',
        secondaryColor: '#E0F7FA',
        accentColor: '#7C4DFF',
        glowColor: 'rgba(0, 188, 212, 0.4)',
        type: 'bubbles_octo',
        behaviorPattern: 'zen',
        element: 'water',
        powerMultiplier: { words: 1.0, listening: 2.0, grammar: 1.0, stories: 1.5, games: 1.0 },
    },
    sparky_alien: {
        id: 'sparky_alien',
        name: 'Sparky',
        title: 'Elektrik Dahisi',
        titleEn: 'Electric Genius',
        lore: 'Uzak bir gezegenden gelen sevimli uzayli. Beyni yildirim hizinda calisir! Gramer kurallarini saniyeler icinde cozer.',
        loreEn: 'A cute alien from a distant planet. Brain works at lightning speed! Solves grammar rules in seconds.',
        story: 'Gramer ve bulmacalarda ipuclari daha hizli!',
        storyEn: 'Faster hints in grammar and puzzles!',
        trait: 'Merakli & Dahi',
        traitEn: 'Curious & Genius',
        benefit: 'Ipuclarina yariya indirmis sure ile ulasirsin!',
        benefitEn: 'Access hints in half the time!',
        power: 'Yildirim Beyin',
        powerEn: 'Lightning Brain',
        color: '#E040FB',
        secondaryColor: '#F3E5F5',
        accentColor: '#FFEB3B',
        glowColor: 'rgba(224, 64, 251, 0.4)',
        type: 'sparky_alien',
        behaviorPattern: 'erratic',
        element: 'electric',
        powerMultiplier: { words: 1.0, listening: 1.0, grammar: 2.0, stories: 1.0, games: 1.5 },
    },
};

export const GLINT_IDS = Object.keys(GLINTS) as Array<keyof typeof GLINTS>;
export const DEFAULT_MASCOT = 'mimi_dragon';
