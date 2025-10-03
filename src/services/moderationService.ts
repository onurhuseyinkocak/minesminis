// src/services/moderationService.ts
// Basit Türkçe filtre listesi
const TURKISH_BAD_WORDS = [
  'küfür1', 'küfür2', 'argo1', 'argo2', 
  'kötükelime1', 'kötükelime2'
  // Gerçek projede daha kapsamlı liste
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
  },

  async moderatePost(content: string): Promise<boolean> {
    const result = this.checkText(content);
    
    if (!result.isSafe) {
      console.log(`🚨 Moderasyon Uyarısı: "${result.foundWords.join(', ')}" kelimeleri tespit edildi.`);
      // Burada admin emaili gönderebilirsin
      return false;
    }
    
    return true;
  }
};