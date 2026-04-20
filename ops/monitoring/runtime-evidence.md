# Runtime Monitoring Evidence

Date: 2026-04-20

## Health check

Endpoint: `GET http://127.0.0.1:8000/healthz`

Response:
```json
{"status":"ok","service":"pact-stellar-agents"}
```

## Functional invocation

Endpoint: `POST http://127.0.0.1:8000/negotiate`

Response:
```json
{"status":"success","deal_intent_hash":"63726561746f722d313a6272616e642d313a3130303000000000000000000000"}
```

## Metrics summary

Endpoint: `GET http://127.0.0.1:8000/metrics/summary`

Response:
```json
{"uptime_seconds":53,"total_requests":5,"total_negotiations":2,"avg_latency_ms":5.39,"status_codes":{"200":5}}
```

## Prometheus format

Endpoint: `GET http://127.0.0.1:8000/metrics`

Sample:
```text
# HELP pact_agent_requests_total Total HTTP requests
# TYPE pact_agent_requests_total counter
pact_agent_requests_total 1
```
