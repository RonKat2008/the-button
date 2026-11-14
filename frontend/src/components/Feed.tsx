import type { GameState } from '../hooks/useGameState'
import { formatEth } from '../lib/format'
import { Address } from './Address'

export function Feed({ game }: { game: GameState }) {
  const newestFirst = [...game.feed].reverse()

  return (
    <section className="panel panel-feed" aria-labelledby="feed-heading">
      <h2 id="feed-heading">The record</h2>
      {newestFirst.length === 0 ? (
        <p className="muted">No history yet.</p>
      ) : (
        <ol className="feed" reversed>
          {newestFirst.map((event) => (
            <li key={event.id} data-kind={event.kind}>
              <span className="feed-tag">{event.kind === 'press' ? 'took' : 'sold'}</span>
              <span>
                <Address value={event.actor} />{' '}
                {event.kind === 'sell' && 'sold the button and left the throne empty'}
                {event.kind === 'press' && !event.previous && 'claimed the empty throne'}
                {event.kind === 'press' && event.previous && (
                  <>
                    dethroned <Address value={event.previous} />
                  </>
                )}
              </span>
              {event.kind === 'press' && <span className="feed-price">{formatEth(event.price)} ETH</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
