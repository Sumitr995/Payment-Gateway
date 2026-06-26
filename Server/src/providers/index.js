import MockProvider from './MockProvider.js';
import StripeProvider from './StripeProvider.js';

const providers = {
  mock: MockProvider,
  stripe: StripeProvider,
};

export function getProvider(name) {
  const Provider = providers[name];
  if (!Provider) {
    throw new Error(`Unknown payment provider: "${name}". Available: ${Object.keys(providers).join(', ')}`);
  }
  return new Provider();
}

export function getConfiguredProvider() {
  const name = process.env.PAYMENT_PROVIDER || 'mock';
  return getProvider(name);
}

export function getProviderByName(name) {
  return getProvider(name);
}
