// Dynamic Quick Reply System for Child-Friendly Interactions
// Generates contextual suggestions based on conversation
import { shuffleArray } from '../utils/arrayUtils';

export interface QuickReply {
    id: string;
    text: string;
    value: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const LEARNING_PROMPTS: QuickReply[] = [
    { id: 'colors', text: 'Teach me colors! 🌈', value: 'Can you teach me colors in English?' },
    { id: 'animals', text: 'Animal names! 🐾', value: 'What are some animal names in English?' },
    { id: 'numbers', text: 'Count with me! 🔢', value: 'Can we count numbers together?' },
    { id: 'fruits', text: 'Yummy fruits! 🍎', value: 'Teach me fruit names in English!' },
    { id: 'family', text: 'Family words! 👨‍👩‍👧', value: 'How do I say family members in English?' },
    { id: 'body', text: 'Body parts! 🖐️', value: 'Can you teach me body parts?' },
    { id: 'clothes', text: 'What I wear! 👕', value: 'Teach me clothes in English!' },
    { id: 'food', text: 'Yummy food! 🍕', value: 'What are food words in English?' },
    { id: 'weather', text: 'Weather words! ☀️', value: 'How do I talk about weather in English?' },
    { id: 'days', text: 'Days of week! 📅', value: 'What are the days of the week?' },
    { id: 'greetings', text: 'Say hello! 👋', value: 'How do I greet people in English?' },
    { id: 'feelings', text: 'How I feel! 😊', value: 'Teach me feeling words in English!' },
];

const FUN_PROMPTS: QuickReply[] = [
    { id: 'joke', text: 'Tell me a joke! 😂', value: 'Tell me a funny joke!' },
    { id: 'game', text: "Let's play! 🎮", value: 'Can we play a word game?' },
    { id: 'riddle', text: 'A riddle please! 🤔', value: 'Give me a fun riddle!' },
    { id: 'story', text: 'Tell a story! 📖', value: 'Can you tell me a short story?' },
    { id: 'song', text: 'Sing a song! 🎵', value: 'Do you know any English songs for kids?' },
    { id: 'quiz', text: 'Quiz me! ⭐', value: 'Give me a fun quiz question!' },
    { id: 'tongue', text: 'Tongue twister! 👅', value: 'Say a fun tongue twister!' },
    { id: 'guess', text: 'Guessing game! 🎯', value: 'Let\'s play a guessing game!' },
];

const PRACTICE_PROMPTS: QuickReply[] = [
    { id: 'spell', text: 'Help me spell! ✏️', value: 'Can you help me practice spelling?' },
    { id: 'sentence', text: 'Make a sentence! 📝', value: 'Help me make a sentence in English!' },
    { id: 'translate', text: 'What does it mean? 🔤', value: 'How do I say this in English?' },
    { id: 'pronounce', text: 'How to say it? 🗣️', value: 'How do I pronounce this word?' },
    { id: 'opposite', text: 'Opposites! ↔️', value: 'Teach me opposite words!' },
    { id: 'rhyme', text: 'Words that rhyme! 🎶', value: 'What words rhyme together?' },
];

const CONVERSATION_PROMPTS: QuickReply[] = [
    { id: 'more', text: 'Tell me more! 🤓', value: 'Tell me more about that!' },
    { id: 'why', text: 'But why? 🤷', value: 'Why is that?' },
    { id: 'another', text: 'One more! ✨', value: 'Can you give me another example?' },
    { id: 'cool', text: 'That\'s cool! 😎', value: 'Wow that\'s really cool!' },
    { id: 'hard', text: 'Too hard! 😅', value: 'That\'s a bit hard for me!' },
    { id: 'easy', text: 'Too easy! 💪', value: 'That was easy! Give me something harder!' },
    { id: 'again', text: 'Say again? 👂', value: 'Can you say that again please?' },
    { id: 'thanks', text: 'Thank you! 💖', value: 'Thank you Mimi!' },
];

const STARTER_PROMPTS: QuickReply[] = [
    { id: 'start_colors', text: 'Learn colors! 🌈', value: 'I want to learn about colors!' },
    { id: 'start_game', text: 'Play a game! 🎮', value: 'Can we play a fun game?' },
    { id: 'start_joke', text: 'Make me laugh! 😂', value: 'Tell me something funny!' },
    { id: 'start_animal', text: 'Animals please! 🐱', value: 'Teach me animal names!' },
];

function detectTopic(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    if (/color|renk|red|blue|green|yellow|purple|orange|pink|mavi|kırmızı|yeşil|sarı/.test(lowerText)) return 'colors';
    if (/animal|hayvan|cat|dog|bird|fish|lion|elephant|kedi|köpek|kuş/.test(lowerText)) return 'animals';
    if (/number|sayı|count|one|two|three|four|five|bir|iki|üç/.test(lowerText)) return 'numbers';
    if (/fruit|meyve|apple|banana|orange|elma|muz|portakal/.test(lowerText)) return 'fruits';
    if (/family|aile|mother|father|sister|brother|anne|baba/.test(lowerText)) return 'family';
    if (/body|vücut|hand|foot|head|eye|ear|el|ayak|kafa|göz/.test(lowerText)) return 'body';
    if (/game|oyun|play|oyna/.test(lowerText)) return 'games';
    if (/joke|şaka|funny|komik|laugh/.test(lowerText)) return 'jokes';
    if (/song|şarkı|sing|söyle|music|müzik/.test(lowerText)) return 'songs';
    if (/story|hikaye|tell me a story/.test(lowerText)) return 'stories';
    if (/spell|spelling|hece|yazım/.test(lowerText)) return 'spelling';
    if (/weather|hava|sun|rain|cloud|güneş|yağmur/.test(lowerText)) return 'weather';
    
    return null;
}


export function generateDynamicQuickReplies(
    messages: ChatMessage[],
    usedReplies: Set<string> = new Set()
): QuickReply[] {
    if (messages.length <= 1) {
        return shuffleArray(STARTER_PROMPTS).slice(0, 4);
    }

    const lastAssistant = messages.filter(m => m.role === 'assistant').pop()?.content || '';
    const lastUser = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    const topic = detectTopic(lastAssistant) || detectTopic(lastUser);
    
    const replies: QuickReply[] = [];
    const availablePrompts: QuickReply[] = [];

    if (lastAssistant.includes('?')) {
        const questionReplies = shuffleArray(CONVERSATION_PROMPTS).slice(0, 2);
        replies.push(...questionReplies);
    }

    if (topic === 'colors' || topic === 'animals' || topic === 'numbers' || topic === 'fruits') {
        availablePrompts.push(...LEARNING_PROMPTS.filter(p => p.id !== topic));
        availablePrompts.push(...PRACTICE_PROMPTS);
    } else if (topic === 'games' || topic === 'jokes') {
        availablePrompts.push(...FUN_PROMPTS.filter(p => p.id !== (topic === 'games' ? 'game' : 'joke')));
        availablePrompts.push(...LEARNING_PROMPTS);
    } else if (topic === 'spelling') {
        availablePrompts.push(...PRACTICE_PROMPTS.filter(p => p.id !== 'spell'));
        availablePrompts.push(...LEARNING_PROMPTS);
    } else {
        availablePrompts.push(...LEARNING_PROMPTS);
        availablePrompts.push(...FUN_PROMPTS);
        availablePrompts.push(...PRACTICE_PROMPTS);
    }

    const filteredPrompts = availablePrompts.filter(p => !usedReplies.has(p.id));
    const shuffled = shuffleArray(filteredPrompts.length > 0 ? filteredPrompts : availablePrompts);
    
    const needed = 4 - replies.length;
    replies.push(...shuffled.slice(0, needed));

    return replies.slice(0, 4);
}

export function getStarterReplies(): QuickReply[] {
    return shuffleArray(STARTER_PROMPTS).slice(0, 4);
}
