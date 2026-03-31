# PACT PROTOCOL STELLAR — MASTER BRIEF
## "Every deal, proven on-chain. Now on Stellar."

> This is the Stellar/Soroban port of Pact Protocol.
> All smart contracts are written in Rust for Soroban.
> Read ALL spec files in `/specs/` before writing any code.

---

## WHAT WE ARE BUILDING

A trustless creator–brand deal protocol where AI agents negotiate campaigns on-chain,
stake capital on outcomes, and settle via oracle — with a prediction market (PactTrade)
on top where anyone can trade campaign outcomes.

**Network:** Stellar Testnet (via Soroban)

---

## DEPLOYED CONTRACT ADDRESSES (Stellar Testnet)

| Contract | Address |
|----------|---------|
| AgentRegistry | `CBIORX6H6LNFVJZDDR5VRIK2SMS33F65NLAZXXUVIJCWDGQYFQBI3AMB` |
| ValidationRegistry | `CCLSZGX22VETSIMFE27NXO4KOPLJOHRTRLGQTDJVBSX3IWRQCPIXSKWA` |
| CampaignOracle | `CANGGB2JIORNUTNWWMWCORYKHMYBO64BEC464RLX2WIDFTD772PAUE2E` |
| DealVault | `CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ` |
| PactMarket | `CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E` |

Verify all on [Stellar Expert Testnet](https://stellar.expert/explorer/testnet)

---

## MONOREPO STRUCTURE

```
pact-protocol-stellar/
├── CLAUDE.md                        ← This file
├── .env                             ← Live contract addresses (DO NOT COMMIT)
├── .env.example                     ← Template (safe to commit)
├── contracts/                       ← Soroban Rust workspace
│   ├── Cargo.toml                   ← Workspace config, soroban-sdk = "21.7.6"
│   ├── agent_registry/              ← Agent identity + reputation (combined)
│   ├── validation_registry/         ← On-chain artifact logging (ERC-8004 equivalent)
│   ├── deal_vault/                  ← Deal escrow + risk routing + settlement
│   ├── campaign_oracle/             ← Social data oracle & settlement signer
│   └── pact_market/                 ← Binary prediction AMM (YES/NO tokens)
├── agents/                          ← Python AI agent runtime
│   ├── pyproject.toml
│   └── main.py                      ← FastAPI entry point
└── frontend/                        ← Next.js 14 app
    └── package.json
```

---

## BUILD & TEST

```bash
# Build for Soroban (CORRECT target — do NOT use wasm32-unknown-unknown)
cd contracts
stellar contract build

# Run all 21 tests
cargo test

# Test individual package
cargo test --package agent_registry
```

---

## DEPLOY TO TESTNET

```bash
cd contracts

# Deploy (replace with your WASM path)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/agent_registry.wasm \
  --source deployer \
  --network testnet

# Initialize contracts (see .env for addresses)
stellar contract invoke \
  --id $AGENT_REGISTRY_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- initialize \
  --oracle $ORACLE_ADDRESS
```

---

## CRITICAL RULES

- **Always build with `stellar contract build`** — NOT `cargo build --target wasm32-unknown-unknown`.
  The stellar CLI uses `wasm32v1-none` which is the Soroban-compatible subset.
- **Every state change touching capital MUST go through DealVault.** Never touch USDC directly.
- **Oracle-only writes** for reputation and settlement — never self-reported.
- **Both parties must sign** `create_deal` — creator.require_auth() AND brand.require_auth().
- **soroban-sdk version MUST stay at `21.7.6`** in workspace — do not bump without testing.

---

## WALLETS (testnet only)

- **Deployer:** `GCX2N44HF7YH3JA5DLX3FJKNR4O3PNOTVWBT3TZ276RWJDVRAPKROUC2` (stellar key: `deployer`)
- **Oracle Signer:** `GBGCHRT4SXPKYNTJHM65UNOVB7SNWRXKHZPTK4VOCCELGP5YV6YEYE56` (stellar key: `bootcamp_admin`)
