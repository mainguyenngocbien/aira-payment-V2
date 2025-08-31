import { WalletBalance } from '../types';

export class WalletService {
  /**
   * Get wallet balance for a specific currency
   */
  async getBalance(currency: string): Promise<WalletBalance> {
    // Mock data - in real app, this would fetch from blockchain or database
    const mockBalances: Record<string, number> = {
      'usdt': 123.45,
      'btc': 0.001234,
      'eth': 0.045678,
      'vnd': 3024567.89
    };

    const balance = mockBalances[currency.toLowerCase()] || 0;

    return {
      balance,
      currency: currency.toUpperCase(),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get all wallet balances
   */
  async getAllBalances(): Promise<WalletBalance[]> {
    const currencies = ['usdt', 'btc', 'eth', 'vnd'];
    const balances = await Promise.all(
      currencies.map(currency => this.getBalance(currency))
    );
    return balances;
  }
}

export default new WalletService();
