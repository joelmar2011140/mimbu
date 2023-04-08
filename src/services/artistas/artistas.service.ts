import { IResultPaginated, ISucesso } from "@/global.types";
import { prismaArtistas } from "./artistas.prisma";
import { IAdicionarArtista, IAtualizarArtista } from "./artistas.types";
import ApiError from "@/utils/APIError";
import { pesquisar } from "@/utils/filtros";
import { resultadoPaginado } from "@/utils/paginacao";
import { deleteFile } from "@/utils/utils.functions";
import moment from "moment";
import { prismaEdicao } from "../edicoes/edicoes.prisma";
import { genSalt, hash } from "bcrypt";
import { prismaCategorias } from "../categorias/categorias.prisma";
import { prismaClient } from "@/lib/prisma.instance";

export async function listarArtistasQueParticipam(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const artistas = await prismaArtistas.findMany({ where: { participa: true }, include: { musica: true, edicao: true, categoria: true, Provincia: true, usuario: { select: { email: true, genero: true } } } })
  const listaDeArtistas = (sq != null) ? resultadoPaginado(pesquisar(artistas, sq, ['nomeArtistico', 'categorias.nomeCategoria']), pagina, porPagina) : resultadoPaginado(artistas, pagina, porPagina)
  return listaDeArtistas
}

export async function listarArtistas(pagina: number, porPagina: number, sq?: string): Promise<IResultPaginated> {
  const artistas = await prismaArtistas.findMany({ include: { musica: true, edicao: true, categoria: true, Provincia: true, usuario: { select: { email: true, genero: true } } } })
  const listaDeArtistas = (sq != null) ? resultadoPaginado(pesquisar(artistas, sq, ['nomeArtistico', 'categorias.nomeCategoria']), pagina, porPagina) : resultadoPaginado(artistas, pagina, porPagina)
  return listaDeArtistas
}

export async function listarUmArtista(idArtista: string): Promise<ISucesso> {
  const artista = await prismaArtistas.findUnique({ where: { idArtista }, include: { musica: true, edicao: true, categoria: true, Provincia: true, usuario: { select: { email: true, genero: true } } } })
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
  const artista = await prismaArtistas.findUnique({ where: { idArtista } })
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  const artistaEliminado = await prismaArtistas.delete({ where: { idArtista }, include: { usuario: true } })
  await prismaClient.usuario.delete({ where: { idUsuario: artistaEliminado.usuario.idUsuario } })
  if (artistaEliminado == null) {
    throw new ApiError('APIERROR', 'Não foi possível eliminar este artisita', 503)
  }
  deleteFile(artista.imagemPerfil)
  return {
    message: 'Artista eliminado com sucesso',
    status: 200,
    data: artistaEliminado
  }
}

export async function registarArtista(params: IAdicionarArtista): Promise<ISucesso> {
  const saltos = await genSalt(12)
  const senhaEncriptada = await hash(params.senha, saltos)
  const hoje = moment()
  const edicao = await prismaEdicao.findUnique({ where: { idEdicao: params.idEdicao }, include: { categorias: true } })
  const categoria = await prismaCategorias.findUnique({ where: { idCategoria: params.idCategoria } })
  if (edicao == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a edição correta', 404)
  }
  if (edicao.categorias.length < 0) {
    throw new ApiError('APIERROR', 'Não pode concorrer à uma edição sem categoria', 422)
  }
  if (categoria == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu a categoria correta', 404)
  }
  // Deve verificar se na edição em que o mesmo quer se candidatar tem esta categoria
  for (const cate of edicao.categorias) {
    if (cate.idCategoria !== params.idCategoria) {
      throw new ApiError('APIERROR', 'Não pode concorrer à uma categoria que não encontra-se presente nesta edição', 422)
    }
  }
  const dataNormalizada = moment(edicao.dataTermino, 'YYYY-MM-DD', true)
  if (hoje.isAfter(dataNormalizada)) {
    throw new ApiError('APIERROR', 'Não pode candidatar-se nesta edição pois já terminou', 422)
  }
  const artista = await prismaArtistas.create({
    data: {
      nomeArtistico: params.nomeArtistico,
      dataNascimento: params.dataNascimento,
      imagemPerfil: params.imagemPerfil,
      participa: true,
      telefone: parseInt(params.telefone),
      usuario: {
        create: {
          email: params.email,
          enderecoBlockchain: params.enderecoBlockchain,
          genero: params.genero,
          senha: senhaEncriptada,
          role: 'artista'
        }
      },
      edicao: {
        connect: {
          idEdicao: params.idEdicao
        }
      },
      categoria: {
        connect: {
          idCategoria: params.idCategoria
        }
      },
      musica: {
        create: {
          ano_gravacao: params.ano_gravacao,
          link_musica: params.link_musica,
          titulo: params.titulo,
          generos: {
            connectOrCreate: {
              where: {
                nomeGenero: params.nomeGenero
              },
              create: {
                nomeGenero: params.nomeGenero
              }
            }
          }
        }
      },
      Provincia: {
        connectOrCreate: {
          where: {
            nomeProvincia: params.nomeProvincia
          },
          create: {
            nomeProvincia: params.nomeProvincia,
            municipios: {
              connectOrCreate: {
                where: {
                  nomeMunicipio: params?.nomeMunicipio as string,
                },
                create: {
                  nomeMunicipio: params?.nomeMunicipio as string,
                  distritos: {
                    connectOrCreate: {
                      where: { nomeDistrito: params.nomeDistrito },
                      create: { nomeDistrito: params.nomeDistrito }
                    }
                  },
                  bairros: {
                    connectOrCreate: {
                      where: {
                        nomeBairro: params.nomeBairro
                      },
                      create: {
                        nomeBairro: params.nomeBairro,
                        ruas: {
                          connectOrCreate: {
                            where: {
                              nomeRua: params.nomeRua
                            },
                            create: {
                              nomeRua: params.nomeRua
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
    }
  })
  return {
    message: 'Artista registado com sucesso',
    status: 201,
    data: artista
  }
}

export async function atualizarArtista(idArtista: string, params: IAtualizarArtista): Promise<ISucesso> {
  const artista = await prismaArtistas.findUnique({ where: { idArtista } })
  if (artista == null) {
    throw new ApiError('APIERROR', 'Certifique-se que escolheu o artista correto', 404)
  }
  if (params.imagemPerfil != null) {
    deleteFile(artista.imagemPerfil)
  }
  if (params.telefone != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { telefone: Number(params.telefone) }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
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
  if (params.ano_gravacao != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { musica: { update: { ano_gravacao: params.ano_gravacao } } }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
  }
  if (params.titulo != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { musica: { update: { titulo: params.titulo } } }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
  }
  if (params.link_musica != null) {
    const artistaAtualizado = await prismaArtistas.update({
      where: { idArtista }, data: { musica: { update: { link_musica: params.link_musica } } }
    })
    return {
      status: 201,
      message: 'Artista atualizado com sucesso.',
      data: artistaAtualizado
    }
  }
  const { ano_gravacao, link_musica, titulo, email, telefone, genero, ...rest } = params
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