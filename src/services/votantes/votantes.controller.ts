import { NextApiRequest, NextApiResponse } from 'next'
import { validarRegistoVotante } from '../votantes/votantes.validations'
import { criarVotante, listarVotantes, eliminarUmVotante, listarUmVotante } from '../votantes/votantes.service'
import { IErro, ISucesso } from '@/global.types'

export async function listarVotantesHttp (req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {
    const pagina = parseInt(req.query.pagina as string)
    const porPagina = parseInt(req.query.porPagina as string)
    const sq = req.query.sq as string
    const data = await listarVotantes(pagina, porPagina, sq)
    return res.status(200).json({
      message: 'Lista retornada com sucesso',
      status: 200,
      data
    })
  } catch (err: any) {
    console.error(err)
  }
}

export async function listarUmVotanteHttp (req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {
    const data = await listarUmVotante(req.query.idVotante as string)
    return res.status(data.status).json({
      message: data.message,
      status: data.status,
      data: data.data
    })
  } catch (err: any) {
    console.error(err)
  }
}

export async function eliminarUmVotanteHttp (req: NextApiRequest, res: NextApiResponse<ISucesso | IErro>): Promise<any> {
  try {
    const data = await eliminarUmVotante(req.query.idVotante as string)
    return res.status(data.status).json({
      message: data.message,
      status: data.status,
      data: data.data
    })
  } catch (err: any) {
    console.error(err)
  }
}

export async function criarVotanteHttp (req: NextApiRequest, res: NextApiResponse<ISucesso>): Promise<any> {
  try {
    const data = await validarRegistoVotante.validateAsync(req.body)
    const response = await criarVotante(data)
    return res.status(response.status).json({
      message: response.message,
      status: response.status,
      data: response.data
    })
  } catch (err: any) {
    console.error(err)
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
        message: 'Já existe alguém associado à estes dados'
      })
    }
  }
}