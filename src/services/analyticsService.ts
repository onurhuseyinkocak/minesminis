export const analyticsService = {
  trackLogin(method: string) {
    console.log('Analytics: login', { method });
  },

  trackPageView(pageName: string) {
    console.log('Analytics: page_view', { page_name: pageName });
  },

  trackFavorite(materialType: string) {
    console.log('Analytics: add_to_favorites', { material_type: materialType });
  },

  trackShare(postType: string) {
    console.log('Analytics: share', { post_type: postType });
  },
};
