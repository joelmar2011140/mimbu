import { formidableInst } from "@/lib/formidableInst";
import ApiError from "@/utils/APIError";
import { listarEdicoes, atualizarEdicao, criarEdicao, eliminarUmaEdicao, listarUmaEdicao } from "./edicoes.service";
import { NextApiRequest, NextApiResponse } from "next";
import { validarAtualizarEdicao, validarRegistoEdicao } from "./edicoes.validations";
import { deleteFile, verificarImagem } from "@/utils/utils.functions";
import { IErro } from "@/global.types";

export async function listarEdicoesHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pagina = Number(req.query.pagina as string)
    const porPagina = Number(req.query.porPagina as string)
    const sq = req.query.sq as string
    const response = await listarEdicoes(pagina, porPagina, sq)
    return res.status(200).json(response)
  } catch (err: any) {
    console.error(err)
  }
}

export async function eliminarUmaEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idEdicao = req.query.idEdicao as string
    const response = await eliminarUmaEdicao(idEdicao)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
  }
}

export async function listarUmaEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idEdicao = req.query.idEdicao as string
    const response = await listarUmaEdicao(idEdicao)
    return res.status(response.status).json(response)
  } catch (err: any) {
    console.error(err)
  }
}

export async function criarEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  formidableInst.parse(req, async (err: any, fields: any, files: any) => {
    try {
      if (err != null) {
        throw err
      }
      if (files.capa == null) {
        throw new ApiError('APIERROR', 'Especifique por favor uma capa para esta edição', 422)
      }
      verificarImagem(files.capa.mimetype, files.capa.filepath)
      const { categorias, ...rest } = fields
      const incomingData = await validarRegistoEdicao.validateAsync({ ...rest, capa: files.capa.filepath, categorias: JSON.parse(fields.categorias) })
      const resposta = await criarEdicao(incomingData)
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
          message: 'Já existe uma edição com este nome',
          status: 409
        }
        return res.status(erro.status).json(erro)
      }
      deleteFile(files.capa.filepath)
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

export async function atualizarEdicaoHttp(req: NextApiRequest, res: NextApiResponse) {
  const idEdicao = req.query.idEdicao as string
  formidableInst.parse(req, async (err: any, fields: any, files: any) => {
    try {
      if (err != null) {
        throw err
      }
      if (files.capa != null) {
        verificarImagem(files.capa.mimetype, files.capa.filepath)
        const incomingData = await validarAtualizarEdicao.validateAsync({ capa: files.capa.filepath })
        const resposta = await atualizarEdicao(idEdicao, incomingData)
        return res.status(resposta.status).json(resposta)
      } if (files.categorias != null && files.categorias.length > 0) {
        const incomingData = await validarAtualizarEdicao.validateAsync({ categorias: JSON.parse(fields.categorias) })
        const resposta = await atualizarEdicao(idEdicao, incomingData)
        return res.status(resposta.status).json(resposta)
      }
      const incomingData = await validarAtualizarEdicao.validateAsync(fields)
      const resposta = await atualizarEdicao(idEdicao, incomingData)
      return res.status(resposta.status).json(resposta)
    } catch (err: any) {
      console.log('here', err)
      if (files.capa != null) {
        deleteFile(files.capa.filepath)
      }
      if (err.nomeErro === 'APIERROR') {
        const erro: IErro = {
          message: err.mensagem,
          status: err.status
        }
        return res.status(erro.status).json(erro)
      } if (err.code === 'P2002') {
        const erro: IErro = {
          message: 'Já existe uma edição com este nome',
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
