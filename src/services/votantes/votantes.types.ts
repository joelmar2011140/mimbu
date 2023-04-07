export interface ICriarVotante {
  bilheteDeIdentidade: string
  provincia: string
  municipio: string
  distrito: string
  bairro: string
  rua: string
  email: string
  enderecoBlockchain: string
}

export interface IAtualizarVotante extends Partial<ICriarVotante>{}