import { IErro, IResultPaginated, ISucesso } from "@/global.types";
import { prismaCategorias } from "./categorias.prisma";
import { IAtualizarCategoria, ICriarCategoria } from "./categorias.types";
import { resultadoPaginado } from "@/utils/paginacao";
import { pesquisar } from "@/utils/filtros";
import ApiError from "@/utils/APIError";

export async function listarCategorias (pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const categorias = await prismaCategorias.findMany()
  const listaDeCategorias = (sq != null) ?  resultadoPaginado(pesquisar(categorias, sq, ['nomeCategoria']), pagina, porPagina) : resultadoPaginado(categorias, pagina, porPagina)
  return listaDeCategorias
}

export async function listarUmaCategoria (idCategoria: string): Promise<ISucesso | IErro> {
  const categoria = await prismaCategorias.findUnique({ where: { idCategoria }})
  if (categoria == null) {
    throw new ApiError('ApiError', 'Categoria não encontrada', 404)
  }
  return {
    message: 'Categoria encontrada com sucesso',
    status: 200,
    data: categoria
  }
}

export async function eliminarUmaCategoria (idCategoria: string): Promise<ISucesso> {
  const categoria = await prismaCategorias.findUnique({ where: { idCategoria }})
  if (categoria == null) {
    throw new ApiError('ApiError', 'Categoria não encontrada', 404)
  }
  const categoriaEliminada = await prismaCategorias.delete({ where: { idCategoria } })
  return {
    message: 'Categoria eliminada com sucesso',
    status: 200,
    data: categoriaEliminada
  }
}

export async function atualizarUmaCategoria (idCategoria: string, params: IAtualizarCategoria): Promise<ISucesso> {
  const categoria = await prismaCategorias.findUnique({ where: { idCategoria }})
  if (categoria == null) {
    throw new ApiError('ApiError', 'Categoria não encontrada', 404)
  }
  const categoriaAtualizada = await prismaCategorias.update({ where: { idCategoria }, data: { ...params } })
  return {
    message: 'Categoria atualizada com sucesso',
    status: 200,
    data: categoriaAtualizada
  }
}

export async function criarCategoria(params: ICriarCategoria): Promise<ISucesso | IErro> {
  const { nomeCategoria } = params
  const categoria = await prismaCategorias.create({
    data: {
      nomeCategoria
    }
  })
  if (categoria == null) {
    throw new ApiError('ApiError', 'Categoria não encontrada', 404)
  }
  return {
    message: 'Categoria registada com sucesso',
    status: 201,
    data: categoria
  }
}