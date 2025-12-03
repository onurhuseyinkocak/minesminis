import { stripeStorage } from './stripeStorage.js';
import { getUncachableStripeClient } from './stripeClient.js';

export class StripeService {
  async createCustomer(email, metadata = {}) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata,
    });
  }

  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  }

  async createCustomerPortalSession(customerId, returnUrl) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getProduct(productId) {
    return await stripeStorage.getProduct(productId);
  }

  async getSubscription(subscriptionId) {
    return await stripeStorage.getSubscription(subscriptionId);
  }

  async checkPremiumStatus(email) {
    const customer = await stripeStorage.getCustomerByEmail(email);
    if (!customer) {
      return { isPremium: false, subscription: null };
    }

    const subscription = await stripeStorage.getActiveSubscriptionByCustomer(customer.id);
    return {
      isPremium: !!subscription,
      subscription,
      customerId: customer.id
    };
  }
}

export const stripeService = new StripeService();
