import { useAccount } from 'wagmi'
import type { useGameActions } from '../hooks/useGameActions'
import type { GameState } from '../hooks/useGameState'
import { formatDuration, formatEth } from '../lib/format'
import { findPlayer, liveTimeOf, rankPlayers, sameAddress } from '../lib/game'

interface YourStatsProps {
  game: GameState
  now: number
  actions: ReturnType<typeof useGameActions>
}

export function YourStats({ game, now, actions }: YourStatsProps) {
  const { address } = useAccount()
  const me = findPlayer(rankPlayers(game.players, game.king, now), address)
  const youAreKing = Boolean(address && game.king && sameAddress(address, game.king))

  return (
    <section className="panel panel-you" aria-labelledby="you-heading">
      <h2 id="you-heading">You</h2>
      {!address && <p className="muted">Connect a wallet to see your record.</p>}
      {address && !me && <p className="muted">You have never held the button. Yet.</p>}
      {me && (
        <dl className="stat-list">
          <div>
            <dt>Rank</dt>
            <dd>#{me.rank}</dd>
          </div>
          <div>
            <dt>Time as king</dt>
            <dd className="tabular">{formatDuration(liveTimeOf(me, game.king, now))}</dd>
          </div>
          <div>
            <dt>Last paid</dt>
            <dd>{formatEth(me.boughtPrice)} ETH</dd>
          </div>
        </dl>
      )}
      {youAreKing && me && (
        <div className="sell-box">
          <button type="button" className="sell-button" disabled={actions.isBusy || !actions.canSign} onClick={actions.sell}>
            Sell the button
          </button>
          <p className="fine-print">
            You give up the throne. The contract pays out your total seconds as king, in wei: about{' '}
            <strong>{liveTimeOf(me, game.king, now).toLocaleString()} wei</strong> right now.
          </p>
        </div>
      )}
    </section>
  )
}
