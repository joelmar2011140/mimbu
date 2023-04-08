import { NextApiRequest, NextApiResponse } from 'next'
import { validarRegistoCategoria, validarAtualizarCategoria } from './categorias.validations'
import { criarCategoria, atualizarUmaCategoria, eliminarUmaCategoria, listarCategorias, listarUmaCategoria } from './categorias.service'
import { IErro, ISucesso } from '@/global.types'

export async function listarCategoriasHttp(req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {

    const pagina = parseInt(req.query.pagina as string)
    const porPagina = parseInt(req.query.porPagina as string)
    const sq = req.query.sq as string
    const data = await listarCategorias(pagina, porPagina, sq)
    return res.status(200).json({
      message: 'Lista retornada com sucesso',
      status: 200,
      data
    })
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'ApiError') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
  }
}

export async function listarUmaCategoriaHttp(req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {
    const data = await listarUmaCategoria(req.query.idCategoria as string)
    return res.status(data.status).json(data)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'ApiError') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
  }
}

export async function atualizarUmaCategoriaHttp(req: NextApiRequest, res: NextApiResponse<ISucesso | IErro>): Promise<any> {
  try {
    const dataIncoming = await validarAtualizarCategoria.validateAsync(req.body)
    const data = await atualizarUmaCategoria(req.query.idCategoria as string, dataIncoming)
    return res.status(data.status).json(data)
  } catch (err: any) {
    console.error(err)
    if (err.name === 'ValidationError') {
      for (const detalhe of err.details) {
        return res.status(400).json({
          status: 400,
          message: detalhe.message
        })
      }
    } if (err.nomeErro === 'ApiError') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
  }
}

export async function eliminarUmaCategoriaHttp(req: NextApiRequest, res: NextApiResponse<ISucesso | IErro>): Promise<any> {
  try {
    const data = await eliminarUmaCategoria(req.query.idCategoria as string)
    return res.status(data.status).json(data)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'ApiError') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
  }
}

export async function criarCategoriaHttp(req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {
    const data = await validarRegistoCategoria.validateAsync(req.body)
    const response = await criarCategoria(data)
    return res.status(response.status).json(data)
  } catch (err: any) {
    console.error(err)
    if (err.nomeErro === 'ApiError') {
      const erro: IErro = {
        message: err.mensagem,
        status: err.status
      }
      return res.status(erro.status).json(erro)
    }
    if (err.name === 'ValidationError') {
      for (const detalhe of err.details) {
        return res.status(400).json({
          status: 400,
          message: detalhe.message
        })
      }
    }
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 409,
        message: 'Já existe uma categoria associada à este nome'
      })
    }
  }
}