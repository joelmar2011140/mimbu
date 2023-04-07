export interface ICriarEdicao {
  nomeEdicao: string
  dataComeco: string
  dataTermino: string
  categorias: string[]
  capa: string
}

export interface IAtualizarEdicao extends Partial<ICriarEdicao> {}