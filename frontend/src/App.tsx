import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Feed } from './components/Feed'
import { Hero } from './components/Hero'
import { Leaderboard } from './components/Leaderboard'
import { Notice, SetupNotice } from './components/Notice'
import { YourStats } from './components/YourStats'
import { useGameActions } from './hooks/useGameActions'
import { useGameState } from './hooks/useGameState'
import { useNow } from './hooks/useNow'
import { chain, contractAddress, hasInvalidAddress } from './lib/config'

function Game() {
  const { data: game, error, isPending } = useGameState()
  const actions = useGameActions()
  const now = useNow()

  if (!game) {
    return error ? (
      <Notice title="Could not read the contract">
        <p>{error.message}</p>
      </Notice>
    ) : (
      <p className="loading" role="status">{isPending ? 'Reading the chain…' : ''}</p>
    )
  }

  return (
    <>
      {error && <p className="stale-banner" role="status">Connection hiccup. Showing the last data I could read.</p>}
      <Hero game={game} now={now} actions={actions} />
      <div className="panels">
        <YourStats game={game} now={now} actions={actions} />
        <Leaderboard game={game} now={now} />
        <Feed game={game} />
      </div>
    </>
  )
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <p className="wordmark">
          The Button <span className="chain-chip">{chain.name}</span>
        </p>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>
      <main>{contractAddress ? <Game /> : <SetupNotice hasInvalidAddress={hasInvalidAddress} />}</main>
      <footer className="site-footer">
        <p>Every press pays the contract and doubles the price. Read the contract before you play.</p>
      </footer>
    </>
  )
}
