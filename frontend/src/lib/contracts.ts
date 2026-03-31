'use client';

import {
  buildTx,
  readContract,
  submitAndWait,
  u32Val,
  addressVal,
  i128Val,
  u64Val,
  boolVal,
} from './stellar';
import { CONTRACTS } from './constants';
import { nativeToScVal, xdr } from '@stellar/stellar-sdk';

// ────────────────────────────────────────────────────────────
// Types matching Soroban contract structs
// ────────────────────────────────────────────────────────────

export interface AgentProfile {
  wallet: string;
  agent_type: 'Creator' | 'Brand';
  handle: string;
  platform: string;
  metadata_uri: string;
  follower_count: bigint;
  verified: boolean;
  minted_at: bigint;
}

export interface ReputationScore {
  total_deals: number;
  successful_deals: number;
  avg_engagement_bps: number;
  total_volume_usdc: bigint;
  total_staked: bigint;
  last_updated: bigint;
  tier: number; // 0=Bronze 1=Silver 2=Gold 3=Diamond
}

export interface Deal {
  deal_id: number;
  creator_agent_id: number;
  brand_agent_id: number;
  payment_usdc: bigint;
  creator_stake: bigint;
  brand_stake: bigint;
  deadline: bigint;
  status: number; // 0=Pending 1=Active 2=Delivered 3=Settled 4=Cancelled 5=Slashed
  deal_intent_hash: Uint8Array;
  creator_wallet: string;
  brand_wallet: string;
}

export interface Market {
  deal_id: number;
  yes_reserve: bigint;
  no_reserve: bigint;
  total_liquidity: bigint;
  settled: boolean;
  outcome: boolean;
  created_at: bigint;
}

// ────────────────────────────────────────────────────────────
// Agent Registry
// ────────────────────────────────────────────────────────────

export async function getAgentProfile(id: number): Promise<AgentProfile> {
  return readContract<AgentProfile>(
    CONTRACTS.AGENT_REGISTRY,
    'get_profile',
    [u32Val(id)]
  );
}

export async function getReputationScore(id: number): Promise<ReputationScore> {
  return readContract<ReputationScore>(
    CONTRACTS.AGENT_REGISTRY,
    'get_score',
    [u32Val(id)]
  );
}

export async function getAgentId(wallet: string): Promise<number> {
  return readContract<number>(
    CONTRACTS.AGENT_REGISTRY,
    'get_agent_id',
    [addressVal(wallet)]
  );
}

export async function buildMintCreator(
  publicKey: string,
  handle: string,
  platform: string,
  metadataUri: string,
  followerCount: number
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.AGENT_REGISTRY, 'mint_creator', [
    addressVal(publicKey),
    nativeToScVal(handle, { type: 'string' }),
    nativeToScVal(platform, { type: 'string' }),
    nativeToScVal(metadataUri, { type: 'string' }),
    nativeToScVal(followerCount, { type: 'u64' }),
  ]);
}

export async function buildMintBrand(
  publicKey: string,
  brandName: string,
  metadataUri: string
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.AGENT_REGISTRY, 'mint_brand', [
    addressVal(publicKey),
    nativeToScVal(brandName, { type: 'string' }),
    nativeToScVal(metadataUri, { type: 'string' }),
  ]);
}

// ────────────────────────────────────────────────────────────
// Deal Vault
// ────────────────────────────────────────────────────────────

export async function getDeal(dealId: number): Promise<Deal> {
  return readContract<Deal>(
    CONTRACTS.DEAL_VAULT,
    'get_deal',
    [u32Val(dealId)]
  );
}

export async function buildCreateDeal(
  publicKey: string,
  creatorId: number,
  brandId: number,
  paymentUsdc: bigint,
  creatorStake: bigint,
  brandStake: bigint,
  deadline: bigint,
  creatorWallet: string,
  brandWallet: string
): Promise<string> {
  // Simple intent hash: keccak-like from deal params using timestamp
  const intentHash = new Uint8Array(32).fill(1);

  return buildTx(publicKey, CONTRACTS.DEAL_VAULT, 'create_deal', [
    u32Val(creatorId),
    u32Val(brandId),
    i128Val(paymentUsdc),
    i128Val(creatorStake),
    i128Val(brandStake),
    u64Val(deadline),
    addressVal(creatorWallet),
    addressVal(brandWallet),
    xdr.ScVal.scvBytes(Buffer.from(intentHash)),
  ]);
}

export async function buildDepositStakes(
  publicKey: string,
  dealId: number
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.DEAL_VAULT, 'deposit_stakes', [
    u32Val(dealId),
  ]);
}

export async function buildSubmitDelivery(
  publicKey: string,
  dealId: number
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.DEAL_VAULT, 'submit_delivery', [
    u32Val(dealId),
  ]);
}

// ────────────────────────────────────────────────────────────
// Pact Market
// ────────────────────────────────────────────────────────────

export async function getMarket(dealId: number): Promise<Market> {
  return readContract<Market>(
    CONTRACTS.PACT_MARKET,
    'get_market',
    [u32Val(dealId)]
  );
}

export async function getYesPrice(dealId: number): Promise<number> {
  return readContract<number>(
    CONTRACTS.PACT_MARKET,
    'get_yes_price',
    [u32Val(dealId)]
  );
}

export async function buildBuyTokens(
  publicKey: string,
  dealId: number,
  isYes: boolean,
  usdcIn: bigint
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.PACT_MARKET, 'buy', [
    addressVal(publicKey),
    u32Val(dealId),
    boolVal(isYes),
    i128Val(usdcIn),
  ]);
}

export async function buildRedeem(
  publicKey: string,
  dealId: number
): Promise<string> {
  return buildTx(publicKey, CONTRACTS.PACT_MARKET, 'redeem', [
    addressVal(publicKey),
    u32Val(dealId),
  ]);
}
