# Monad AI Agent Project Context

Use this file as the high-signal handoff context for future Codex sessions working in this repository.

## Project Goal

Build a Monad testnet-only autonomous DeFi trading agent with:

- Live oracle prices from Pyth.
- EMA crossover strategy.
- LLM-assisted buy/sell/hold decisions.
- A Solidity `KillSwitch` contract that gates all trade execution.
- Trade/event feedback into a shared state file.
- A terminal dashboard and a Next.js dashboard.

The project must stay testnet-only. Never add code that can silently target mainnet or move real funds without explicit user configuration.

## Safety Rules

- Every code path that sends a trade must call `KillSwitch.executeTrade(...)`.
- Do not bypass the contract guardrails in Python.
- Keep private keys, API keys, RPC URLs, deployed addresses, and token addresses in `.env`.
- Fail closed on oracle errors, RPC errors, LLM errors, nonce conflicts, slippage failures, and transaction reverts.
- Keep `ENABLE_LIVE_SWAPS=false` unless the user has funded the KillSwitch and explicitly wants testnet transactions.
- Avoid inventing current chain, DEX, token, or oracle addresses. Verify against official docs or on-chain calls first.

## Current Stack

- Solidity + Hardhat for contracts and tests.
- Python for the autonomous agent.
- `web3.py` for Monad interaction.
- Pyth Hermes REST API for price reads in the current `agent/price_feed.py`.
- OpenAI-compatible client against NVIDIA NIM / MiniMax in the current `agent/agent_loop.py`.
- Rich terminal dashboard.
- Next.js frontend dashboard in `frontend/`.

## Repository Layout

- `contracts/`
  - `KillSwitch.sol`: owner-controlled safety contract with daily cap, per-trade limit, cooldown, pause/unpause, trade forwarding, and token approval helper.
  - `HelloWorld.sol`: minimal deployment smoke-test contract.
  - `MockTradeTarget.sol`: test helper target.
  - `MockERC20.sol`: test helper for token approval.
- `scripts/`
  - `deploy_hello_world.js`
  - `deploy_killswitch.js`
- `test/`
  - `KillSwitch.test.js`: Hardhat tests for core guardrails.
- `agent/`
  - `price_feed.py`: Pyth Hermes price polling.
  - `strategy_ema.py`: incremental EMA strategy.
  - `agent_loop.py`: main decision loop.
  - `chain_client.py`: KillSwitch transaction client.
  - `swap_executor.py`: current DEX calldata builder.
  - `event_listener.py`: polls `TradePlaced` logs.
  - `shared_state.py`: JSON-file state store.
  - `dashboard.py`: Rich terminal dashboard.
  - `config.py`: env and artifact helpers.
- `frontend/`
  - Next.js dashboard app, polling `../.runtime/shared_state.json` through `frontend/src/app/api/state/route.ts`.
- `app/`
  - FastAPI backend added as the production API layer around the existing agent/shared-state/contracts.
  - Exposes market snapshots, portfolio, daily-limit status, AI validation, manual trade preview/execution, state, auth upsert, and WebSocket streaming.
- `docs/`
  - `edge_case_checklist.md`
  - `demo_script.md`
  - `wow_feature.md`

## Important Current Drift

The repo is not perfectly aligned yet:

- `README.md` and `.env.example` currently describe MiniMax/NVIDIA and a PancakeSwap V2-compatible DEX assumption.
- `agent/agent_loop.py` currently uses `openai.OpenAI` with `NVIDIA_API_KEY`, `NVIDIA_BASE_URL`, and `LLM_MODEL`.
- `agent/price_feed.py` still names env vars as `PYTH_ETH_USD_FEED_ID` and `PYTH_USDC_USD_FEED_ID`, and computes `ETH/USDC`.
- `agent/swap_executor.py` still builds generic V2-style `swapExactTokensForTokens(...)` calldata.
- During prior investigation, Kuru looked like the stronger Monad-native testnet DEX candidate, but that integration was not finished.

Before claiming live DEX readiness, reconcile these pieces.

## Verified Monad Testnet Constants

These values were verified during project work, but should still be rechecked if time has passed:

- Monad testnet chain ID: `10143`
- RPC: `https://testnet-rpc.monad.xyz`
- Faucet: `https://faucet.monad.xyz`
- Explorer examples:
  - `https://testnet.monadvision.com`
  - `https://testnet.monadscan.com`

Pyth:

- Pyth stable contract on Monad testnet: `0x2880aB155794e7179c9eE2e38200202908C17B43`
- Pyth beta contract on Monad testnet: `0xad2B52D2af1a9bD5c561894Cdd84f7505e1CD0B5`
- Pyth Hermes base URL used by code: `https://hermes.pyth.network/v2/updates/price/latest`
- Pyth feed IDs found via Hermes:
  - `Crypto.ETH/USD`: `0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace`
  - `Crypto.USDC/USD`: `0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a`
  - `Crypto.MON/USD`: `0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1`

Kuru testnet investigation notes:

