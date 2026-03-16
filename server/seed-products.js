// ============================================================
// MinesMinis Premium Subscription Products Seed Script
// ============================================================
// This script creates the premium subscription products in Stripe.
// Run once: npm run seed-products (from server folder)

import { getUncachableStripeClient } from './stripeClient.js';

async function createProducts() {
  console.log('🚀 Creating MinesMinis Premium subscription products...\n');
  
  const stripe = await getUncachableStripeClient();

  // Check if product already exists
  const existingProducts = await stripe.products.search({ 
    query: "name:'MiniPremium'" 
  });

  if (existingProducts.data.length > 0) {
    console.log('✅ MiniPremium product already exists:', existingProducts.data[0].id);
    
    // List existing prices
    const prices = await stripe.prices.list({ 
      product: existingProducts.data[0].id,
      active: true 
    });
    
    console.log('\n📋 Existing prices:');
    prices.data.forEach(price => {
      const amount = (price.unit_amount / 100).toFixed(2);
      const interval = price.recurring?.interval || 'one-time';
      console.log(`   - ${price.id}: ${amount} ${price.currency.toUpperCase()} / ${interval}`);
    });
    
    return;
  }

  // Create the MiniPremium product
  const product = await stripe.products.create({
    name: 'MiniPremium',
    description: 'MinesMinis Premium Üyelik - Sınırsız İngilizce öğrenme deneyimi! Mimi ile sohbet, eğitici oyunlar, kelime pratikleri ve daha fazlası.',
    images: [], // Add product images URL here later
    metadata: {
      platform: 'minesminis',
      type: 'subscription',
      features: 'unlimited_chat,all_games,vocabulary,daily_challenges,speed_round',
      target_age: '5-8',
    }
  });

  console.log('✅ Product created:', product.id);
  console.log('   Name:', product.name);
  console.log('   Description:', product.description);

  // Create Monthly price (₺99.99/month)
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 9999, // 99.99 TRY in kuruş
    currency: 'try',
    recurring: { interval: 'month' },
    metadata: {
      plan_name: 'monthly',
      display_name: 'Aylık Plan',
    }
  });

  console.log('\n✅ Monthly price created:', monthlyPrice.id);
  console.log('   Amount: ₺99.99/month');

  // Create Yearly price (₺799.99/year - ~33% discount)
  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 79999, // 799.99 TRY in kuruş
    currency: 'try',
    recurring: { interval: 'year' },
    metadata: {
      plan_name: 'yearly',
      display_name: 'Yıllık Plan',
      discount_percent: '33',
    }
  });

  console.log('\n✅ Yearly price created:', yearlyPrice.id);
  console.log('   Amount: ₺799.99/year (33% discount)');

  console.log('\n🎉 All products and prices created successfully!');
  console.log('\n📋 Summary:');
  console.log('   Product ID:', product.id);
  console.log('   Monthly Price ID:', monthlyPrice.id);
  console.log('   Yearly Price ID:', yearlyPrice.id);
}

createProducts()
  .then(() => {
    console.log('\n✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
