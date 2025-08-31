import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface WalletInfo {
  email: string;
  mnemonic: string;
  evmWallet: string;
  celestiaWallet: string;
  solanaWallet: string;
  aptosWallet: string;
  suiWallet: string;
  airaId?: string;
}

export class WalletManagerService {
  private databasePath: string;

  constructor() {
    this.databasePath = path.join(__dirname, '../database.txt');
    this.ensureDatabaseExists();
  }

  private ensureDatabaseExists(): void {
    const dir = path.dirname(this.databasePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.databasePath)) {
      fs.writeFileSync(this.databasePath, '');
    }
  }

  private generateWallets(): { 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId: string 
  } {
    // Generate a mnemonic phrase (12 words)
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident',
      'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actual', 'adapt',
      'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid',
      'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol'
    ];
    
    const mnemonic = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
    
    // Generate addresses for different blockchains
    const evmWallet = '0x' + crypto.createHash('sha256').update(mnemonic + 'evm').digest('hex').slice(0, 40);
    const celestiaWallet = 'celestia1' + crypto.createHash('sha256').update(mnemonic + 'celestia').digest('hex').slice(0, 38);
    const solanaWallet = crypto.createHash('sha256').update(mnemonic + 'solana').digest('hex').slice(0, 44);
    const aptosWallet = '0x' + crypto.createHash('sha256').update(mnemonic + 'aptos').digest('hex').slice(0, 64);
    const suiWallet = '0x' + crypto.createHash('sha256').update(mnemonic + 'sui').digest('hex').slice(0, 64);
    
    // Generate Aira ID (format: AIRA + 12 random alphanumeric characters = 16 total)
    const airaId = 'AIRA' + crypto.randomBytes(6).toString('hex').toUpperCase();
    
    return { evmWallet, celestiaWallet, solanaWallet, aptosWallet, suiWallet, mnemonic, airaId };
  }

  private readDatabase(): WalletInfo[] {
    try {
      const content = fs.readFileSync(this.databasePath, 'utf8');
      if (!content.trim()) return [];
      
      return content.split('\n')
        .filter(line => line.trim())
        .map(line => {
          // Parse line with proper handling of quoted mnemonic
          const emailMatch = line.match(/^([^\s]+)\s+"([^"]+)"\s+(.+)$/);
          if (!emailMatch) {
            console.error('Invalid line format:', line);
            return null;
          }
          
          const email = emailMatch[1];
          const mnemonic = emailMatch[2];
          const remainingParts = emailMatch[3]?.split(' ') || [];
          
          if (remainingParts.length < 6) {
            console.error('Insufficient parts in line:', line);
            return null;
          }
          
          return { 
            email: email, 
            mnemonic: mnemonic, 
            evmWallet: remainingParts[0] || '',
            celestiaWallet: remainingParts[1] || '',
            solanaWallet: remainingParts[2] || '',
            aptosWallet: remainingParts[3] || '',
            suiWallet: remainingParts[4] || '',
            airaId: remainingParts[5] || ''
          };
        })
        .filter(wallet => wallet !== null) as WalletInfo[];
    } catch (error) {
      console.error('Error reading database:', error);
      return [];
    }
  }

  private writeDatabase(wallets: WalletInfo[]): void {
    try {
      const content = wallets.map(w => 
        `${w.email} "${w.mnemonic}" ${w.evmWallet} ${w.celestiaWallet} ${w.solanaWallet} ${w.aptosWallet} ${w.suiWallet} ${w.airaId || ''}`
      ).join('\n');
      fs.writeFileSync(this.databasePath, content);
    } catch (error) {
      console.error('Error writing database:', error);
      throw new Error('Failed to write to database');
    }
  }

  public getOrCreateWallet(email: string): { 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId: string 
  } {
    const wallets = this.readDatabase();
    const existingWallet = wallets.find(w => w.email === email);
    
    if (existingWallet) {
      return {
        evmWallet: existingWallet.evmWallet,
        celestiaWallet: existingWallet.celestiaWallet,
        solanaWallet: existingWallet.solanaWallet,
        aptosWallet: existingWallet.aptosWallet,
        suiWallet: existingWallet.suiWallet,
        mnemonic: existingWallet.mnemonic,
        airaId: existingWallet.airaId || ''
      };
    }

    // Create new wallets
    const { evmWallet, celestiaWallet, solanaWallet, aptosWallet, suiWallet, mnemonic, airaId } = this.generateWallets();
    const newWallet: WalletInfo = {
      email,
      evmWallet,
      celestiaWallet,
      solanaWallet,
      aptosWallet,
      suiWallet,
      mnemonic,
      airaId
    };

    wallets.push(newWallet);
    this.writeDatabase(wallets);

    return {
      evmWallet,
      celestiaWallet,
      solanaWallet,
      aptosWallet,
      suiWallet,
      mnemonic,
      airaId
    };
  }

  public getWalletByEmail(email: string): { 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId: string 
  } | null {
    const wallets = this.readDatabase();
    const wallet = wallets.find(w => w.email === email);
    
    if (!wallet) return null;
    
    return {
      evmWallet: wallet.evmWallet,
      celestiaWallet: wallet.celestiaWallet,
      solanaWallet: wallet.solanaWallet,
      aptosWallet: wallet.aptosWallet,
      suiWallet: wallet.suiWallet,
      mnemonic: wallet.mnemonic,
      airaId: wallet.airaId || ''
    };
  }

  public getAllWallets(): WalletInfo[] {
    return this.readDatabase();
  }

  public deleteWallet(email: string): boolean {
    const wallets = this.readDatabase();
    const initialLength = wallets.length;
    const filteredWallets = wallets.filter(w => w.email !== email);
    
    if (filteredWallets.length === initialLength) {
      return false; // Wallet not found
    }
    
    this.writeDatabase(filteredWallets);
    return true;
  }
}

export default new WalletManagerService();
