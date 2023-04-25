import { IResultPaginated, ISucesso } from "@/global.types";
import { prismaArtistas } from "./artistas.prisma";
import { IAdicionarArtista, IAtualizarArtista, IIngressarEdicao, ISairEdicao } from "./artistas.types";
import ApiError from "@/utils/APIError";
import { pesquisar } from "@/utils/filtros";
import { resultadoPaginado } from "@/utils/paginacao";
import { deleteFile } from "@/utils/utils.functions";
import moment from "moment";
import { prismaEdicao } from "../edicoes/edicoes.prisma";
import { genSalt, hash } from "bcrypt";
import { prismaCategorias } from "../categorias/categorias.prisma";
import { prismaClient } from "@/lib/prisma.instance";

export async function listarArtistas(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const artistas = await prismaArtistas.findMany({ include: { Edicao: true, categorias: true, Musica: true, usuario: { select: { email: true, genero: true } } } })
  const listaDeArtistas = (sq != null) ? resultadoPaginado(pesquisar(artistas, sq, ['nomeArtistico', 'categorias.nomeCategoria']), pagina, porPagina) : resultadoPaginado(artistas, pagina, porPagina)
  return listaDeArtistas
}

export async function registarArtista(params: IAdicionarArtista): Promise<ISucesso> {
  const saltos = await genSalt(12)
  const senhaEncriptada = await hash(params.senha, saltos)
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao: params.idEdicao }, include: { artista: true, categoria: true } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  const hoje = moment()
  const aniversario = moment(params.dataNascimento)
  const idade = hoje.diff(aniversario, "years")
  if (idade < 18) {
    throw new ApiError('APIERROR', 'Não pode concorrer pois é menor de 18 anos de idade', 422)
  }
  const dataInicioNormalizada = moment(edicao.dataComeco, 'YYYY-MM-DD', true)
  const dataFimNormalizada = moment(edicao.dataTermino, 'YYYY-MM-DD', true)
  if (edicao.categoria.length === 0) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição sem categorias', 400)
  }
  // Deve verificar se o evento já começou 
  if (dataInicioNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição que já começou', 400)
  }
  // Deve verificar se o evento já terminou 
  if (dataFimNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição que já terminou', 400)
  }
  // Verificar se categoria encontra-se nesta edição
  const categoriaAconcorrer = edicao.categoria.find((categoria) => (categoria.idCategoria === params.idCategoria))
  if (categoriaAconcorrer == null) {
    throw new ApiError('APIERROR', 'Certifique-se que esta categoria encontra-se nesta edição', 422)
  }
  if (edicao.artista.find((artista) => (artista.telefone === params.telefone)) != null) {
    throw new ApiError('APIERROR', 'Este artista encontra-se cadastrado nesta edição', 422)
  }
  const artista = await prismaArtistas.create({
    include: {
      usuario: {
        select: { role: true }
      }
    },
    data: {
      dataNascimento: params.dataNascimento,
      imagemPerfil: params.imagemPerfil,
      nomeArtistico: params.nomeArtistico,
      nomeBairro: params.nomeBairro,
      nomeDistrito: params.nomeDistrito,
      nomeMunicipio: params.nomeMunicipio,
      nomeProvincia: params.nomeProvincia,
      nomeRua: params.nomeRua,
      participa: true,
      telefone: params.telefone,
      categorias: {
        connect: { idCategoria: params.idCategoria }
      },
      Edicao: {
        connect: { idEdicao: edicao.idEdicao }
      },
      usuario: {
        create: {
          email: params.email,
          enderecoBlockchain: params.enderecoBlockchain,
          genero: params.genero,
          senha: senhaEncriptada,
          role: 'artista'
        }
      },
      Musica: {
        create: {
          ano_gravacao: params.ano_gravacao,
          generoMusica: params.nomeGenero,
          link_musica: params.link_musica,
          titulo: params.titulo,
          categoria: {
            connect: { idCategoria: categoriaAconcorrer.idCategoria }
          }
        }
      }
    }
  })
  return {
    message: 'Artista registado com sucesso',
    status: 201,
    data: artista
  }
}

export async function listarUmArtista(idArtista: string): Promise<ISucesso> {
  const artista = await prismaArtistas.findUnique({ where: { idArtista }, include: { Musica: true, Edicao: true, usuario: { select: { email: true, genero: true } } } })
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  return {
    message: 'Artista listado com sucesso',
    status: 200,
    data: artista
  }
}

export async function eliminarUmArtista(idArtista: string): Promise<ISucesso> {
  const artista = await prismaArtistas.findUnique({ where: { idArtista }, include: { Musica: true } })
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  for (const musica of artista.Musica) {
    if (musica.artistaIdArtista === idArtista) {
      await prismaClient.musica.delete({ where: { idMusica: musica.idMusica } })
    }
  }
  const artistaEliminado = await prismaArtistas.delete({ where: { idArtista }, include: { usuario: true, Musica: true } })
  if (artistaEliminado == null) {
    throw new ApiError('APIERROR', 'Não foi possível eliminar este artisita', 503)
  }
  await prismaClient.usuario.delete({ where: { idUsuario: artistaEliminado.usuario?.idUsuario } })
  deleteFile(artista.imagemPerfil)
  return {
    message: 'Artista eliminado com sucesso',
    status: 200,
    data: artistaEliminado
  }
}

