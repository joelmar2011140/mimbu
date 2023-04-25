import { IErro, IResultPaginated, ISucesso } from "@/global.types";
import { prismaVotante } from "./votantes.prisma";
import { ICriarVotante } from "./votantes.types";
import { genSalt, hash } from "bcrypt";
import { resultadoPaginado } from "@/utils/paginacao";
import { pesquisar } from "@/utils/filtros";
import ApiError from "@/utils/APIError";
import { prismaClient } from "@/lib/prisma.instance";

export async function listarVotantes(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const votantes = await prismaVotante.findMany({ include: { usuario: { select: { email: true } }, Edicao: { select: { nomeEdicao: true, categoria: { select: { nomeCategoria: true } } } } } })
  const listaDeVotantes = (sq != null) ? resultadoPaginado(pesquisar(votantes, sq, ['bilheteDeIdentidade']), pagina, porPagina) : resultadoPaginado(votantes, pagina, porPagina)
  return listaDeVotantes
}

export async function listarUmVotante(idVotante: string): Promise<ISucesso> {
  const votante = await prismaVotante.findUnique({ where: { idVotante }, include: { usuario: { select: { email: true } }, Edicao: { select: { nomeEdicao: true, categoria: { select: { nomeCategoria: true } } } } } })
  if (votante == null) {
    throw new ApiError('ApiError', 'Votante não encontrado', 404)
  }
  return {
    message: 'Votante encontrado com sucesso',
    status: 200,
    data: votante
  }
}

export async function eliminarUmVotante(idVotante: string): Promise<ISucesso> {
  const votante = await prismaVotante.findUnique({ where: { idVotante }, include: { usuario: { select: { email: true } } } })
  if (votante == null) {
    throw new ApiError('ApiError', 'Votante não encontrado', 404)
  }
  const votanteEliminado = await prismaVotante.delete({ where: { idVotante } })
  await prismaClient.usuario.delete({ where: { idUsuario: votante.usuarioIdUsuario as string} })
  if (votanteEliminado == null) {
    throw new ApiError('ApiError', 'Não foi possível eliminar este votante', 503)
  }
  return {
    message: 'Votante eliminado com sucesso',
    status: 200,
    data: votanteEliminado
  }
}

export async function criarVotante(params: ICriarVotante): Promise<ISucesso | IErro> {
  const saltos = await genSalt(12)
  const { bairro, bilheteDeIdentidade, distrito, enderecoBlockchain, email, municipio, provincia, rua } = params
  const senhaEncriptada = await hash(bilheteDeIdentidade, saltos)
  const votante = await prismaVotante.create({
    include: {
      usuario: true
    },
    data: {
      bilheteDeIdentidade,
      usuario: {
        create: {
          email,
          enderecoBlockchain,
          senha: senhaEncriptada
        }
      },
     nomeBairro: bairro,
     nomeDistrito: distrito,
     nomeMunicipio: municipio,
     nomeProvincia: provincia,
     nomeRua: rua
    }
  })
  if (votante == null) {
    throw new ApiError('ApiError', 'Não foi possível registar este votante', 503)
  }
  return {
    message: 'Votante registado com sucesso',
    status: 201,
    data: votante
  }
}