import { action, createStore, persist } from 'easy-peasy'

export const store = createStore(persist({
}, { storage: 'localStorage' }), { devTools: true })