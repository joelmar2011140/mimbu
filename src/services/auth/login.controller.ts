import { NextApiRequest, NextApiResponse } from "next";
import { perfilVotante, validarCredentials } from "./login.service";
import { validarLogin } from "./login.validations";
import { IErro } from "@/global.types";
import { serialize } from 'cookie'

export async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const incomingData = await validarLogin.validateAsync(req.body)
    const payload = await validarCredentials(incomingData)
    if (!payload.token) {
      res.status(401).send("Email ou senha inválida");
      return
    }
    const cookie = serialize('jwt', JSON.stringify(payload), { path: '/', httpOnly: true })
    res.setHeader('Set-Cookie', cookie)
    return res.status(201).json({ message: 'Seja bem-vindo' })
  } catch (err: any) {
    console.log(err)
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
    res.status(500).send('Alguma coisa correu mal')
  }
}

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Set-Cookie', `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
    return res.status(201).json({ message: 'OK' })
  } catch (err: any) {
    console.error(err)
    res.status(500).send('Alguma coisa correu mal')
  }
}

export async function perfilVotanteHttp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await perfilVotante(req.body.token)
    console.log(response);
    
    return res.status(200).json(response)
  } catch (err: any) {
    console.error(err)
    res.status(500).send('Alguma coisa correu mal')
  }
}

