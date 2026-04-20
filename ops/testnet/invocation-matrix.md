# Testnet Invocation Matrix

- Generated at (UTC): 2026-04-20T10:32:37.821784+00:00
- Success count: 13/17

| Contract | Function | Mode | Result | Tx Hash |
|---|---|---|---|---|
| agent_registry | `mint_brand` | `yes` | PASS | `16ce2d7e362d8fcc1d26345d8010632fa02e3889109482e96b0fa30aeb941f2d` |
| agent_registry | `mint_creator` | `yes` | PASS | `caa24106992bf78fe3373b8ddd984f5d8e9f134a690a32c6b123ebdeb2c517d3` |
| agent_registry | `record_deal` | `yes` | PASS | `851227733c0ad427607e1c6b6d1022ed53c3b5430d5bdb974b6ee19fce45c1e4` |
| validation_registry | `post_artifact` | `yes` | PASS | `8beb18ce20c9dd82647f1b8e991e5c8c988041a5d872ae53b1addaef82c15fc6` |
| campaign_oracle | `post_result` | `yes` | PASS | `9b38e9c10ebb073258c0bb4b6b73a4bdb650ea81a931beaca0962cdf50fab580` |
| deal_vault | `create_deal` | `yes` | PASS | `d2b05388cae68871ed9578cc54f12b7f337de59fe7a44fe9ec7d2878a2be80df` |
| deal_vault | `deposit_stakes` | `yes` | FAIL | `-` |
| deal_vault | `submit_delivery` | `yes` | FAIL | `-` |
| deal_vault | `settle` | `yes` | FAIL | `-` |
| pact_market | `create_market` | `yes` | PASS | `00d211bf5aba11c0f12c49678fabd510643dce60f103c88262ee143b5e1adf29` |
| pact_market | `buy` | `yes` | PASS | `387f1bc4fd878a7e48d15c5cfc5332ce1813d448c6604b2eae7352eebbafc628` |
| pact_market | `settle_market` | `yes` | PASS | `6d63f7a3dad1da03e2ed72ca86c318d8474c4f9eb559df0ec89d882a1863f153` |
| pact_market | `redeem` | `yes` | FAIL | `-` |
| agent_registry | `initialize` | `no` | PASS | `-` |
| campaign_oracle | `initialize` | `no` | PASS | `-` |
| deal_vault | `initialize` | `no` | PASS | `-` |
| pact_market | `initialize` | `no` | PASS | `-` |

## Failures

### deal_vault.deposit_stakes
```
❌ error: transaction simulation failed: HostError: Error(WasmVm, InvalidAction)

Event log (newest first):
   0: [Diagnostic Event] contract:CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, topics:[error, Error(WasmVm, InvalidAction)], data:["VM call trapped: UnreachableCodeReached", deposit_stakes]
   1: [Diagnostic Event] topics:[fn_call, CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, deposit_stakes], data:1
```

### deal_vault.submit_delivery
```
❌ error: transaction simulation failed: HostError: Error(WasmVm, InvalidAction)

Event log (newest first):
   0: [Diagnostic Event] contract:CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, topics:[error, Error(WasmVm, InvalidAction)], data:["VM call trapped: UnreachableCodeReached", submit_delivery]
   1: [Diagnostic Event] topics:[fn_call, CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, submit_delivery], data:1
```

### deal_vault.settle
```
❌ error: transaction simulation failed: HostError: Error(WasmVm, InvalidAction)

Event log (newest first):
   0: [Diagnostic Event] contract:CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, topics:[error, Error(WasmVm, InvalidAction)], data:["VM call trapped: UnreachableCodeReached", settle]
   1: [Diagnostic Event] topics:[fn_call, CBYJ4ZCAUBOKLLGYE4JLHBUOGCHLB4IA56G6JQH2DF5E5UCZWEULUIDZ, settle], data:[1, true, 700]
```

### pact_market.redeem
```
❌ error: transaction simulation failed: HostError: Error(Contract, #10)

Event log (newest first):
   0: [Diagnostic Event] contract:CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, topics:[error, Error(Contract, #10)], data:"escalating error to VM trap from failed host function call: call"
   1: [Diagnostic Event] contract:CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, topics:[error, Error(Contract, #10)], data:["contract call failed", transfer, [CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, GCX2N44HF7YH3JA5DLX3FJKNR4O3PNOTVWBT3TZ276RWJDVRAPKROUC2, 218797]]
   2: [Failed Diagnostic Event (not emitted)] contract:CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, topics:[error, Error(Contract, #10)], data:["balance is not sufficient to spend", {amount: 200000, authorized: true, clawback: false}, 218797]
   3: [Diagnostic Event] contract:CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, topics:[fn_call, CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, transfer], data:[CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, GCX2N44HF7YH3JA5DLX3FJKNR4O3PNOTVWBT3TZ276RWJDVRAPKROUC2, 218797]
   4: [Diagnostic Event] topics:[fn_call, CCTXVX6LYNHPL2XJHNOTXKJ33IOY7BYLPMN7SHMV6X2YW7LBPYNG2I4E, redeem], data:[GCX2N44HF7YH3JA5DLX3FJKNR4O3PNOTVWBT3TZ276RWJDVRAPKROUC2, 88]
```
