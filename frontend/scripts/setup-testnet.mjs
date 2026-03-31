#!/usr/bin/env node
/**
 * Pact Protocol — Stellar Testnet Setup Script
 * 
 * Usage:
 *   node scripts/setup-testnet.mjs
 * 
 * This script:
 * 1. Generates a new Stellar testnet keypair
 * 2. Funds it with 10,000 XLM via Friendbot
 * 3. Prints the keypair for use in .env
 */

import { Keypair } from '@stellar/stellar-sdk';

const FRIENDBOT_URL = 'https://friendbot.stellar.org';

async function main() {
  console.log('\n🚀 PACT PROTOCOL — STELLAR TESTNET SETUP\n');
  console.log('─'.repeat(50));

  // 1. Generate keypair
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  console.log(`\n✅ Generated Stellar Keypair:`);
  console.log(`   Public Key:  ${publicKey}`);
  console.log(`   Secret Key:  ${secretKey}`);
  console.log(`\n⚠️  SAVE YOUR SECRET KEY — it will not be shown again!\n`);

  // 2. Fund via Friendbot
  console.log('💰 Funding with Friendbot (10,000 XLM)…');
  try {
    const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
    if (!res.ok) {
      throw new Error(`Friendbot error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`✅ Funded! TX Hash: ${data.hash || 'See Stellar Expert'}`);
  } catch (err) {
    console.error(`❌ Friendbot failed: ${err.message}`);
    console.log('   Try manually: https://friendbot.stellar.org?addr=' + publicKey);
  }

  // 3. Print instructions
  console.log('\n─'.repeat(50));
  console.log('\n📋 Next Steps:');
  console.log('');
  console.log('1. Add to your Stellar CLI config:');
  console.log(`   stellar keys add my-wallet --secret-key ${secretKey}`);
  console.log('');
  console.log('2. Verify balance:');
  console.log(`   stellar account balances --id ${publicKey} --network testnet`);
  console.log('');
  console.log('3. View on Stellar Expert:');
  console.log(`   https://stellar.expert/explorer/testnet/account/${publicKey}`);
  console.log('');
  console.log('4. Import into Freighter wallet:');
  console.log('   Open Freighter → Settings → Import Account → Enter secret key');
  console.log('   Switch to Testnet network');
  console.log('');
  console.log('5. Get testnet USDC (for deal funding):');
  console.log('   https://laboratory.stellar.org/ → Account → Fund USDC');
  console.log('');
  console.log('─'.repeat(50));
  console.log('\n🔑 Keypair Summary:');
  console.log(`   PUBLIC:  ${publicKey}`);
  console.log(`   SECRET:  ${secretKey}`);
  console.log('\n💡 Copy these values into your .env file:');
  console.log(`   DEPLOYER_ADDRESS=${publicKey}`);
  console.log(`   # Add secret to stellar CLI: stellar keys add deployer --secret-key ${secretKey}`);
  console.log('\n');
}

main().catch(console.error);
