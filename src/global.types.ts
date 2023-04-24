import { ReactNode } from "react";

export interface IProvider {
  children: ReactNode
}

export interface IStandardLayout extends IProvider {
  tituloDaPagina: string
  descricao: string
}



export interface IErro {
  status: number
  message: string
}

export interface ISucesso {
  message: string
  status: number
  data?: any
}

export interface IResultPaginated {
  data: any[]
  quantidadeTotalItems: number
  retorno: object
  paginator: {
    totalResults: number
    pages: number
    currentPage: number
    prevPage: number
    nextPage: number
    perPage: number
    totalCurrentResults: number
  }
}