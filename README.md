# Monad AI Agent

Autonomous AI-powered crypto trading agent built for Monad Testnet with MiniMax AI, Pyth Network, FastAPI, Next.js, and Solidity smart contracts.

## Overview

Monad AI Agent is an on-chain trading system that combines AI reasoning, live oracle data, an EMA strategy, and smart-contract risk controls. The project is designed for Monad Testnet only and keeps live swaps disabled by default until a funded wallet, deployed KillSwitch, and verified DEX configuration are provided.

The system:

- Uses MiniMax AI through NVIDIA NIM for explainable decision support.
- Reads live market data from Pyth Hermes.
- Applies an EMA-based trading strategy.
- Enforces trade limits through the `KillSwitch` smart contract.
- Streams agent state to a FastAPI backend and Next.js dashboard.
- Persists optional runtime data in MongoDB when configured.

## Features

- AI-assisted buy, sell, and hold reasoning.
- EMA signal generation.
- Pyth oracle validation.
- Solidity KillSwitch contract with pause, cooldown, daily cap, and per-trade limits.
- Manual trade preview and guarded execution endpoints.
- FastAPI service layer with REST and WebSocket routes.
- Next.js dashboard integration.
- Terminal dashboard and event listener utilities.
- Monad Testnet deployment scripts.

## Architecture

```text
Dashboard / API Clients
        |
        v
FastAPI Backend <---- Shared Runtime State
        |
        v
Monad AI Agent
        |
        +--> Pyth Oracle Prices
        +--> EMA Strategy
        +--> MiniMax AI Reasoning
        |
        v
KillSwitch Contract
        |
        v
Monad Testnet
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js |
| Backend API | FastAPI |
| Agent | Python |
| AI | MiniMax M2.7 via NVIDIA NIM |
| Oracle | Pyth Network |
| Blockchain | Monad Testnet |
| Smart contracts | Solidity |
| Contract tooling | Hardhat |
| Optional persistence | MongoDB |

## Project Structure

```text
agent/        Existing autonomous agent loop, strategy, oracle, dashboard, and chain client
app/          FastAPI backend, schemas, services, repositories, and WebSocket manager
contracts/    Solidity contracts
docs/         Demo and edge-case documentation
frontend/     Next.js dashboard
scripts/      Deployment scripts
test/         Hardhat contract tests
```

## Installation

```bash
git clone https://github.com/indrak31/monad-blitz-pune-MetaWiz-.git
cd monad-blitz-pune-MetaWiz-

npm install
python -m pip install -r requirements.txt

cp .env.example .env
```

Configure `.env` before running the agent or backend. Do not commit real secrets, private keys, deployed wallet addresses, or funded account details.

## Environment

The root `.env.example` is the canonical template. Important settings include:

- `MONAD_TESTNET_RPC_URL`
- `MONAD_TESTNET_CHAIN_ID`
- `DEPLOYER_PRIVATE_KEY`
- `OWNER_ADDRESS`
- `KILLSWITCH_ADDRESS`
- `PYTH_CONTRACT_ADDRESS`
- `PYTH_BETA_CONTRACT_ADDRESS`
- `PYTH_ETH_USD_FEED_ID`
- `PYTH_USDC_USD_FEED_ID`
- `PYTH_MON_USD_FEED_ID`
- `NVIDIA_API_KEY`
- `BACKEND_API_TOKEN`
- `MONGODB_URI`
- `NEXT_PUBLIC_API_URL`
- `ENABLE_LIVE_SWAPS`

Live swaps should remain disabled unless the deployed contracts, wallet funding, token approvals, and selected DEX path have been verified on Monad Testnet.

## FastAPI Backend

Run the backend with:

```bash
uvicorn app.main:app --reload
```

Important endpoints:

```text
GET  /health
GET  /api/state
GET  /api/market/snapshot
GET  /api/portfolio
GET  /api/daily-limit/status
GET  /api/trades/recent
POST /api/trades/manual/preview
POST /api/trades/manual/execute
POST /api/ai/validate
WS   /ws/stream
```

Mutating routes are protected by `BACKEND_API_TOKEN` when that variable is set. MongoDB persistence is enabled by setting `MONGODB_URI`; without it, persistence-dependent services return `unavailable` instead of fake data.

## Smart Contract Workflow

```bash
npm run compile
npm test
npm run deploy:hello
npm run deploy:killswitch
```

`KillSwitch.sol` enforces:

- Daily trading caps.
- Maximum per-trade size.
- Cooldown periods.
- Emergency pause and unpause.
- Owner-controlled parameters.
- Guarded forwarding through `executeTrade(...)`.
- ERC20 approval helper for tokens held by the KillSwitch.

## Running

Backend:

```bash
uvicorn app.main:app --reload
```

Agent:

```bash
python -m agent.agent_loop
```

Terminal dashboard:

```bash
python -m agent.dashboard
```

Oracle utility:

```bash
python -m agent.price_feed
```

Event listener:

```bash
python -m agent.event_listener
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` so the frontend reads the FastAPI backend. If unset, the existing Next route falls back to `.runtime/shared_state.json`.

## Validation

Useful local checks:

```bash
npm test
python -m unittest app.tests.test_services
python -m compileall app agent
cd frontend && npm run build
```

## Monad Blitz Pune Submission Notes

This repository was forked from the Monad Blitz Pune submission process template. The original process screenshots from the fork are preserved here:

![Fork step 1](/screenshots/1.png)

![Fork step 2](/screenshots/2.png)

The project code, documentation, and dashboard live directly in this fork as the hackathon submission.

## Team

- Indra Kurkute
- Alok Aage
- Annanya Ukey

## License

This project is licensed under the MIT License.
