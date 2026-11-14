import { formatEther } from 'ethers'

export const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

/** Trims trailing zeros: 1.0 -> "1", 0.5 -> "0.5". */
export function formatEth(wei: bigint): string {
  const text = formatEther(wei)
  return text.endsWith('.0') ? text.slice(0, -2) : text
}

interface EthersLikeError {
  code?: string
  reason?: string | null
  shortMessage?: string
  info?: { error?: { code?: number } }
}

/** Turns an ethers/wallet error into one sentence a player can act on. */
export function describeTxError(error: unknown): string {
  const e = (error ?? {}) as EthersLikeError
  if (e.code === 'ACTION_REJECTED' || e.info?.error?.code === 4001) return 'You cancelled the transaction in your wallet.'
  if (e.code === 'INSUFFICIENT_FUNDS') return 'Your wallet does not have enough ETH for this price plus gas.'
  if (e.code === 'CALL_EXCEPTION') {
    return e.reason
      ? `The contract rejected this: "${e.reason}"`
      : 'The contract rejected this transaction (it reverted without a reason).'
  }
  return e.shortMessage || (error instanceof Error ? error.message : 'Something went wrong. Please try again.')
}
