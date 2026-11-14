import { ZeroAddress } from 'ethers'

export interface PlayerRecord {
  person: string
  boughtPrice: bigint
  prevTime: number
  totalTime: number
}

export interface RankedPlayer extends PlayerRecord {
  rank: number
  isKing: boolean
  /** Banked time plus the live, still-running reign if this player is king. */
  liveTime: number
}

export type FeedEvent =
  | { id: number; kind: 'press'; actor: string; previous: string | null; price: bigint }
  | { id: number; kind: 'sell'; actor: string }

const STARTING_PRICE = 10n ** 18n
const sameAddress = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

export const isNobody = (address: string | null | undefined) =>
  !address || sameAddress(address, ZeroAddress)

/**
 * The contract stores a press as [buyer, previousKing] and a sell as [seller].
 * Each press doubles the price, so the price paid is recoverable from press order.
 */
export function parseFeed(transactions: readonly (readonly string[])[]): FeedEvent[] {
  let pressCount = 0n
  return transactions.map((entry, id): FeedEvent => {
    if (entry.length < 2) return { id, kind: 'sell', actor: entry[0] }
    const price = STARTING_PRICE * 2n ** pressCount
    pressCount += 1n
    return { id, kind: 'press', actor: entry[0], previous: isNobody(entry[1]) ? null : entry[1], price }
  })
}

export function liveTimeOf(player: PlayerRecord, king: string | null, nowSec: number): number {
  const isKing = !isNobody(king) && sameAddress(player.person, king as string)
  return isKing ? player.totalTime + Math.max(0, nowSec - player.prevTime) : player.totalTime
}

/** Sorted client-side: the contract's own leaderboard() comes back unsorted. */
export function rankPlayers(players: readonly PlayerRecord[], king: string | null, nowSec: number): RankedPlayer[] {
  return players
    .map((player) => ({
      ...player,
      isKing: !isNobody(king) && sameAddress(player.person, king as string),
      liveTime: liveTimeOf(player, king, nowSec),
    }))
    .sort((a, b) => b.liveTime - a.liveTime)
    .map((player, index) => ({ ...player, rank: index + 1 }))
}

export function findPlayer<T extends PlayerRecord>(players: readonly T[], address: string | null | undefined) {
  if (isNobody(address)) return undefined
  return players.find((player) => sameAddress(player.person, address as string))
}

export { sameAddress }
