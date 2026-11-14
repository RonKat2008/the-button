import { describe, expect, test } from 'vitest'
import { describeTxError, formatDuration, formatEth, shortAddress } from './format'
import { findPlayer, parseFeed, rankPlayers, type PlayerRecord } from './game'

const ZERO = '0x0000000000000000000000000000000000000000'
const A = '0xAAAAaaaaAAAAaaaaAAAAaaaaAAAAaaaaAAAAaaaa'
const B = '0xBBBBbbbbBBBBbbbbBBBBbbbbBBBBbbbbBBBBbbbb'
const ETH = 10n ** 18n
const player = (person: string, totalTime: number, prevTime = 0): PlayerRecord => ({
  person,
  boughtPrice: ETH,
  prevTime,
  totalTime,
})

describe('parseFeed', () => {
  test('doubles the price on each press and skips sells when counting', () => {
    const feed = parseFeed([[A, ZERO], [A], [B, ZERO], [A, B]])
    expect(feed.map((e) => e.kind)).toEqual(['press', 'sell', 'press', 'press'])
    expect(feed.flatMap((e) => (e.kind === 'press' ? [e.price] : []))).toEqual([ETH, 2n * ETH, 4n * ETH])
  })

  test('treats the zero address as no previous king', () => {
    const [first, , , last] = parseFeed([[A, ZERO], [A], [B, ZERO], [A, B]])
    expect(first).toMatchObject({ previous: null })
    expect(last).toMatchObject({ previous: B })
  })

  test('returns an empty feed when nothing has happened', () => {
    expect(parseFeed([])).toEqual([])
  })
})

describe('rankPlayers', () => {
  test('sorts by total time, longest first', () => {
    const ranked = rankPlayers([player(A, 10), player(B, 50)], null, 1000)
    expect(ranked.map((p) => [p.person, p.rank])).toEqual([[B, 1], [A, 2]])
  })

  test("adds the reigning king's running time", () => {
    const ranked = rankPlayers([player(A, 10, 900), player(B, 50)], A.toLowerCase(), 1000)
    expect(ranked[0]).toMatchObject({ person: A, isKing: true, liveTime: 110 })
  })

  test('nobody is king when the throne is empty', () => {
    expect(rankPlayers([player(A, 10)], ZERO, 1000)[0].isKing).toBe(false)
  })

  test('does not mutate its input', () => {
    const input = [player(A, 1), player(B, 2)]
    rankPlayers(input, null, 0)
    expect(input[0].person).toBe(A)
  })
})

describe('findPlayer', () => {
  test('matches addresses case-insensitively and ignores empty lookups', () => {
    const players = [player(A, 1)]
    expect(findPlayer(players, A.toLowerCase())?.person).toBe(A)
    expect(findPlayer(players, undefined)).toBeUndefined()
    expect(findPlayer(players, ZERO)).toBeUndefined()
  })
})

describe('format', () => {
  test('formatDuration picks sensible units', () => {
    expect(formatDuration(5)).toBe('5s')
    expect(formatDuration(65)).toBe('1m 5s')
    expect(formatDuration(3700)).toBe('1h 1m 40s')
    expect(formatDuration(90000)).toBe('1d 1h 0m')
    expect(formatDuration(-3)).toBe('0s')
  })

  test('formatEth trims whole numbers', () => {
    expect(formatEth(ETH)).toBe('1')
    expect(formatEth(ETH / 2n)).toBe('0.5')
  })

  test('shortAddress keeps both ends', () => {
    expect(shortAddress(A)).toBe('0xAAAA…aaaa')
  })

  test('describeTxError explains common failures', () => {
    expect(describeTxError({ code: 'ACTION_REJECTED' })).toMatch(/cancelled/)
    expect(describeTxError({ code: 'INSUFFICIENT_FUNDS' })).toMatch(/enough ETH/)
    expect(describeTxError({ code: 'CALL_EXCEPTION', reason: 'nope' })).toContain('"nope"')
    expect(describeTxError({ code: 'CALL_EXCEPTION' })).toMatch(/reverted without a reason/)
    expect(describeTxError(new Error('boom'))).toBe('boom')
    expect(describeTxError(null)).toMatch(/went wrong/)
  })
})
