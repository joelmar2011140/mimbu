import { action, createStore, persist } from 'easy-peasy'

export const store = createStore(persist({
  edicao: {},
  clearEdicao: action((state, payload) => {
    return {
      ...state,
      edicao: {}
    }
  }),
  setEdicao: action((state, payload) => {
    return {
      ...state,
      edicao: payload
    }
  })
}, { storage: 'localStorage' }), { devTools: true })