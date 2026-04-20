#!/usr/bin/env python3
"""Generate an evidence-backed deployment manifest for Stellar testnet."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACTS_DIR = REPO_ROOT / "contracts"
OUTPUT_PATH = REPO_ROOT / "ops" / "testnet" / "deployment-manifest.json"

RPC_URL = "https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"


@dataclass(frozen=True)
class ContractConfig:
    name: str
    contract_id: str
    wasm_path: str
    initialize_note: str


CONTRACTS = (
    ContractConfig(
        name="agent_registry",
        contract_id="CBIORX6H6LNFVJZDDR5VRIK2SMS33F65NLAZXXUVIJCWDGQYFQBI3AMB",
        wasm_path="target/wasm32v1-none/release/agent_registry.wasm",
        initialize_note="already initialized with oracle signer",
    ),
    ContractConfig(
        name="validation_registry",
        contract_id="CCLSZGX22VETSIMFE27NXO4KOPLJOHRTRLGQTDJVBSX3IWRQCPIXSKWA",
        wasm_path="target/wasm32v1-none/release/validation_registry.wasm",
        initialize_note="no initialize function",
    ),
    ContractConfig(
        name="campaign_oracle",
        contract_id="CANGGB2JIORNUTNWWMWCORYKHMYBO64BEC464RLX2WIDFTD772PAUE2E",
        wasm_path="target/wasm32v1-none/release/campaign_oracle.wasm",
        initialize_note="already initialized with oracle signer",
    ),
    ContractConfig(
        name="deal_vault",
        contract_id="CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ",
        wasm_path="target/wasm32v1-none/release/deal_vault.wasm",
        initialize_note="already initialized with USDC/oracle/treasury",
    ),
    ContractConfig(
        name="pact_market",
        contract_id="CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E",
        wasm_path="target/wasm32v1-none/release/pact_market.wasm",
        initialize_note="already initialized with USDC/oracle",
    ),
)


def run(cmd: list[str], cwd: Path) -> str:
    proc = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    output = "\n".join([proc.stdout.strip(), proc.stderr.strip()]).strip()
    if proc.returncode != 0 and "Wasm Hash:" not in output:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{output}")
    return output


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_onchain_wasm_hash(contract_id: str) -> str:
    output = run(
        [
            "stellar",
            "contract",
            "info",
            "build",
            "--id",
            contract_id,
            "--rpc-url",
            RPC_URL,
            "--network-passphrase",
            NETWORK_PASSPHRASE,
        ],
        cwd=REPO_ROOT,
    )
    match = re.search(r"Wasm Hash:\s*([0-9a-f]{64})", output)
    if not match:
        raise RuntimeError(
            f"Could not parse on-chain wasm hash for {contract_id} from output:\n{output}"
        )
    return match.group(1)


def main() -> None:
    run(["stellar", "contract", "build"], cwd=CONTRACTS_DIR)

    contracts = []
    for cfg in CONTRACTS:
        local_wasm = CONTRACTS_DIR / cfg.wasm_path
        local_hash = sha256_file(local_wasm)
        onchain_hash = read_onchain_wasm_hash(cfg.contract_id)

        contracts.append(
            {
                "name": cfg.name,
                "contract_id": cfg.contract_id,
                "wasm_path": str(local_wasm.relative_to(REPO_ROOT)),
                "local_wasm_sha256": local_hash,
                "onchain_wasm_hash": onchain_hash,
                "hashes_match": local_hash == onchain_hash,
                "deploy_transaction_hash": None,
                "initialize_transaction_hash": None,
                "initialize_note": cfg.initialize_note,
                "explorer_contract_url": f"https://stellar.expert/explorer/testnet/contract/{cfg.contract_id}",
            }
        )

    payload = {
        "generated_at_utc": datetime.now(tz=timezone.utc).isoformat(),
        "network": {
            "name": "testnet",
            "rpc_url": RPC_URL,
            "network_passphrase": NETWORK_PASSPHRASE,
        },
        "contracts": contracts,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote deployment manifest: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