- Kuru router checked on-chain: `0x7EFbE105Ca7415dE98F96622173458ac1c054630`
- Kuru `MON-USDC` market checked on-chain: `0xa241896A7Dbe8a550D2E5fF7A914bB1989ceD2D9`
- Market base asset: native MON, represented as `0x0000000000000000000000000000000000000000`, decimals `18`
- Market quote asset: testnet USDC `0x3bA3d39AFcf8bb994f7964B3e0171Ea2Ba361570`, decimals `6`
- Market params observed:
  - `pricePrecision`: `100000000`
  - `sizePrecision`: `10000000000`
  - `tickSize`: `100`
  - `minSize`: `2000000000000`
  - `maxSize`: `2000000000000000000`
  - `takerFeeBps`: `0`
  - `makerFeeBps`: `0`

If using Kuru, prefer direct market functions or the official Kuru SDK/Flow route format. Do not keep pretending the Kuru market is a generic Uniswap/Pancake V2 router.

## Environment Variables

Root `.env.example` is the canonical template. Public constants should be real verified values; secrets and user-specific deployed addresses should be blank until configured locally. Important groups:

- Network:
  - `MONAD_TESTNET_RPC_URL`
  - `MONAD_TESTNET_CHAIN_ID`
  - explorer URLs
- Wallet/contracts:
  - `DEPLOYER_PRIVATE_KEY`
  - `OWNER_ADDRESS`
  - `KILLSWITCH_ADDRESS`
  - kill-switch caps and cooldowns
- Pyth:
  - `PYTH_CONTRACT_ADDRESS`
  - `PYTH_BETA_CONTRACT_ADDRESS`
  - `PYTH_ETH_USD_FEED_ID`
  - `PYTH_USDC_USD_FEED_ID`
  - `PYTH_MAX_STALENESS_SECONDS`
- LLM:
  - `NVIDIA_API_KEY`
  - `NVIDIA_BASE_URL`
  - `LLM_MODEL`
- DEX:
  - `DEX_NAME`
  - `DEX_ROUTER_ADDRESS`
  - `DEX_BASE_TOKEN_ADDRESS`
  - `DEX_QUOTE_TOKEN_ADDRESS`
  - token symbols and decimals
  - `TRADE_RECIPIENT`
  - `SLIPPAGE_BPS`
  - `ENABLE_LIVE_SWAPS`
- Runtime:
  - `SHARED_STATE_PATH`
  - EMA and poll settings

Never commit a real `.env`.

## Common Commands

Root project:

```powershell
npm install
npm run compile
npm test
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
npm run deploy:hello
npm run deploy:killswitch
```

Python agent:

```powershell
python -m pip install -r requirements.txt
python -m agent.price_feed
python -m agent.agent_loop
python -m agent.dashboard
python -m agent.event_listener
```

Frontend:

```powershell
Set-Location frontend
npm install
npm run dev
npm run build
```

The frontend dev server is configured for port `5001`.

## Last Known Validation

Earlier local validation passed:

- `npm test`: 6 Hardhat tests passing.
- Python `compileall agent`: passed with the bundled Python runtime.

After the later `KillSwitch.approveToken(...)` and `MockERC20.sol` edits, tests should be rerun and ideally extended for token approval behavior.

The FastAPI backend was added after that note. Run Python syntax checks and backend import checks after any backend edit.

## Implementation Notes

`KillSwitch.sol`:

- Owner-only.
- Enforces pause, per-trade limit, daily cap, and cooldown.
- Forwards calls to a target contract after checks.
- Emits `TradePlaced`.
- Has `approveToken(...)` so the KillSwitch can approve a DEX/market to spend ERC20 balances it holds.

`agent_loop.py`:

- Polls Pyth price data.
- Updates EMA state.
- Uses direct EMA signal when separation is unambiguous.
- Calls NVIDIA/MiniMax only when EMA is ambiguous and `NVIDIA_API_KEY` is present.
- Writes status to shared state for terminal and web dashboards.

`price_feed.py`:

- Uses Pyth Hermes REST, not currently on-chain `web3.py` reads.
- Current symbol logic is `ETH/USDC`. If the DEX is `MON-USDC`, update this to use `MON/USD` and `USDC/USD` or another consistent MON/USDC source.

`swap_executor.py`:

- Currently generic V2/Pancake-style.
- For Kuru, this must be replaced with Kuru market or Kuru Flow calldata generation.
- For PancakeSwap, fill the actual supported Monad testnet router, WMON, USDC, and decimals from official Pancake/Monad docs before enabling live swaps.

`shared_state.py`:

- Persists `.runtime/shared_state.json`.
- Frontend API reads this file from `frontend/../.runtime/shared_state.json`.

## Next Recommended Work

1. Pick one DEX path and make the code match it exactly.
2. If Kuru is selected, replace the V2 swap executor with Kuru orderbook/flow calls and update `.env.example` to native MON/USDC.
3. Update `price_feed.py` and prompt text from `ETH/USDC` to the actual traded market.
4. Fill `.env.example` with verified non-secret public constants only; leave secrets and deployed per-user addresses blank for local configuration.
5. Add tests for `approveToken(...)`.
6. Rerun `npm test`, Python syntax checks, and frontend build.
