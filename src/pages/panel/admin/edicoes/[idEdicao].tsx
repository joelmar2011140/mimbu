import useBlockChain from '@/hooks/useBlockchain'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useStoreActions } from 'easy-peasy'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { fetchEdicao } from '@/lib/fetch.functions'
import { showPath } from '@/components/Disclosure/Disclosure'
import { Card, Text, Metric } from "@tremor/react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const edicao = await fetchEdicao(ctx.params.idEdicao)
  if (ctx.req.cookies.jwt == null) {
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      },
    }
  }
  const jwt = JSON.parse(ctx.req.cookies.jwt)
  if (jwt.role !== 'admin') {
    return {
      redirect: {
        permanent: true,
        destination: `/`
      },
    }
  }
  return {
    props: {
      edicao
    }
  }
}

export default function DashboardSingleEdicaoPage({ edicao }: any) {
  const { blockChain } = useBlockChain()
  const [votosCategoria, setVotosCategoria] = useState([])
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const roteador = useRouter()

  useEffect(() => {
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain, clearAll, roteador])
  

  async function votosCategriaEdicao(edicao: string, categoria: string) {
    let votes
    if (blockChain != null && blockChain.contrato != null) {
      const votos = await blockChain.contrato.votosPorCategoria(edicao, categoria)
      votes = votos.toNumber()  
    }
    return votes
  }

  useEffect(() => {
    async function fetchVotosCategoria() {
      const votos = await Promise.all(
        edicao.categoria.map(async (cat:any) => {
          const totalVotos = await votosCategriaEdicao(edicao.nomeEdicao, cat.nomeCategoria)
          return { id: cat.idCategoria, totalVotos }
        })
      )
      setVotosCategoria(votos)
    }
    fetchVotosCategoria()
  }, [edicao])

  return (
    <DashboardLayout>
      <div className='mx-auto p-4 flex flex-col gap-4'>
      <img className="w-full  h-64" src={`http://localhost:3000/${showPath(edicao.capa)}`} />
      <h1 className='font-bold mt-8 text-4xl text-gray-700'>{edicao.nomeEdicao}</h1>
      <h4 className='p-2 bg-black text-white text-xl'>Categorias</h4>
      {
        edicao.categoria.map((cat:any) => {
          const totalVotos = votosCategoria.find((v) => v.id === cat.idCategoria)?.totalVotos ?? 0
          return (
            <Card key={cat.idCategoria} className="max-w-xs mx-auto">
            <Text>{cat.nomeCategoria}</Text>
            <Metric>total votos: {totalVotos}</Metric>
            </Card>
          )
        })
      }
      </div>
    </DashboardLayout>
  )

}
