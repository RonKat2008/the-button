import type { ReactNode } from 'react'

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="notice" role="alert">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function SetupNotice({ hasInvalidAddress }: { hasInvalidAddress: boolean }) {
  return (
    <Notice title={hasInvalidAddress ? 'That contract address is not valid' : 'Almost there: point me at your contract'}>
      <ol>
        <li>Deploy <code>button.sol</code> and copy its address.</li>
        <li>
          Copy <code>.env.example</code> to <code>.env</code> and set <code>VITE_CONTRACT_ADDRESS</code> and{' '}
          <code>VITE_CHAIN</code>.
        </li>
        <li>Restart <code>npm run dev</code>.</li>
      </ol>
    </Notice>
  )
}
