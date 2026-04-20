# Testnet Deployment and Verification Runbook

This runbook is the canonical path for proving deployment state and function coverage on Stellar testnet.

## 1) Build deterministic WASM artifacts

```bash
cd contracts
stellar contract build
```

The command prints local SHA-256 hashes per contract.

## 2) Generate deployment manifest

```bash
python scripts/testnet/generate_deployment_manifest.py
```

Output: `ops/testnet/deployment-manifest.json`

The manifest captures:
- testnet contract IDs
- local WASM hash
- on-chain WASM hash from `stellar contract info build`
- hash match status
- explorer contract URLs

## 3) Execute invocation matrix

```bash
python scripts/testnet/run_invocation_matrix.py
```

Outputs:
- `ops/testnet/invocation-evidence.json`
- `ops/testnet/invocation-matrix.md`

The matrix includes:
- every public function across all contracts
- send mode (`yes` for state-changing evidence, `no` for initialization smoke tests)
- tx hash (if submitted)
- raw error output for any failures

## 4) Refresh indexer snapshot

```bash
python agents/indexer.py --per-contract-limit 30
```

Output DB:
- `ops/indexer/pact_indexer.db`

## 5) Runtime metrics and monitoring

Start the agent service:

```bash
python agents/main.py
```

Health and metrics endpoints:
- `GET /healthz`
- `GET /metrics`
- `GET /metrics/summary`

Frontend metrics dashboard:
- `frontend/src/app/metrics/page.tsx`
- Route: `/metrics`

## 6) Release evidence packet

Before any release candidate:
- regenerate all artifacts under `ops/testnet/`
- export indexer row counts from SQLite
- update `docs/release/readiness-report.md`
- attach explorer URLs for all tx hashes listed in invocation evidence
