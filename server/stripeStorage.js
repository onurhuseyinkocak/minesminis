import pg from 'pg';

const { Pool } = pg;

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return pool;
}

export class StripeStorage {
  async getProduct(productId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.products WHERE id = $1',
      [productId]
    );
    return result.rows[0] || null;
  }

  async listProducts(active = true, limit = 20, offset = 0) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.products WHERE active = $1 LIMIT $2 OFFSET $3',
      [active, limit, offset]
    );
    return result.rows;
  }

  async listProductsWithPrices(active = true, limit = 20, offset = 0) {
    const pool = getPool();
    const result = await pool.query(`
      WITH paginated_products AS (
        SELECT id, name, description, metadata, active
        FROM stripe.products
        WHERE active = $1
        ORDER BY id
        LIMIT $2 OFFSET $3
      )
      SELECT 
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.active as product_active,
        p.metadata as product_metadata,
        pr.id as price_id,
        pr.unit_amount,
        pr.currency,
        pr.recurring,
        pr.active as price_active,
        pr.metadata as price_metadata
      FROM paginated_products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      ORDER BY p.id, pr.unit_amount
    `, [active, limit, offset]);
    return result.rows;
  }

  async getPrice(priceId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.prices WHERE id = $1',
      [priceId]
    );
    return result.rows[0] || null;
  }

  async listPrices(active = true, limit = 20, offset = 0) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.prices WHERE active = $1 LIMIT $2 OFFSET $3',
      [active, limit, offset]
    );
    return result.rows;
  }

  async getPricesForProduct(productId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.prices WHERE product = $1 AND active = true',
      [productId]
    );
    return result.rows;
  }

  async getSubscription(subscriptionId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.subscriptions WHERE id = $1',
      [subscriptionId]
    );
    return result.rows[0] || null;
  }

  async getCustomerByEmail(email) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM stripe.customers WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows[0] || null;
  }

  async getActiveSubscriptionByCustomer(customerId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM stripe.subscriptions 
       WHERE customer = $1 AND status IN ('active', 'trialing')
       LIMIT 1`,
      [customerId]
    );
    return result.rows[0] || null;
  }
}

export const stripeStorage = new StripeStorage();
