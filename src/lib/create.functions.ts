import jwt from 'jsonwebtoken'
import { ILoginParams } from "@/services/auth/login.types"
import { prismaClient } from './prisma.instance'

export interface IRegistarVotanteParams {
  bilheteDeIdentidade: string
  provincia: string
  municipio: string
  distrito: string
  bairro: string
  rua: string
  email: string
}

export async function registarVotante(params: IRegistarVotanteParams) {
  try {
    const request = await fetch('http://localhost:3000/api/votantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    const rawData = await request.json()
    return rawData
  } catch (err: any) {
    console.error('Erro aqui: ', err)
  }
}

export async function loginUser(params: ILoginParams) {
  try {
    const request = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    const rawData = await request.json()
    return rawData
  } catch (err: any) {
    console.error('Erro aqui: ', err)
  }
}

export async function perfilVotante (token: string) {
  try {
    const request = await fetch('http://localhost:3000/api/auth/perfilVotante', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token})
    })
    const rawData = await request.json()
    return rawData
  } catch (err: any) {
    console.error('Erro aqui: ', err)
  }
}
