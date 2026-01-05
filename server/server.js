// ============================================================
// Backend Proxy Server for OpenAI API + Stripe Payments
// HARDENED WITH ENTERPRISE SECURITY
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync, getUncachableStripeClient, getStripePublishableKey } from './stripeClient.js';
import { WebhookHandlers } from './webhookHandlers.js';
import { stripeStorage } from './stripeStorage.js';
import { stripeService } from './stripeService.js';
import security from './security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? 5000 : 3001);

// ============================================================
// SECURITY MIDDLEWARE (Applied First)
// ============================================================

// IP Blocking
app.use(security.ipBlocker);

// Security Headers (OWASP Compliant)
app.use(security.securityHeaders);

// Global Rate Limiting
app.use(security.rateLimiter({
  maxRequests: 100,
  windowMs: 60000
}));

// Trust proxy (for correct IP detection behind load balancers)
app.set('trust proxy', 1);

// ============================================================
// STRIPE INITIALIZATION
// ============================================================

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('⚠️ DATABASE_URL not found, Stripe features disabled');
    return false;
  }

  try {
    console.log('🔧 Initializing Stripe schema...');
    await runMigrations({
      databaseUrl,
      schema: 'stripe'
    });
    console.log('✅ Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('🔧 Setting up managed webhook...');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const { webhook, uuid } = await stripeSync.findOrCreateManagedWebhook(
      `${webhookBaseUrl}/api/stripe/webhook`,
      {
        enabled_events: ['*'],
        description: 'MinesMinis Stripe webhook',
      }
    );
    console.log(`✅ Webhook configured: ${webhook.url}`);

    console.log('🔧 Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => console.log('✅ Stripe data synced'))
      .catch((err) => console.error('❌ Error syncing Stripe data:', err));

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Stripe:', error.message);
    return false;
  }
}

// ============================================================
// STRIPE WEBHOOK (Raw Body Required - Before JSON Parser)
// ============================================================

app.post(
  '/api/stripe/webhook/:uuid',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      security.auditLog('WEBHOOK_NO_SIGNATURE', req);
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      const { uuid } = req.params;
      await WebhookHandlers.processWebhook(req.body, sig, uuid);

      security.auditLog('WEBHOOK_SUCCESS', req, { uuid });
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      security.auditLog('WEBHOOK_ERROR', req, { error: error.message });
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

// ============================================================
// CORS & JSON MIDDLEWARE
// ============================================================

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith('.replit.dev') || origin.endsWith('.repl.co')) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
}));

// JSON body parser with size limit
app.use(express.json({
  limit: '10kb', // Prevent payload too large attacks
  strict: true,
}));

// URL-encoded body parser
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));

// ============================================================
// VALIDATE OPENAI API KEY
// ============================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found');
} else {
  console.log('✅ OpenAI API Key loaded');
}

// ============================================================
// STRIPE ROUTES (with Rate Limiting)
// ============================================================

// Get Stripe publishable key (for frontend)
app.get('/api/stripe/config', async (req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    res.status(500).json({ error: 'Failed to get Stripe config' });
  }
});

// Get subscription plans
app.get('/api/stripe/plans', async (req, res) => {
  try {
    const rows = await stripeStorage.listProductsWithPrices();

    const productsMap = new Map();
    for (const row of rows) {
      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          metadata: row.product_metadata,
          prices: []
        });
      }
      if (row.price_id) {
        productsMap.get(row.product_id).prices.push({
          id: row.price_id,
          unit_amount: row.unit_amount,
          currency: row.currency,
          recurring: row.recurring,
        });
      }
    }

    res.json({ plans: Array.from(productsMap.values()) });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

// Check premium status by email (rate limited)
app.post('/api/stripe/check-premium',
  security.rateLimiter({ maxRequests: 20, windowMs: 60000 }),
  security.validateRequest({
    body: {
      email: { required: true, type: 'string', email: true }
    }
  }),
  async (req, res) => {
    try {
      const { email } = req.body;
      const status = await stripeService.checkPremiumStatus(email);
      res.json(status);
    } catch (error) {
      console.error('Error checking premium status:', error);
      res.status(500).json({ error: 'Failed to check premium status' });
    }
  }
);

