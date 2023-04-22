import { IResultPaginated, ISucesso } from "@/global.types";
import { prismaEdicao } from "./edicoes.prisma";
import { ICriarEdicao, IAtualizarEdicao } from "./edicoes.types";
import ApiError from "@/utils/APIError";
import { pesquisar } from "@/utils/filtros";
import { resultadoPaginado } from "@/utils/paginacao";
import { verificarData, verificarDatas } from "@/utils/data";
import { prismaCategorias } from "../categorias/categorias.prisma";
import { deleteFile } from "@/utils/utils.functions";

export async function listarEdicoes(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const edicoes = await prismaEdicao.findMany({ include: { categoria: { select: { nomeCategoria: true } } } })
  const listaDeEdicoes = (sq != null) ? resultadoPaginado(pesquisar(edicoes, sq, ['categorias.nomeCategoria', 'nomeEdicao']), pagina, porPagina) : resultadoPaginado(edicoes, pagina, porPagina)
  return listaDeEdicoes
}

export async function listarUmaEdicao(idEdicao: string): Promise<ISucesso> {
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao }, include: { categoria: { include: { artistas: true } } } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  return {
    message: 'Edição listada com sucesso',
    status: 200,
    data: edicao
  }
}

export async function eliminarUmaEdicao(idEdicao: string): Promise<ISucesso> {
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao }, include: { categoria: true } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  const edicaoEliminada = await prismaEdicao.delete({ where: { idEdicao: edicao.idEdicao } })
  if (edicaoEliminada == null) {
    throw new ApiError('APIERROR', 'Não foi possível eliminar esta edição', 404)
  }
  deleteFile(edicaoEliminada.capa)
  return {
    message: 'Edição eliminada com sucesso',
    status: 200,
    data: edicao
  }
}

export async function criarEdicao(params: ICriarEdicao): Promise<ISucesso> {
  const categoriasForEvento: any[] = []
  // verificação das datas
  verificarDatas(params.dataComeco, params.dataTermino)
  // Verificar se a categoria indica existe
  for await (const idCategoria of params.categorias) {
    const categoria = await prismaCategorias.findUnique({ where: { idCategoria } })
    if (categoria == null) {
      throw new ApiError('APIERROR', 'Certifique-se por favor que escolheu a categoria correta', 422)
    }
    categoriasForEvento.push({ idCategoria: categoria.idCategoria, nomeDaCategoria: categoria.nomeCategoria })
  }
  const edicao = await prismaEdicao.create({
    data: {
      capa: params.capa,
      dataComeco: params.dataComeco,
      dataTermino: params.dataTermino,
      nomeEdicao: params.nomeEdicao,
      categoria: {
        connect: categoriasForEvento.map(categoria => ({ idCategoria: categoria.idCategoria }))
      }
    }
  })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Não foi possível registar esta edição', 503)
  }
  return {
    message: 'Edição criada com sucesso',
    status: 201,
    data: edicao
  }
}

export async function atualizarEdicao(idEdicao: string, params: IAtualizarEdicao): Promise<ISucesso> {
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao }, include: { categoria: true } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se por favor que escolheu a edição correta', 404)
  }
  if (params.capa != null) {
    deleteFile(edicao.capa)
  }
  if (params.dataComeco != null && params.dataTermino != null) {
    verificarDatas(params.dataComeco, params.dataTermino)
  }
  if (params.dataComeco != null) {
    verificarData('dataInicio', params.dataComeco, edicao.dataTermino)
  }
  if (params.dataTermino != null) {
    verificarData('datafim', params.dataTermino, edicao.dataComeco)
  }

  if (params.categorias != null && params.categorias?.length > 0) {
    // Verificar se uma das categorias encontra-se ativa
    for await (const idCategoria of params.categorias) {
      const categoria = await prismaCategorias.findUnique({ where: { idCategoria } })

      if (categoria == null) {
        throw new ApiError('APIERROR', 'Certifique-se que escolheu a categoria correta', 404)
      }
      const edicaoAtualizada = await prismaEdicao.update({ where: { idEdicao }, data: { categoria: { connect: { idCategoria: categoria.idCategoria } } } });
      return {
        status: 201,
        message: 'Edição atualizada com sucesso.',
        data: edicaoAtualizada
      }
    }
  }
  const { categorias, ...rest } = params
  const edicaoAtualizada = await prismaEdicao.update({ where: { idEdicao }, data: { ...rest } })
  if (edicaoAtualizada == null) {
    throw new ApiError('APIERROR', 'Não foi possível atualizar os dados deste evento ,tente mais tarde por favor ou contacte o adminstrador', 503)
  }
  return {
    status: 201,
    message: 'Edição atualizada com sucesso.',
    data: edicaoAtualizada
  }
}