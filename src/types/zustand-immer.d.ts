import 'zustand'

declare module 'zustand' {
  // Allow the 'zustand/immer' store mutator key (value is `never` per zustand typing pattern)
  interface StoreMutators<S, A> {
    'zustand/immer': never
  }
}
