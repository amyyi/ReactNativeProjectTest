import { act, renderHook } from '@testing-library/react-hooks'
import { useCallback, useState } from 'react'

const useCounter = (): { count: number; increment: () => void } => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((x) => x + 1), [])
  return { count, increment }
}

describe('useCounter testing', () => {
  test('increment count normal case', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  test('increment count monkey test ', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
      result.current.increment()
    })

    expect(result.current.count).toBe(2)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(3)
  })
})
