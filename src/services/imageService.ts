export const imageService = {
  getEducationalImage(seed: string, width: number = 300, height: number = 200): string {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  },

  getUnsplashImage(query: string, width: number = 300, height: number = 200): string {
    return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(query)},education`;
  },

  getPlaceholderImage(width: number = 300, height: number = 200): string {
    return `https://via.placeholder.com/${width}x${height}/4CAF50/white?text=Education+Material`;
  }
};