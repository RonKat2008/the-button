import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { isAddress } from 'ethers'
import { http } from 'wagmi'
import { anvil, sepolia } from 'wagmi/chains'

const SUPPORTED_CHAINS = { sepolia, anvil } as const
type ChainKey = keyof typeof SUPPORTED_CHAINS

const env = import.meta.env
const chainKey = (env.VITE_CHAIN || 'sepolia').toLowerCase()

export const isChainSupported = chainKey in SUPPORTED_CHAINS
export const chain = SUPPORTED_CHAINS[(isChainSupported ? chainKey : 'sepolia') as ChainKey]

const rawAddress = (env.VITE_CONTRACT_ADDRESS || '').trim()
export const contractAddress = isAddress(rawAddress) ? rawAddress : null
export const hasInvalidAddress = rawAddress !== '' && contractAddress === null

export const rpcUrl: string = env.VITE_RPC_URL || chain.rpcUrls.default.http[0]

export const wagmiConfig = getDefaultConfig({
  appName: 'The Button',
  // WalletConnect needs a real id; injected browser wallets work with the placeholder.
  projectId: env.VITE_WALLETCONNECT_PROJECT_ID || 'MISSING_PROJECT_ID',
  chains: [chain],
  transports: { [chain.id]: http(rpcUrl) } as Record<typeof chain.id, ReturnType<typeof http>>,
})
