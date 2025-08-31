import { CurrencyRate } from '../types';

export class CurrencyService {
  /**
   * Get exchange rate between two currencies
   */
  async getRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate> {
    // Mock exchange rates - in real app, this would fetch from external API
    const mockRates: Record<string, Record<string, number>> = {
      'usdt': {
        'vnd': 24500,
        'usd': 1.0,
        'eur': 0.85,
        'gbp': 0.73
      },
      'vnd': {
        'usdt': 1 / 24500,
        'usd': 1 / 24500,
        'eur': 0.85 / 24500,
        'gbp': 0.73 / 24500
      },
      'btc': {
        'usdt': 45000,
        'vnd': 45000 * 24500,
        'usd': 45000,
        'eur': 45000 * 0.85
      },
      'eth': {
        'usdt': 2800,
        'vnd': 2800 * 24500,
        'usd': 2800,
        'eur': 2800 * 0.85
      }
    };

    const from = fromCurrency.toLowerCase();
    const to = toCurrency.toLowerCase();

    // Get rate from mock data
    let rate = mockRates[from]?.[to];

    // If direct rate not found, try reverse rate
    if (rate === undefined) {
      rate = mockRates[to]?.[from];
      if (rate !== undefined) {
        rate = 1 / rate;
      }
    }

    // Default rate if not found
    if (rate === undefined) {
      rate = 1.0; // Default 1:1 rate
    }

    return {
      rate,
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get all available exchange rates for a base currency
   */
  async getRatesForCurrency(baseCurrency: string): Promise<CurrencyRate[]> {
    const currencies = ['usdt', 'vnd', 'btc', 'eth', 'usd', 'eur', 'gbp'];
    const rates = await Promise.all(
      currencies
        .filter(currency => currency !== baseCurrency.toLowerCase())
        .map(currency => this.getRate(baseCurrency, currency))
    );
    return rates;
  }
}

export default new CurrencyService();
