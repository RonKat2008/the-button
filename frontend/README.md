# The Button — frontend

React + Vite frontend for `../src/button.sol`. RainbowKit connects the wallet; ethers.js v6 does every contract read and write.

## Run it

```bash
cp .env.example .env   # then fill in VITE_CONTRACT_ADDRESS and VITE_CHAIN
npm install
npm run dev
```

`VITE_CHAIN` is `sepolia` or `anvil` (a local `anvil` node on port 8545).

## Scripts

- `npm run dev` — dev server
- `npm run build` — type-check and production build
- `npm test` — unit tests

## Where things live

- `src/lib/abi.ts` — contract function names (must match the contract exactly, typos included)
- `src/lib/game.ts` — feed parsing and client-side leaderboard sorting
- `src/hooks/` — reading game state, sending transactions
- `src/components/` — UI
