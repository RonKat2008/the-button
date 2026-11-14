# The Button

A "king of the button" game. Pay the current price to become king; every press doubles the price.

- `src/button.sol` — the smart contract
- `frontend/` — React app (RainbowKit for wallet connection, ethers.js for contract calls)

## Run it locally

You need [Foundry](https://getfoundry.sh) and Node.js.

**1. Start a local chain** (leave this running; it prints test accounts and private keys):

```bash
anvil
```

**2. Deploy the contract** from the project root, using any private key anvil printed:

```bash
forge create src/button.sol:button --rpc-url http://127.0.0.1:8545 --private-key <ANVIL_PRIVATE_KEY> --broadcast
```

Copy the `Deployed to:` address.

**3. Start the frontend:**

```bash
cd frontend
cp .env.example .env
```

In `.env`, set `VITE_CONTRACT_ADDRESS` to the deployed address and `VITE_CHAIN=anvil`, then:

```bash
npm install
npm run dev
```

**4. Connect a wallet.** In MetaMask, add the network `http://127.0.0.1:8545` (chain id `31337`) and import one of anvil's private keys. These are public test keys: never send real funds to them.

Restarting `anvil` wipes the chain, so redeploy and update `.env` each time.
