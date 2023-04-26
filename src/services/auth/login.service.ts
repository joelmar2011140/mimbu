import { prismaClient } from "@/lib/prisma.instance";
import { ILoginParams } from "./login.types";
import jwt from 'jsonwebtoken'
import ApiError from "@/utils/APIError";
import { compare } from 'bcrypt'
import { listarEdicoesParticipante } from "../artistas/artistas.service";

interface ILogin {
  token: string
  role: string
}

export async function validarCredentials (params: ILoginParams): Promise<ILogin> {
  const usuario = await prismaClient.usuario.findUnique({ where: { email: params.email } })
  if (usuario == null) {
    throw new ApiError('APIERROR', 'Email ou senha inválida', 401)
  }
  if (!compare(params.senha, usuario.senha)) {
    throw new ApiError('APIERROR', 'Email ou senha inválida', 401)
  }
  // Verificar a role aqui , por caso seja um admin não será necessaria esta verificação
  if (usuario.role !== 'admin') {
    if (usuario.enderecoBlockchain !== params.enderecoBlockchain) {
      throw new ApiError('APIERROR', 'Verifique por favor se esta carteira está ligada à este usuário', 401)
    }
  }
  const token = jwt.sign({ sub: usuario.idUsuario }, 'mimbu')
  return {
    token,
    role: usuario.role
  }
}

export async function perfilVotante (token: string) {
  try {
    const payload = jwt.verify(token, 'mimbu')
    const votante = await prismaClient.usuario.findUnique({ where: { idUsuario: payload.sub as string }, include: { Votante: { select: { bilheteDeIdentidade: true } } } })
    return {
      votante: {
        biVotante: votante?.Votante[0].bilheteDeIdentidade
      }
    }
  } catch (err: any) {
    console.error('Erro aqui: ', err)
  }
}

export async function perfilArtista (token: string) {
  try {
    const payload = jwt.verify(token, 'mimbu')
    const artista = await prismaClient.usuario.findUnique({ where: { idUsuario: payload.sub as string }, include: { Artista: true } })
    const edicoes = await listarEdicoesParticipante(artista?.Artista[0].idArtista as string)
    return {
      artista: {
        ...artista,
        edicoes: edicoes.data.Edicao
      }
    }
  } catch (err: any) {
    console.error('Erro aqui: ', err)
  }
}
