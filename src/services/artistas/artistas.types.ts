export interface IAdicionarArtista {
  nomeArtistico: string
  dataNascimento: string
  genero: string
  imagemPerfil: any
  nomeProvincia: string
  nomeMunicipio: string
  nomeDistrito: string
  nomeBairro: string
  nomeRua: string
  titulo: string
  link_musica: string
  ano_gravacao: number
  enderecoBlockchain: string
  nomeGenero: string
  idEdicao: string
  idCategoria: string
  email: string
  telefone: string
  senha: string
}

export interface IAtualizarArtista extends Partial<IAdicionarArtista> {}
export interface IIngressarEdicao {
  titulo: string
  link_musica: string
  ano_gravacao: number
  nomeGenero: string
  idEdicao: string
  idCategoria: string
}
export interface ISairEdicao {
  idEdicao: string
  idCategoria: string
}
