import { action, createStore, persist } from 'easy-peasy'

export const store = createStore(persist({
  edicao: {},
  enderecoBlockChain: '',
  sq: '',
  votante: {
    biVotante: ''
  },
  artista: {},
  clearEdicao: action((state, payload) => {
    return {
      ...state,
      edicao: {}
    }
  }),
  limpar: action((state, payload) => {
    return {
      edicao: {},
      enderecoBlockChain: '',
      votante: {
        biVotante: ''
      },
    }
  }),
  clearAll: action((state, payload) => {
    return {
      ...state,
      enderecoBlockChain: '',
      artista: {},
      votante: {
        biVotante: ''
      },
    }
  }),
  setEdicao: action((state, payload) => {
    return {
      ...state,
      edicao: payload
    }
  }),
  setArtista: action((state, payload) => {
    return {
      ...state,
      artista: payload
    }
  }),
  setVotante: action((state, payload) => {
    console.log(payload)
    return {
      ...state,
      votante: {
        biVotante: payload.votante.biVotante
      }
    }
  }),
  setEnderecoBlockchain: action((state, payload) => {
    return {
      ...state,
      enderecoBlockChain: payload
    }
  }),
  setSq: action((state, payload) => {
    return {
      ...state,
      sq: payload
    }
  })
}, { storage: 'localStorage' }), { devTools: true })