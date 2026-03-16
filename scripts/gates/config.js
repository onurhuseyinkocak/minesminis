/**
 * Quality Gate Configuration - Million-Dollar App Standards
 * MinesMinis - Uçtan uca kalite kontrol eşikleri ve kurallar
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

export const PATHS = {
  root,
  src: path.join(root, 'src'),
  server: path.join(root, 'server'),
  public: path.join(root, 'public'),
  scripts: path.join(root, 'scripts'),
  gates: path.join(root, 'scripts/gates'),
  // CSS / theme
  indexCss: path.join(root, 'src/index.css'),
  darkTheme: path.join(root, 'src/styles/dark-theme.css'),
  appCss: path.join(root, 'src/App.css'),
};

/** ESLint: max errors allowed (0 = fail on any) */
export const LINT_MAX_ERRORS = 0;
export const LINT_MAX_WARNINGS = 50;

/** TypeScript: strict, no emit */
export const TSC_STRICT = true;

/** Build: must succeed */
export const BUILD_MUST_SUCCEED = true;

/** UI/UX Gate */
export const UI_RULES = {
  /** Tüm renkler CSS variable olmalı (hex/rgb hardcode yasak - belirli istisnalar hariç) */
  requireColorVars: true,
  /** Light ve dark tema aynı variable setine sahip olmalı */
  themeVarParity: true,
  /** Minimum kontrast oranı (WCAG AA ~4.5:1 metin) */
  minContrastRatio: 4.5,
  /** Buton min height (px) */
  buttonMinHeight: 40,
  /** Body'de mutlaka font-family tanımlı olmalı */
  requireBodyFont: true,
  /** px yerine rem kullanımı teşvik (zorunlu değil ama uyarı) */
  preferRem: 'warn',
  /** Z-index kaosu: max 3 farklı z-index değeri önerilir (uyarı) */
  zIndexChaosThreshold: 15,
};

/** DB Gate */
export const DB_RULES = {
  /** RLS (Row Level Security) aktif tablolarda zorunlu */
  requireRLSOnPublicTables: true,
  /** Hassas sütunlar (password, token) encrypt/hash kontrolü */
  sensitiveColumns: ['password', 'token', 'secret', 'api_key', 'private_key'],
};

/** Security Gate */
export const SECURITY_RULES = {
  /** .env içinde kritik anahtarlar hardcode olmamalı (kod taraması) */
  noHardcodedSecrets: true,
  /** CORS wildcard (*) production'da yasak */
  noCorsWildcardInProd: true,
  /** Rate limiting zorunlu API'lerde */
  rateLimitRequired: ['/api/tts', '/api/stripe', '/api/blog', '/api/story'],
};

/** Payment Gate - Stripe + Türkiye Sanal POS uyumluluk */
export const PAYMENT_RULES = {
  /** Tutar her zaman en küçük birimde (kuruş/sent) */
  amountInSmallestUnit: true,
  /** Webhook signature doğrulama zorunlu */
  webhookSignatureRequired: true,
  /** Idempotency key kritik işlemlerde */
  idempotencyRecommended: true,
  /** 3D Secure / Strong Customer Authentication (SCA) uyumu */
  scaRequired: true,
  /** Türk Lirası (TRY) desteği */
  tryCurrencySupport: true,
};

export const GATE_IDS = [
  'lint',
  'typecheck',
  'build',
  'ui-ux',
  'db',
  'security',
  'payment',
  'syntax',
];