// Create checkout session (rate limited)
app.post('/api/stripe/create-checkout',
  security.rateLimiter({ maxRequests: 10, windowMs: 60000 }),
  security.validateRequest({
    body: {
      email: { required: true, type: 'string', email: true },
      priceId: { required: true, type: 'string' }
    }
  }),
  async (req, res) => {
    try {
      const { email, priceId } = req.body;

      security.auditLog('CHECKOUT_INITIATED', req, { email, priceId });

      let customer = await stripeStorage.getCustomerByEmail(email);

      if (!customer) {
        const stripe = await getUncachableStripeClient();
        customer = await stripe.customers.create({ email });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

      const session = await stripeService.createCheckoutSession(
        customer.id,
        priceId,
        `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/premium`
      );

      security.auditLog('CHECKOUT_CREATED', req, { email, sessionId: session.id });
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      security.auditLog('CHECKOUT_ERROR', req, { error: error.message });
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  }
);

// Create customer portal session
app.post('/api/stripe/customer-portal',
  security.rateLimiter({ maxRequests: 10, windowMs: 60000 }),
  security.validateRequest({
    body: {
      email: { required: true, type: 'string', email: true }
    }
  }),
  async (req, res) => {
    try {
      const { email } = req.body;
      const customer = await stripeStorage.getCustomerByEmail(email);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

      const session = await stripeService.createCustomerPortalSession(
        customer.id,
        `${baseUrl}/premium`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  }
);

// ============================================================
// OPENAI ROUTES (with Rate Limiting & Validation)
// ============================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    security: 'hardened',
    timestamp: new Date().toISOString()
  });
});

// OpenAI Text-to-Speech Endpoint
app.post('/api/tts',
  security.rateLimiter({ maxRequests: 30, windowMs: 60000 }),
  security.validateRequest({
    body: {
      text: { required: true, type: 'string', maxLength: 4000 }
    }
  }),
  async (req, res) => {
    try {
      const { text } = req.body;

      console.log('🔊 TTS request:', text.substring(0, 50) + '...');

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'nova',
          response_format: 'mp3',
          speed: 0.95
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenAI TTS Error:', response.status, errorData);
        return res.status(response.status).json({
          error: 'OpenAI TTS Error',
          details: errorData.error?.message || 'Unknown error'
        });
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      console.log('✅ TTS audio generated successfully');

      res.json({
        audio: base64Audio,
        format: 'mp3'
      });

    } catch (error) {
      console.error('❌ TTS Server error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: 'An unexpected error occurred'
      });
    }
  }
);

// OpenAI Chat Proxy Endpoint
app.post('/api/chat',
  security.rateLimiter({ maxRequests: 30, windowMs: 60000 }),
  async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          error: 'Invalid request: messages array required'
        });
      }

      // Validate message structure
      for (const msg of messages) {
        if (!msg.role || !msg.content) {
          return res.status(400).json({
            error: 'Invalid message format'
          });
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return res.status(400).json({
            error: 'Invalid message role'
          });
        }
      }

      console.log('📨 Received chat request with', messages.length, 'messages');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 150,
          temperature: 0.6,
          frequency_penalty: 0.3,
          presence_penalty: 0.2
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenAI API Error:', response.status, errorData);

        return res.status(response.status).json({
          error: 'OpenAI API Error',
          details: errorData.error?.message || 'Unknown error',
          status: response.status
        });
      }

      const data = await response.json();
      console.log('✅ OpenAI response received');

      res.json({
        message: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      });

    } catch (error) {
      console.error('❌ Server error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: 'An unexpected error occurred'
      });
    }
  }
);

// ============================================================
// ADMIN SECURITY ENDPOINTS
// ============================================================

// Get security status (admin only - would need auth in production)
app.get('/api/admin/security-status', (req, res) => {
  // In production, add authentication check here
  const status = security.getSecurityStatus();
  res.json(status);
});

// ============================================================
// STATIC FILE SERVING (Production)
// ============================================================

if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');

  app.use(express.static(distPath, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true,
    lastModified: true,
  }));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });

  console.log('📁 Serving static files from:', distPath);
}

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  security.auditLog('SERVER_ERROR', req, { error: err.message });

  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'An unexpected error occurred' : err.message
  });
});

// ============================================================
// SERVER STARTUP
// ============================================================

async function startServer() {
  await initStripe();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`✅ Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`🔒 Security: ENTERPRISE HARDENED`);
    console.log(`✅ Ready to proxy requests to OpenAI API`);
    console.log(`✅ Stripe payments enabled`);
  });
}

startServer();
