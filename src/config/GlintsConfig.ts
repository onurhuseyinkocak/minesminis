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
    type: 'mimi_cat' | 'mimi_dragon' | 'nova_fox' | 'bubbles_octo' | 'sparky_alien';
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
    mimi_cat: {
        id: 'mimi_cat',
        name: 'Mimi',
        title: 'Uyum Koruyucusu',
        titleEn: 'Guardian of Harmony',
        lore: 'Echo Vadisinin sevimli kedi koruyucusu. Tatlı patileriyle öğrencilere rehberlik eden, meraklı ve zeki bir kedi. Neşesi ile öğrenmeyi eğlenceye dönüştürür.',
        loreEn: 'The adorable cat guardian of Echo Valley. A curious and clever cat who guides learners with gentle paws. Turns learning into fun with boundless joy.',
        story: 'Sitenin ana maskotu - her macerada seninle!',
        storyEn: 'The main mascot - always by your side!',
        trait: 'Meraklı & Sevimli',
        traitEn: 'Curious & Adorable',
        benefit: 'Tüm oyunlardan %20 daha fazla yıldız kazanırsın!',
        benefitEn: 'Earn 20% more stars from all games!',
        power: 'Kedi Patisi',
        powerEn: 'Cat Paw',
        color: '#FF6B35',
        secondaryColor: '#FFF4EE',
        accentColor: '#FFD93D',
        glowColor: 'rgba(255,107,53,0.4)',
        type: 'mimi_cat',
        behaviorPattern: 'harmonic',
        element: 'fire',
        powerMultiplier: { words: 1.2, listening: 1.2, grammar: 1.2, stories: 1.2, games: 1.2 },
    },
    mimi_dragon: {
        id: 'mimi_dragon',
        name: 'Mimi',
        title: 'Uyum Koruyucusu',
        titleEn: 'Guardian of Harmony',
        lore: 'Echo Vadisinin kadim koruyucusu. Binlerce yıl boyunca öğrencilere yol gösteren, bilge ve güçlü bir ejderha. Ateşi ile karanlık anları aydınlatır.',
        loreEn: 'Ancient guardian of Echo Valley. A wise and powerful dragon who has guided learners for thousands of years. Its fire illuminates the darkest moments.',
        story: 'Sitenin ana maskotu - her macerada seninle!',
        storyEn: 'The main mascot - always by your side!',
        trait: 'Bilge & Dengeli',
        traitEn: 'Wise & Balanced',
        benefit: 'Tüm oyunlardan %20 daha fazla yıldız kazanırsın!',
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
        title: 'Yıldız Kaşifleri',
        titleEn: 'Star Explorer',
        lore: 'Kozmik ormanlardan gelen gizemli tilki. Yıldızlar arasında zıplar ve her yeni kelimeyi bir yıldız gibi toplar. Süper hızlı ve enerjik!',
        loreEn: 'A mysterious fox from the cosmic forests. Leaps between stars and collects every new word like a star. Super fast and energetic!',
        story: 'Kelime oyunlarında 2x puan kazandıran sihir!',
        storyEn: '2x points magic in word games!',
        trait: 'Enerjik & Cesur',
        traitEn: 'Energetic & Brave',
        benefit: 'Kelime oyunlarında 2 kat puan kazanırsın!',
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
        title: 'Okyanus Sihirbazı',
        titleEn: 'Ocean Sorcerer',
        lore: 'Derin denizlerin en sevimli ahtapotu. 8 kolu ile aynı anda 8 farklı şey öğrenebilir! Müziği ve sesleri çok sever.',
        loreEn: 'The cutest octopus of the deep seas. Can learn 8 different things at once with 8 arms! Loves music and sounds.',
        story: 'Dinleme ve telaffuzda süper güç!',
        storyEn: 'Super power in listening and pronunciation!',
        trait: 'Sakin & Müzikçi',
        traitEn: 'Calm & Musical',
        benefit: 'Dinleme oyunlarında 2x puan ve ekstra süre!',
        benefitEn: '2x points in listening games and extra time!',
        power: 'Ses Dalgası',
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
        lore: 'Uzak bir gezegenden gelen sevimli uzaylı. Beyni yıldırım hızında çalışır! Gramer kurallarını saniyeler içinde çözer.',
        loreEn: 'A cute alien from a distant planet. Brain works at lightning speed! Solves grammar rules in seconds.',
        story: 'Gramer ve bulmacalarda ipuçları daha hızlı!',
        storyEn: 'Faster hints in grammar and puzzles!',
        trait: 'Meraklı & Dahi',
        traitEn: 'Curious & Genius',
        benefit: 'İpuçlarına yarıya indirilmiş süre ile ulaşırsın!',
        benefitEn: 'Access hints in half the time!',
        power: 'Yıldırım Beyin',
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
export const DEFAULT_MASCOT = 'mimi_cat';
