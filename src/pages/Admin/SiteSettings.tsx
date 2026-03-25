/**
 * SiteSettings is deprecated — all site settings are managed via AdminSettings.
 * This component remains as a re-export to avoid breaking any existing imports/routes.
 */
import AdminSettings from './AdminSettings';

const SiteSettings = AdminSettings;

export default SiteSettings;
