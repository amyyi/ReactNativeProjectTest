// import { act, renderHook } from '@testing-library/react-hooks'
// import { from, Observable } from 'rxjs'

// import useFetch from '../../../../libs/hooks/src/useFetch'

// const DEFAULT_COMMENDABLE_NUMBERS = [1, 3, 9, 11, 17]

// type Raffle = (yourNumber: number, commendableNumbers?: number[]) => Observable<boolean>
// const raffle: Raffle = (yourNumber, commendableNumbers = DEFAULT_COMMENDABLE_NUMBERS) => {
//   const promise: Promise<boolean> = new Promise((resolve, reject) => {
//     commendableNumbers.includes(yourNumber) ? resolve(true) : reject(new Error('QQ'))
//   })
//   return from(promise)
// }

// describe('raffle test run', () => {
//   test('success case', (done) => {
//     const { result } = renderHook(() => useFetch(raffle, null))

//     act(() => {
//       // TODO: fix Warning: An update to TestComponent inside a test was not wrapped in act(...).
//       const start = result.current[1]
//       start(11)
//     })

//     expect(result.current[0].isLoading).toBe(true)
//     setTimeout(() => {
//       expect(result.current[0].isLoading).toBe(false)
//       expect(result.current[0].isComplete).toBe(true)
//       expect(result.current[0].data).toBe(true)
//       done()
//     }, 50)
//   })
//   test('error case', (done) => {
//     const { result } = renderHook(() => useFetch(raffle, null))

//     act(() => {
//       // TODO: fix Warning: An update to TestComponent inside a test was not wrapped in act(...).
//       const start = result.current[1]
//       start(111)
//     })

//     expect(result.current[0].isLoading).toBe(true)
//     setTimeout(() => {
//       expect(result.current[0].isLoading).toBe(false)
//       expect(result.current[0].isComplete).toBe(false)
//       expect(result.current[0].data).toBe(null)
//       expect(result.current[0].error?.message).toBe('QQ')
//       done()
//     }, 50)
//   })
// })

export {}
test.skip('skip', () => {}) // eslint-disable-line jest/no-disabled-tests
