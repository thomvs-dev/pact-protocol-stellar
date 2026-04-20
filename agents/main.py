from __future__ import annotations

import time
from collections import defaultdict

from fastapi import FastAPI, Request
from pydantic import BaseModel
from stellar_sdk import Keypair, Network, Server

app = FastAPI(title="Pact Protocol Stellar Agents")


class RuntimeMetrics:
    def __init__(self) -> None:
        self.started_at = time.time()
        self.total_requests = 0
        self.total_negotiations = 0
        self.status_codes: dict[int, int] = defaultdict(int)
        self.total_latency_ms = 0.0

    def record_request(self, status_code: int, latency_ms: float) -> None:
        self.total_requests += 1
        self.status_codes[status_code] += 1
        self.total_latency_ms += latency_ms

    def record_negotiation(self) -> None:
        self.total_negotiations += 1

    def snapshot(self) -> dict:
        avg = self.total_latency_ms / self.total_requests if self.total_requests else 0.0
        uptime = int(time.time() - self.started_at)
        return {
            "uptime_seconds": uptime,
            "total_requests": self.total_requests,
            "total_negotiations": self.total_negotiations,
            "avg_latency_ms": round(avg, 2),
            "status_codes": dict(sorted(self.status_codes.items(), key=lambda x: x[0])),
        }


METRICS = RuntimeMetrics()


class NegotiationRequest(BaseModel):
    creator_id: str
    brand_id: str
    initial_offer: int


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    started = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - started) * 1000
    METRICS.record_request(response.status_code, elapsed_ms)
    return response


@app.get("/")
def read_root():
    return {"message": "Stellar Agent Runtime"}


@app.get("/healthz")
def healthz():
    return {"status": "ok", "service": "pact-stellar-agents"}


@app.get("/metrics/summary")
def metrics_summary():
    return METRICS.snapshot()


@app.get("/metrics")
def metrics_prometheus():
    snapshot = METRICS.snapshot()
    lines = [
        "# HELP pact_agent_uptime_seconds Process uptime in seconds",
        "# TYPE pact_agent_uptime_seconds gauge",
        f"pact_agent_uptime_seconds {snapshot['uptime_seconds']}",
        "# HELP pact_agent_requests_total Total HTTP requests",
        "# TYPE pact_agent_requests_total counter",
        f"pact_agent_requests_total {snapshot['total_requests']}",
        "# HELP pact_agent_negotiations_total Total negotiation attempts",
        "# TYPE pact_agent_negotiations_total counter",
        f"pact_agent_negotiations_total {snapshot['total_negotiations']}",
        "# HELP pact_agent_request_latency_ms Average request latency in ms",
        "# TYPE pact_agent_request_latency_ms gauge",
        f"pact_agent_request_latency_ms {snapshot['avg_latency_ms']}",
    ]
    for status_code, count in snapshot["status_codes"].items():
        lines.extend(
            [
                "# HELP pact_agent_http_status_total Count by HTTP status code",
                "# TYPE pact_agent_http_status_total counter",
                f'pact_agent_http_status_total{{code="{status_code}"}} {count}',
            ]
        )
    return "\n".join(lines) + "\n"


@app.post("/negotiate")
def negotiate(req: NegotiationRequest):
    # The live runtime still uses deterministic mock negotiation while
    # contract-side invocation evidence is captured in ops/testnet artifacts.
    METRICS.record_negotiation()
    payload = f"{req.creator_id}:{req.brand_id}:{req.initial_offer}".encode("utf-8")
    deal_intent_hash = payload.hex()[:64].ljust(64, "0")
    return {"status": "success", "deal_intent_hash": deal_intent_hash}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
