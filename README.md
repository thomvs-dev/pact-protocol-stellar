# Pact Protocol Stellar

> "Every deal, proven on-chain. Now on Stellar."

Pact Protocol is a decentralized ecosystem built on the Stellar Testnet (via Soroban) that brings trust, transparency, and automation to creator-brand campaigns. 

User Feedback Form Responses: https://docs.google.com/spreadsheets/d/1oQkemIEobC8CkwjM3kEKuOj0wfE7ASfgO35YxFCnJsk/edit?usp=sharing

## 📖 What is Pact Protocol?

Pact Protocol is a trustless, automated deal negotiation and settlement platform. It empowers AI agents to negotiate creator-brand campaigns on-chain, stake capital on outcomes, and settle those deals via a decentralized AI oracle. 

On top of this infrastructure sits **PactMarket** (PactTrade), a binary prediction market AMM where anyone can trade and speculate on campaign outcomes using YES/NO tokens.

## 🤔 Why Pact Protocol?

The traditional creator-brand marketing industry is plagued by several core issues:
- **Trust Deficit:** Brands worry creators won't deliver the promised engagement or content. Creators worry brands won't pay on time.
- **Manual Overhead:** Negotiating deals, tracking metrics, and processing payments require heavy manual intervention.
- **Lack of Transparency:** Marketing campaign data is often siloed, making it hard to verify actual impact or ROI.
- **No Community Upside:** Fans and community members have no way to participate in or benefit from the success of their favorite creators' campaigns.

**Pact Protocol solves this by:**
1. **Escrowing Capital:** Funds are locked in a smart contract vault (`DealVault`) until oracle verification.
2. **Automating Verification:** An AI Oracle tracks social data and signs settlement transactions over Soroban smart contracts.
3. **Speculation & Engagement:** The prediction market turns passive audiences into active participants who can bet on campaign success.

## 🏗 Architecture

The project is built as a monorepo containing three main components interacting seamlessly:

1. **Smart Contracts (Rust / Soroban):**
   - **`AgentRegistry`:** Manages identity and reputation for AI agents representing brands and creators.
   - **`ValidationRegistry`:** Handles on-chain artifact logging (equivalent to ERC-8004) for storing proofs of completed work.
   - **`DealVault`:** The core engine that escrows capital (USDC), routes risk, and handles final settlement.
   - **`CampaignOracle`:** The on-chain oracle that receives and verifies off-chain social data, acting as the settlement signer.
   - **`PactMarket`:** The prediction market automated market maker (AMM) enabling the trading of binary YES/NO tokens tied to specific campaigns.
2. **AI Agents (Python / FastAPI):**
   - The off-chain engine that automatically negotiates terms, monitors social APIs (e.g., YouTube, Twitter), evaluates performance metrics, and triggers oracle updates.
3. **Frontend (Next.js 14):**
   - A modern, robust interface providing a dashboard for brands and creators to oversee agents, campaigns, and for users to interact with the PactTrade prediction market.

## 🚀 Deployed Contracts (Stellar Testnet)

All smart contracts are currently live and continuously tested on the **Stellar Testnet**.

| Contract | Address |
|----------|---------|
| **Agent Registry** | `CBIORX6H6LNFVJZDDR5VRIK2SMS33F65NLAZXXUVIJCWDGQYFQBI3AMB` |
| **Validation Registry** | `CCLSZGX22VETSIMFE27NXO4KOPLJOHRTRLGQTDJVBSX3IWRQCPIXSKWA` |
| **Campaign Oracle** | `CANGGB2JIORNUTNWWMWCORYKHMYBO64BEC464RLX2WIDFTD772PAUE2E` |
| **Deal Vault** | `CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ` |
| **Pact Market** | `CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E` |

*You can verify all addresses on the [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet).*

## 🛠 Getting Started

### Prerequisites

- Node.js (for Next.js frontend)
- Python 3.9+ (for AI Agents)
- Rust & Cargo (for Soroban smart contracts)
- Stellar CLI

### Setup Instructions

1. **Smart Contracts:**
   ```bash
   cd contracts
   stellar contract build
   cargo test
   ```
2. **AI Agents:**
   ```bash
   cd agents
   pip install -r requirements.txt
   python main.py
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ✅ Readiness and Operations Artifacts

The repository includes concrete testnet evidence and operational runbooks:

- Deployment manifest (local/on-chain WASM hash verification):  
  `ops/testnet/deployment-manifest.json`
- Function invocation matrix with tx hashes and failure diagnostics:  
  `ops/testnet/invocation-matrix.md` and `ops/testnet/invocation-evidence.json`
- Reproducible scripts:
  - `scripts/testnet/generate_deployment_manifest.py`
  - `scripts/testnet/run_invocation_matrix.py`
  - `scripts/testnet/deploy_all.sh`
- Monitoring endpoints in agent runtime:
  - `/healthz`
  - `/metrics`
  - `/metrics/summary`
- Frontend metrics dashboard route: `/metrics`
- Data indexing pipeline: `agents/indexer.py` (SQLite output in `ops/indexer/pact_indexer.db`)
- Security checklist: `docs/security/security-checklist.md`
- Release gate report: `docs/release/readiness-report.md`
- Testnet runbook: `docs/operations/testnet-runbook.md`

## 🖼 Product Screenshots

Current UI snapshots from `frontend/public`:

![Pact Protocol Screenshot 1](<frontend/public/Screenshot from 2026-04-20 17-11-09.png>)
![Pact Protocol Screenshot 2](<frontend/public/Screenshot from 2026-04-20 17-11-13.png>)
![Pact Protocol Screenshot 3](<frontend/public/Screenshot from 2026-04-20 17-11-22.png>)

## 📝 Community Form

Share feedback and submit responses here:  
[Pact Protocol Community Form](https://docs.google.com/forms/d/e/1FAIpQLSf09nG7PYFjWAdHDeJPWVD3GoN9K7BYzOyycXLBdBz8_nI2rA/viewform?usp=header)

---
*Built with ❤️ for the Stellar Network.*
