// src/services/imageService.ts
export const imageService = {
  // 1. Lorem Picsum - Rastgele eğitim görselleri
  getEducationalImage(seed: string, width: number = 300, height: number = 200): string {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  },

  // 2. Unsplash Source - Ücretsiz kaliteli görseller
  getUnsplashImage(query: string, width: number = 300, height: number = 200): string {
    return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(query)},education`;
  },

  // 3. Placeholder - Basit placeholder
  getPlaceholderImage(width: number = 300, height: number = 200): string {
    return `https://via.placeholder.com/${width}x${height}/4CAF50/white?text=Education+Material`;
  }
};