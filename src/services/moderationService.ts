const TURKISH_BAD_WORDS = [
  'küfür', 'argo', 'kötü', 'kaba'
];

export const moderationService = {
  checkText(text: string): { isSafe: boolean; foundWords: string[] } {
    const lowerText = text.toLowerCase();
    const foundWords = TURKISH_BAD_WORDS.filter(word => 
      lowerText.includes(word)
    );

    return {
      isSafe: foundWords.length === 0,
      foundWords
    };
  }
};