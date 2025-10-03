import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

export const analyticsService = {
  trackLogin(method: string) {
    logEvent(analytics, 'login', { method });
  },
  
  trackPageView(pageName: string) {
    logEvent(analytics, 'page_view', { page_name: pageName });
  },
  
  trackFavorite(materialType: string) {
    logEvent(analytics, 'add_to_favorites', { material_type: materialType });
  },
  
  trackShare(postType: string) {
    logEvent(analytics, 'share', { post_type: postType });
  }
};