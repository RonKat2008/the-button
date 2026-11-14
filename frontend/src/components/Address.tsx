import { chain } from '../lib/config'
import { shortAddress } from '../lib/format'

const explorer = chain.blockExplorers?.default.url

export function Address({ value, you }: { value: string; you?: boolean }) {
  const label = you ? 'you' : shortAddress(value)
  if (!explorer) return <span className="address" title={value}>{label}</span>
  return (
    <a className="address" href={`${explorer}/address/${value}`} target="_blank" rel="noreferrer" title={value}>
      {label}
    </a>
  )
}

export function TxLink({ hash }: { hash: string }) {
  if (!explorer) return null
  return (
    <a href={`${explorer}/tx/${hash}`} target="_blank" rel="noreferrer">
      view transaction ↗
    </a>
  )
}
