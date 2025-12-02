// Quick Reply System for Child-Friendly Interactions
// Emoji-based buttons so kids don't always have to type

export interface QuickReply {
    id: string;
    text: string;
    emoji: string;
    value: string;
}

// Base quick replies (always available)
export const BASE_QUICK_REPLIES: QuickReply[] = [
    { id: 'yes', text: 'Yes!', emoji: '👍', value: 'yes' },
    { id: 'no', text: 'No', emoji: '👎', value: 'no' },
    { id: 'idk', text: "I don't know", emoji: '🤷‍♂️', value: "I don't know" },
    { id: 'more', text: 'Tell me more!', emoji: '🤓', value: 'tell me more' },
    { id: 'game', text: 'Play a game!', emoji: '🎮', value: 'play a game' },
    { id: 'joke', text: 'Tell a joke!', emoji: '😂', value: 'tell me a joke' }
];

// Context-specific quick replies
export const CONTEXT_QUICK_REPLIES: { [key: string]: QuickReply[] } = {
    games: [
        { id: 'play', text: "Let's play!", emoji: '🎮', value: "let's play a game" },
        { id: 'how_play', text: 'How to play?', emoji: '❓', value: 'how do I play this' },
        { id: 'fun', text: 'This is fun!', emoji: '🎉', value: 'this is so much fun' }
    ],
    words: [
        { id: 'learn', text: 'Teach me a word!', emoji: '📚', value: 'teach me a new word' },
        { id: 'spell', text: 'Help me spell', emoji: '✏️', value: 'help me spell a word' },
        { id: 'practice', text: 'Let me practice', emoji: '⭐', value: 'I want to practice' }
    ],
    videos: [
        { id: 'watch', text: 'What did I see?', emoji: '👀', value: 'what did I see in the video' },
        { id: 'learn_video', text: 'Learn from video', emoji: '📺', value: 'teach me from this video' }
    ]
};

// Get quick replies for current context
export function getQuickReplies(context?: string): QuickReply[] {
    const base = BASE_QUICK_REPLIES.slice(0, 4); // Use first 4 base replies

    if (context && CONTEXT_QUICK_REPLIES[context]) {
        return [...CONTEXT_QUICK_REPLIES[context], ...base.slice(0, 2)];
    }

    return base;
}

// Special quick replies for mini-games
export const GAME_QUICK_REPLIES: QuickReply[] = [
    { id: 'word_scramble', text: 'Word Scramble', emoji: '🔀', value: 'play word scramble' },
    { id: 'emoji_quiz', text: 'Emoji Quiz', emoji: '😎', value: 'emoji quiz' },
    { id: 'rhyme', text: 'Rhyme Time', emoji: '🎵', value: 'rhyme time' },
    { id: 'story', text: 'Story Builder', emoji: '📖', value: 'story time' },
    { id: 'spelling', text: 'Spelling Bee', emoji: '🐝', value: 'spelling bee' }
];
