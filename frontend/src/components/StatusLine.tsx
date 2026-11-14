import type { TxStatus } from '../hooks/useGameActions'
import { TxLink } from './Address'

const VERB = { press: 'Press', sell: 'Sale' } as const

export function StatusLine({ status }: { status: TxStatus }) {
  if (status.phase === 'idle') return <p className="status-line" role="status" />
  const text = {
    wallet: 'Confirm it in your wallet…',
    mining: `${VERB[status.action]} sent. Waiting for the chain…`,
    success: `${VERB[status.action]} confirmed.`,
    error: status.phase === 'error' ? status.message : '',
  }[status.phase]
  return (
    <p className="status-line" data-phase={status.phase} role={status.phase === 'error' ? 'alert' : 'status'}>
      {text} {'hash' in status && <TxLink hash={status.hash} />}
    </p>
  )
}
