// Contract addresses from environment variables
export const CONTRACTS = {
  AGENT_REGISTRY: process.env.NEXT_PUBLIC_AGENT_REGISTRY!,
  VALIDATION_REGISTRY: process.env.NEXT_PUBLIC_VALIDATION_REGISTRY!,
  CAMPAIGN_ORACLE: process.env.NEXT_PUBLIC_CAMPAIGN_ORACLE!,
  DEAL_VAULT: process.env.NEXT_PUBLIC_DEAL_VAULT!,
  PACT_MARKET: process.env.NEXT_PUBLIC_PACT_MARKET!,
  USDC: process.env.NEXT_PUBLIC_USDC!,
} as const;

export const NETWORK = {
  NAME: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC || 'https://soroban-testnet.stellar.org',
  HORIZON_URL: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  PASSPHRASE: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
} as const;

export const USDC_DECIMALS = 6; // USDC has 6 decimal places on Stellar
export const STROOPS_PER_XLM = 10_000_000;

export const FRIENDBOT_URL = 'https://friendbot.stellar.org';

// Reputation tiers
export const TIER_LABELS: Record<string, string> = {
  '0': 'Bronze',
  '1': 'Silver',
  '2': 'Gold',
  '3': 'Diamond',
};

export const TIER_COLORS: Record<string, string> = {
  '0': 'badge-gray',
  '1': 'badge-blue',
  '2': 'badge-yellow',
  '3': 'badge-purple',
};

// Deal statuses
export const DEAL_STATUS_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'Active',
  2: 'Delivered',
  3: 'Settled',
  4: 'Cancelled',
  5: 'Slashed',
};

export const DEAL_STATUS_COLORS: Record<number, string> = {
  0: 'badge-gray',
  1: 'badge-blue',
  2: 'badge-yellow',
  3: 'badge-green',
  4: 'badge-pink',
  5: 'badge-pink',
};

export const STELLAR_EXPERT_URL = 'https://stellar.expert/explorer/testnet';
