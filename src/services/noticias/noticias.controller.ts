import { formidableInstNoticias } from "@/lib/formidableInst";
import ApiError from "@/utils/APIError";
import { atualizarNoticia, criarNoticia, eliminarUmaNoticia, listarNoticias, listarUmaNoticia } from "./noticias.service";
import { NextApiRequest, NextApiResponse } from "next";
import { validarAtualizarNoticia, validarRegistoNoticia } from "./noticias.validations";
import { deleteFile, verificarImagem } from "@/utils/utils.functions";
import { IErro } from "@/global.types";

export async function listarNoticiasHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pagina = Number(req.query.pagina as string)
    const porPagina = Number(req.query.porPagina as string)
    const sq = req.query.sq as string
    const response = await listarNoticias(pagina, porPagina, sq)
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

export async function eliminarUmaNoticiaHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idNoticia = req.query.idNoticia as string
    const response = await eliminarUmaNoticia(idNoticia)
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
  }
}

export async function listarUmaNoticiaHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idNoticia = req.query.idNoticia as string
    const response = await listarUmaNoticia(idNoticia)
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
  }
}

export async function criarNoticiaHttp(req: NextApiRequest, res: NextApiResponse) {
  formidableInstNoticias.parse(req, async (err: any, fields: any, files: any) => {
    try {
      if (err != null) {
        throw err
      }
      if (files.imagemDaNoticia == null) {
        throw new ApiError('APIERROR', 'Especifique por favor uma imagem para esta notícia', 422)
      }
      verificarImagem(files.imagemDaNoticia.mimetype, files.imagemDaNoticia.filepath)
      const { imagemDaNoticia, ...rest } = fields
      const incomingData = await validarRegistoNoticia.validateAsync({ ...rest, imagemDaNoticia: files.imagemDaNoticia.filepath })
      const resposta = await criarNoticia(incomingData)
      return res.status(resposta.status).json(resposta)
    } catch (err: any) {
      console.log('here', err)
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
      deleteFile(files.imagemDaNoticia.filepath)
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

export async function atualizarNoticiaHttp (req: NextApiRequest, res: NextApiResponse) {
  const idNoticia = req.query.idNoticia as string
  formidableInstNoticias.parse(req, async (err: any, fields: any, files: any) => {
    try {
      if (err != null) {
        throw err
      }
      if (files.capa != null) {
        verificarImagem(files.imagemDaNoticia.mimetype, files.imagemDaNoticia.filepath)
        const incomingData = await validarAtualizarNoticia.validateAsync({ imagemDaNoticia: files.imagemDaNoticia.filepath })
        const resposta = await atualizarNoticia(idNoticia, incomingData)
        return res.status(resposta.status).json(resposta)
      }
      const incomingData = await validarAtualizarNoticia.validateAsync(fields)
      const resposta = await atualizarNoticia(idNoticia, incomingData)
      return res.status(resposta.status).json(resposta)
    } catch (err: any) {
      console.log('here', err)
      if (files.imagemDaNoticia != null) {
        deleteFile(files.imagemDaNoticia.filepath)
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
