import { IResultPaginated, ISucesso } from "@/global.types";
import { prismaNoticias } from "./noticias.prisma";
import { IAtualizarNoticia, ICriarNoticia } from "./noticias.types";
import ApiError from "@/utils/APIError";
import { pesquisar } from "@/utils/filtros";
import { resultadoPaginado } from "@/utils/paginacao";
import { deleteFile } from "@/utils/utils.functions";

export async function listarNoticias(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const noticias = await prismaNoticias.findMany()
  const listaDeNoticias = (sq != null) ? resultadoPaginado(pesquisar(noticias, sq, ['tituloDaNoticia']), pagina, porPagina) : resultadoPaginado(noticias, pagina, porPagina)
  return listaDeNoticias
}

export async function listarUmaNoticia(idNoticia: string): Promise<ISucesso> {
  const noticia = await prismaNoticias.findUnique({ where: { idNoticia } })
  if (noticia == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a notícia correta', 404)
  }
  return {
    message: 'Notícia listada com sucesso',
    status: 200,
    data: noticia
  }
}

export async function eliminarUmaNoticia(idNoticia: string): Promise<ISucesso> {
  const noticia = await prismaNoticias.findUnique({ where: { idNoticia } })
  if (noticia == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a notícia correta', 404)
  }
  const noticiaEliminada = await prismaNoticias.delete({ where: { idNoticia } })
  if (noticiaEliminada == null) {
    throw new ApiError('APIERROR', 'Não foi possível eliminar esta notícia', 503)
  }
  deleteFile(noticiaEliminada.imagemDaNoticia)
  return {
    message: 'Notícia eliminada com sucesso',
    status: 200,
    data: noticiaEliminada
  }
}

export async function criarNoticia (params: ICriarNoticia): Promise<ISucesso> {
  const noticia = await prismaNoticias.create({
    data: {
      imagemDaNoticia: params.imagemDaNoticia,
      dataDaNoticia: params.dataDaNoticia,
      conteudo: params.conteudo,
      tituloDaNoticia: params.tituloDaNoticia,
    }
  })
  if (noticia == null) {
    throw new ApiError('APIERROR', 'Não foi possível criar esta notícia', 503)
  }
  return {
    message: 'Notícia criada com sucesso',
    status: 201,
    data: noticia
  }
}

export async function atualizarNoticia (idNoticia: string, params: IAtualizarNoticia): Promise<ISucesso> {
  const noticia = await prismaNoticias.findUnique({ where: { idNoticia } })
  if (noticia == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a notícia correta', 404)
  }
  if (params.imagemDaNoticia != null) {
    deleteFile(noticia.imagemDaNoticia)
  }
  const noticiaAtualizada = await prismaNoticias.update({ where: { idNoticia }, data: { ...params } })
  if (noticiaAtualizada == null) {
    throw new ApiError('APIERROR', 'Não foi possível atualizar os dados desta notícia ,tente mais tarde por favor ou contacte o adminstrador', 503)
  }
  return {
    status: 201,
    message: 'Noticia atualizada com sucesso.',
    data: noticiaAtualizada
  }
}