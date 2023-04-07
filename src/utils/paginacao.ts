import { paginate } from 'arrpag'
import { IResultPaginated } from '@/global.types'

export async function resultadoPaginado (conteudo: any, pagina: number, porPagina: number): Promise<IResultPaginated> {
  const pagination = paginate(conteudo, pagina, porPagina)
  const successResponse = { codigo: 200, mensagem: 'Lista retornada com sucesso' }
  return {
    data: (conteudo.length === 0) ? [] : pagination.results,
    quantidadeTotalItems: pagination.totalResults,
    retorno: successResponse,
    paginator: {
      currentPage: pagination.currentPage,
      nextPage: pagination.nextPage,
      pages: pagination.pages,
      perPage: pagination.perPage,
      prevPage: pagination.prevPage,
      totalCurrentResults: pagination.totalCurrentResults,
      totalResults: pagination.totalResults
    }
  }
}
