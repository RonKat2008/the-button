import { useQuery } from '@tanstack/react-query'
import { Contract } from 'ethers'
import { BUTTON_ABI } from '../lib/abi'
import { contractAddress } from '../lib/config'
import { readProvider } from '../lib/ethers'
import { isNobody, parseFeed, type FeedEvent, type PlayerRecord } from '../lib/game'

const REFRESH_MS = 5000
export const GAME_QUERY_KEY = ['button-game', contractAddress] as const

export interface GameState {
  king: string | null
  price: bigint
  players: PlayerRecord[]
  feed: FeedEvent[]
}

interface RawPlayer {
  person: string
  boughtprice: bigint
  prevtime: bigint
  totaltime: bigint
  exists: boolean
}

async function fetchGameState(): Promise<GameState> {
  if (!contractAddress) throw new Error('No contract address configured.')
  if ((await readProvider.getCode(contractAddress)) === '0x') {
    throw new Error('No contract found at this address on this network. Check VITE_CONTRACT_ADDRESS and VITE_CHAIN.')
  }
  const contract = new Contract(contractAddress, BUTTON_ABI, readProvider)
  const [king, price, transactions, board] = await Promise.all([
    contract.returnking() as Promise<string>,
    contract.returnproce() as Promise<bigint>,
    contract.returntransctions() as Promise<string[][]>,
    contract.leaderboard() as Promise<RawPlayer[]>,
  ])
  return {
    king: isNobody(king) ? null : king,
    price,
    feed: parseFeed(transactions.map((entry) => [...entry])),
    players: board
      .filter((row) => row.exists)
      .map((row) => ({
        person: row.person,
        boughtPrice: row.boughtprice,
        prevTime: Number(row.prevtime),
        totalTime: Number(row.totaltime),
      })),
  }
}

export function useGameState() {
  return useQuery({
    queryKey: GAME_QUERY_KEY,
    queryFn: fetchGameState,
    enabled: contractAddress !== null,
    refetchInterval: REFRESH_MS,
    retry: 1,
  })
}
