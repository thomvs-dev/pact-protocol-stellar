# Security Checklist

Status legend:
- `PASS`: implemented and verified in repository/runtime artifacts
- `FAIL`: missing or incomplete, must be fixed before production

## Smart Contracts

- `PASS` Access control checks exist on privileged functions (`require_auth`) in `contracts/*/src/lib.rs`.
- `PASS` Capital transfer logic is concentrated in `DealVault` and `PactMarket` contract modules.
- `PASS` Unit tests cover core lifecycle paths in each contract package.
- `FAIL` No third-party contract audit report is present.
- `FAIL` No invariant or fuzz test suite exists for economic edge cases.

## Backend Runtime

- `PASS` Health endpoint implemented at `/healthz`.
- `PASS` Metrics endpoint implemented at `/metrics` and `/metrics/summary`.
- `FAIL` No API authentication/authorization on agent endpoints.
- `FAIL` No request signing or replay protection for `/negotiate`.
- `FAIL` No secrets scanner or SAST stage in CI.

## Frontend

- `PASS` Wallet transactions are explicit and user-signed.
- `PASS` Contract addresses are environment-driven.
- `FAIL` No CSP/headers hardening policy is defined.
- `FAIL` No explicit frontend dependency vulnerability scan workflow.

## Ops / Monitoring

- `PASS` Indexer pipeline implemented with persistent SQLite snapshots (`agents/indexer.py`).
- `PASS` Invocation evidence and deployment manifest are reproducible with scripts in `scripts/testnet/`.
- `FAIL` No alerting channel (PagerDuty/Slack/email) wired to health failures.
- `FAIL` No incident response playbook beyond baseline runbook.

## Release Gate

This project is **testnet-ready** but **not production-secure** until all `FAIL` items are resolved.
