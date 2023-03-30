import { ReactNode } from "react";

export interface IProvider {
  children: ReactNode
}

export interface IStandardLayout extends IProvider {
  tituloDaPagina: string
  descricao: string
}