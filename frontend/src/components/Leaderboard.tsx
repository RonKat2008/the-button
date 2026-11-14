import { useAccount } from 'wagmi'
import type { GameState } from '../hooks/useGameState'
import { formatDuration } from '../lib/format'
import { rankPlayers, sameAddress } from '../lib/game'
import { Address } from './Address'

export function Leaderboard({ game, now }: { game: GameState; now: number }) {
  const { address } = useAccount()
  const ranked = rankPlayers(game.players, game.king, now)

  return (
    <section className="panel panel-board" aria-labelledby="board-heading">
      <h2 id="board-heading">Longest reigns</h2>
      {ranked.length === 0 ? (
        <p className="muted">Nobody has pressed the button yet. First place is wide open.</p>
      ) : (
        <ol className="board">
          {ranked.map((player) => (
            <li key={player.person} data-king={player.isKing || undefined}>
              <span className="board-rank">{player.rank}</span>
              <span className="board-who">
                <Address value={player.person} you={Boolean(address && sameAddress(address, player.person))} />
                {player.isKing && <span className="crown">king</span>}
              </span>
              <span className="board-time tabular">{formatDuration(player.liveTime)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
