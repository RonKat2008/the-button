import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { useConnectorClient } from 'wagmi'
import { chain, rpcUrl } from './config'

/** Read-only ethers provider for the configured chain. */
export const readProvider = new JsonRpcProvider(rpcUrl, chain.id, { staticNetwork: true })

function clientToSigner(client: Client<Transport, Chain, Account>): JsonRpcSigner {
  const provider = new BrowserProvider(client.transport, {
    chainId: client.chain.id,
    name: client.chain.name,
  })
  return new JsonRpcSigner(provider, client.account.address)
}

/** Bridges the wallet RainbowKit connected into an ethers.js signer. */
export function useEthersSigner(): JsonRpcSigner | undefined {
  const { data: client } = useConnectorClient({ chainId: chain.id })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}
