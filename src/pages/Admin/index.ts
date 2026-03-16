// Export all admin components from a single entry point
export { default as AdminLayout } from './AdminLayout';
export { default as AdminDashboard } from './AdminDashboard';
export { default as AdminUsersManager } from './AdminUsersManager';
export { default as AdminContentManager } from './AdminContentManager';
export { default as AdminCurriculumManager } from './AdminCurriculumManager';
export { default as AdminAnalytics } from './AdminAnalytics';
export { default as AdminSettings } from './AdminSettings';

// Legacy exports (kept for backward compatibility, but these pages are now unified)
export { default as GamesManager } from './GamesManager';
export { default as VideosManager } from './VideosManager';
export { default as WordsManager } from './WordsManager';
export { default as WorksheetsManager } from './WorksheetsManager';
export { default as UsersManager } from './UsersManager';
export { default as SiteSettings } from './SiteSettings';
