import { useQueryClient } from '@tanstack/react-query'
import { Contract, type ContractTransactionResponse } from 'ethers'
import { useCallback, useState } from 'react'
import { BUTTON_ABI } from '../lib/abi'
import { contractAddress } from '../lib/config'
import { useEthersSigner } from '../lib/ethers'
import { describeTxError } from '../lib/format'
import { GAME_QUERY_KEY } from './useGameState'

export type TxStatus =
  | { phase: 'idle' }
  | { phase: 'wallet'; action: ActionName }
  | { phase: 'mining'; action: ActionName; hash: string }
  | { phase: 'success'; action: ActionName; hash: string }
  | { phase: 'error'; action: ActionName; message: string }

export type ActionName = 'press' | 'sell'

export function useGameActions() {
  const signer = useEthersSigner()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<TxStatus>({ phase: 'idle' })

  const run = useCallback(
    async (action: ActionName, send: (contract: Contract) => Promise<ContractTransactionResponse>) => {
      if (!signer || !contractAddress) return
      setStatus({ phase: 'wallet', action })
      try {
        const tx = await send(new Contract(contractAddress, BUTTON_ABI, signer))
        setStatus({ phase: 'mining', action, hash: tx.hash })
        await tx.wait()
        setStatus({ phase: 'success', action, hash: tx.hash })
        await queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEY })
      } catch (error) {
        setStatus({ phase: 'error', action, message: describeTxError(error) })
      }
    },
    [signer, queryClient],
  )

  const press = useCallback((price: bigint) => run('press', (c) => c.presssButton({ value: price })), [run])
  const sell = useCallback(() => run('sell', (c) => c.sell()), [run])
  const isBusy = status.phase === 'wallet' || status.phase === 'mining'

  return { press, sell, status, isBusy, canSign: signer !== undefined }
}
