import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSwitchChain } from 'wagmi'
import type { useGameActions } from '../hooks/useGameActions'
import type { GameState } from '../hooks/useGameState'
import { chain } from '../lib/config'
import { formatDuration, formatEth } from '../lib/format'
import { findPlayer, sameAddress } from '../lib/game'
import { Address } from './Address'
import { BigButton } from './BigButton'
import { StatusLine } from './StatusLine'

interface HeroProps {
  game: GameState
  now: number
  actions: ReturnType<typeof useGameActions>
}

export function Hero({ game, now, actions }: HeroProps) {
  const { address, isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const isWrongChain = isConnected && chainId !== chain.id
  const kingRecord = findPlayer(game.players, game.king)
  const youAreKing = Boolean(address && game.king && sameAddress(address, game.king))

  const handlePress = () => {
    if (!isConnected) return openConnectModal?.()
    if (isWrongChain) return switchChain({ chainId: chain.id })
    return actions.press(game.price)
  }
  const label = !isConnected ? 'Connect' : isWrongChain ? 'Switch' : actions.isBusy ? '…' : 'Press'

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="sticker">Price doubles every press</p>
        <h1 id="hero-heading">
          One button.
          <br />
          One <mark>king.</mark>
        </h1>
        <dl className="hero-facts">
          <div className="fact fact-price">
            <dt>Price to take it</dt>
            <dd>
              {formatEth(game.price)} <small>ETH</small>
            </dd>
          </div>
          <div className="fact">
            <dt>Reigning king</dt>
            <dd>
              {game.king ? <Address value={game.king} you={youAreKing} /> : <span className="muted">Throne is empty</span>}
            </dd>
          </div>
          {game.king && kingRecord && (
            <div className="fact">
              <dt>This reign</dt>
              <dd className="tabular">{formatDuration(now - kingRecord.prevTime)}</dd>
            </div>
          )}
        </dl>
      </div>
      <div className="hero-stage">
        <BigButton label={label} isBusy={actions.isBusy} onPress={handlePress} />
        <p className="hero-hint">
          {isWrongChain
            ? `Your wallet is on the wrong network. Switch to ${chain.name}.`
            : isConnected
              ? `Sends exactly ${formatEth(game.price)} ETH to the contract.`
              : 'Connect a wallet to play.'}
        </p>
        <StatusLine status={actions.status} />
      </div>
    </section>
  )
}
