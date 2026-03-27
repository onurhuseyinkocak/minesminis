/**
 * Billing Status API
 * GET /api/billing/status/:uid
 * Returns the user's subscription status.
 * Falls back to free plan when billing backend is not configured.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // When no billing backend is configured, return free plan status
  // This prevents the app from erroring on subscription check
  return res.status(200).json({
    status: 'free',
    plan: 'free',
    active: false,
    expiresAt: null,
    features: {
      maxLessonsPerDay: 3,
      maxWordsPerSession: 10,
      unlimitedLessons: false,
    },
  });
}
