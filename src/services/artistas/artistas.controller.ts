import { formidableInstArtista } from "@/lib/formidableInst";
import ApiError from "@/utils/APIError";
import { atualizarArtista, eliminarUmArtista, ingressarEmEdicao, listarArtistas, listarUmArtista, registarArtista, sairDeEdicao, } from "./artistas.service";
import { NextApiRequest, NextApiResponse } from "next";
import { validarAtualizarArtista, validarIngressarArtista, validarRegistoArtista, validarSairArtista } from "./artistas.validations";
import { deleteFile, verificarImagem } from "@/utils/utils.functions";
import { IErro } from "@/global.types";
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function listarArtistasHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pagina = Number(req.query.pagina as string)
    const porPagina = Number(req.query.porPagina as string)
    const sq = req.query.sq as string
    const response = await listarArtistas(pagina, porPagina, sq)
    return res.status(200).json(response)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'APIERROR') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
  }
}


export async function eliminarUmArtistaHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idArtista = req.query.idArtista as string
    const response = await eliminarUmArtista(idArtista)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'APIERROR') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
    return res.status(500).end("Something broke!");
  }
}

export async function ingressarEmEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idArtista = req.query.idArtista as string
    const incomingData = await validarIngressarArtista.validateAsync(req.body)
    const response = await ingressarEmEdicao(idArtista, incomingData)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'APIERROR') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    } if (err.name === 'ValidationError') {
      for (const errObj of err.details) {
        const erro: IErro = {
          message: errObj.message,
          status: 422
        }
        return res.status(erro.status).json(erro)
      }
    }
    return res.status(500).end("Something broke!");
  }
}

export async function sairDeEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idArtista = req.query.idArtista as string
    const incomingData = await validarSairArtista.validateAsync(req.body)
    const response = await sairDeEdicao(idArtista, incomingData)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'APIERROR') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    } if (err.name === 'ValidationError') {
      for (const errObj of err.details) {
        const erro: IErro = {
          message: errObj.message,
          status: 422
        }
        return res.status(erro.status).json(erro)
      }
    }
    return res.status(500).end("Something broke!");
  }
}

export async function listarUmArtistaHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idArtista = req.query.idArtista as string
    const response = await listarUmArtista(idArtista)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'APIERROR') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
    return res.status(500).end("Something broke!");
  }
}

export async function registarArtistaHttp(req: NextApiRequest, res: NextApiResponse) {
  formidableInstArtista.parse(req, async (err: any, fields: any, files: any) => {
    console.log(fields, files);

    try {
      if (err != null) {
        throw err
      }
      if (files.imagemPerfil == null) {
        throw new ApiError('APIERROR', 'Especifique por favor uma imagem de perfil', 422)
      }
      verificarImagem(files.imagemPerfil.mimetype, files.imagemPerfil.filepath)
      const { imagemPerfil, ...rest } = fields
      const incomingData = await validarRegistoArtista.validateAsync({ ...rest, imagemPerfil: files.imagemPerfil.filepath })
      const resposta = await registarArtista(incomingData)
      const token = jwt.sign({ sub: resposta.data.usuario.idUsuario }, 'mimbu')
      const cookie = serialize('jwt', JSON.stringify({ token, role: resposta.data.usuario.role }), { path: '/', httpOnly: true })
      res.setHeader('Set-Cookie', cookie)
      return res.status(resposta.status).json(resposta)
    } catch (err: any) {
      console.log('here', err)
      deleteFile(files.imagemPerfil.filepath)
      if (err.nomeErro === 'APIERROR') {
        const erro: IErro = {
          message: err.mensagem,
          status: err.status
        }
        return res.status(erro.status).json(erro)
      } if (err.code === 'P2002') {
        const erro: IErro = {
          message: 'Já existe um artista com estes dados',
          status: 409
        }
        return res.status(erro.status).json(erro)
      }
      if (err.name === 'ValidationError') {
        for (const errObj of err.details) {
          const erro: IErro = {
            message: errObj.message,
            status: 422
          }
          return res.status(erro.status).json(erro)
        }
      }
      return res.status(500).end("Something broke!");
    }
  })
}

export async function atualizarArtistaHttp(req: NextApiRequest, res: NextApiResponse) {
  const idArtista = req.query.idArtista as string
  formidableInstArtista.parse(req, async (err: any, fields: any, files: any) => {
    try {
      if (err != null) {
        throw err
      }
      if (files.imagemPerfil != null) {
        verificarImagem(files.imagemPerfil.mimetype, files.imagemPerfil.filepath)
        const incomingData = await validarAtualizarArtista.validateAsync({ imagemPerfil: files.imagemPerfil.filepath })
        const resposta = await atualizarArtista(idArtista, incomingData)
        return res.status(resposta.status).json(resposta)
      }
      const incomingData = await validarAtualizarArtista.validateAsync(fields)
      const resposta = await atualizarArtista(idArtista, incomingData)
      return res.status(resposta.status).json(resposta)
    } catch (err: any) {
      console.log('here', err)
      if (files.imagemPerfil != null) {
        deleteFile(files.imagemPerfil.filepath)
      }
      if (err.nomeErro === 'APIERROR') {
        const erro: IErro = {
          message: err.mensagem,
          status: err.status
        }
        return res.status(erro.status).json(erro)
      } if (err.code === 'P2002') {
        const erro: IErro = {
          message: 'Já existe uma notícia com este nome',
          status: 409
        }
        return res.status(erro.status).json(erro)
      }
      if (err.name === 'ValidationError') {
        for (const errObj of err.details) {
          const erro: IErro = {
            message: errObj.message,
            status: 422
          }
          return res.status(erro.status).json(erro)
        }
      }
      return res.status(500).end("Something broke!");
    }
  })
}
