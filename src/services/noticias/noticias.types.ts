export interface ICriarNoticia {
  tituloDaNoticia: string
  dataDaNoticia: string
  imagemDaNoticia: string
  conteudo: string
}

export interface IAtualizarNoticia extends Partial<ICriarNoticia> {}