export async function atualizarArtista(idArtista: string, params: IAtualizarArtista): Promise<ISucesso> {
  const artista = await prismaArtistas.findUnique({ where: { idArtista } })
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  if (params.dataNascimento != null) {
    const hoje = moment()
    const aniversario = moment(params.dataNascimento)
    const idade = hoje.diff(aniversario, "years")
    if (idade < 18) {
      throw new ApiError('APIERROR', 'Não pode concorrer pois é menor de 18 anos de idade', 422)
    }
  }
  if (params.imagemPerfil != null) {
    deleteFile(artista.imagemPerfil)
  }
  if (params.email != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { usuario: { update: { email: params.email } } }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
  }
  if (params.genero != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { usuario: { update: { genero: params.genero } } }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
  }
  const { ano_gravacao, link_musica, titulo, email, genero, ...rest } = params
  const artistaAtualizado = await prismaArtistas.update({
    where: { idArtista }, data: { ...rest }
  })
  if (artistaAtualizado == null) {
    throw new ApiError('APIERROR', 'Não foi possível atualizar os dados deste artista ,tente mais tarde por favor ou contacte o adminstrador', 503)
  }
  return {
    status: 201,
    message: 'Artista atualizado com sucesso.',
    data: artistaAtualizado
  }
}

// Para ingressar numa edição
export async function ingressarEmEdicao(idArtista: string, params: IIngressarEdicao): Promise<ISucesso> {
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao: params.idEdicao }, include: { artista: true, categoria: true } })
  const artista = await prismaArtistas.findUnique({ where: { idArtista }, include: { Edicao: true } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  const hoje = moment()
  const dataInicioNormalizada = moment(edicao.dataComeco, 'YYYY-MM-DD', true)
  const dataFimNormalizada = moment(edicao.dataTermino, 'YYYY-MM-DD', true)
  if (edicao.categoria.length === 0) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição sem categorias', 400)
  }
  // Deve verificar se o evento já começou 
  if (dataInicioNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição que já começou', 400)
  }
  // Deve verificar se o evento já terminou 
  if (dataFimNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição que já terminou', 400)
  }
  // Verificar se categoria encontra-se nesta edição
  const categoriaAconcorrer = edicao.categoria.find((categoria) => (categoria.idCategoria === params.idCategoria))
  if (categoriaAconcorrer == null) {
    throw new ApiError('APIERROR', 'Certifique-se que esta categoria encontra-se nesta edição', 422)
  }
  if (edicao.artista.find((artistaF) => (artistaF.telefone === artista.telefone)) != null) {
    throw new ApiError('APIERROR', 'Este artista encontra-se cadastrado nesta edição', 422)
  }
  await prismaEdicao.update({ where: { idEdicao: edicao.idEdicao }, data: { artista: { connect: { idArtista: artista.idArtista } } } })
  await prismaCategorias.update({
    where: { idCategoria: categoriaAconcorrer.idCategoria }, data: {
      musica: {
        create: {
          ano_gravacao: params.ano_gravacao as number,
          generoMusica: params.nomeGenero as string,
          link_musica: params.link_musica as string,
          titulo: params.titulo as string,
          artistaIdArtista: artista.idArtista
        }
      }
    }
  })
  return {
    status: 201,
    message: 'Artista está a concorrer nesta edição.'
  }
}

export async function sairDeEdicao(idArtista: string, params: ISairEdicao): Promise<ISucesso> {
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao: params.idEdicao }, include: { artista: { include: { Musica: { select: { categoria: true } } } }, categoria: true } })
  const artista = await prismaArtistas.findUnique({ where: { idArtista }, include: { Edicao: true, Musica: true } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  const hoje = moment()
  const dataInicioNormalizada = moment(edicao.dataComeco, 'YYYY-MM-DD', true)
  const dataFimNormalizada = moment(edicao.dataTermino, 'YYYY-MM-DD', true)
  if (edicao.categoria.length === 0) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição sem categorias', 400)
  }
  // Deve verificar se o evento já começou 
  if (dataInicioNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode sair de uma edição que já iniciou', 400)
  }
  // Deve verificar se o evento já terminou 
  if (dataFimNormalizada.format('YYYY-MM-DD') === hoje.format('YYYY-MM-DD')) {
    throw new ApiError('APIERROR', 'Não pode sair da edição até passar o dia', 400)
  }
  // Verificar se categoria encontra-se nesta edição
  const categoriaAconcorrer = edicao.categoria.find((categoria) => (categoria.idCategoria === params.idCategoria))
  if (categoriaAconcorrer == null) {
    throw new ApiError('APIERROR', 'Certifique-se que esta categoria encontra-se nesta edição', 422)
  }
  if (edicao.artista.find((artistaF) => (artistaF.telefone === artista.telefone)) == null) {
    throw new ApiError('APIERROR', 'Este artista não está cadastrado nesta edição', 422)
  }
  await prismaEdicao.update({ where: { idEdicao: edicao.idEdicao }, data: { artista: { disconnect: { idArtista: artista.idArtista } } } })
  const categoria = await prismaCategorias.findUnique({ where: { idCategoria: categoriaAconcorrer.idCategoria }, include: { musica: { include: { artista: true, categoria: { select: { idCategoria: true } } } } } })
  for (const music of categoria?.musica as any) {
    if (music.categoria.find((cate: any) => (cate.idCategoria === categoriaAconcorrer.idCategoria))) {
      await prismaClient.musica.delete({ where: { idMusica: music.idMusica } })
    }
  }
  return {
    status: 201,
    message: 'Artista deixou de concorrer nesta edição.'
  }
}
