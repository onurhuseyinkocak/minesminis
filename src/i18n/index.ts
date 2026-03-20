import en from './en';
import tr from './tr';

export type Lang = 'en' | 'tr';

export const translations: Record<Lang, typeof en> = {
  en,
  tr,
};

export type { TranslationKeys } from './en';
export { en, tr };
