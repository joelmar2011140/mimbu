import ListaEdicoes from '@/components/Edicoes/ListaEdicoes'
import Loading from '@/components/Loading'
import useBlockChain from '@/hooks/useBlockchain'
import { StandardLayout } from '@/layouts/StandardLayout'
import { fetchEdicoesUser } from '@/lib/fetch.functions'
import { useStoreActions } from 'easy-peasy'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { perfilVotante } from '@/lib/create.functions'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (ctx.req.cookies.jwt == null) {
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      },
    }
  }
  const token = JSON.parse(ctx.req.cookies.jwt).token
  const votante = await perfilVotante(token)
  return {
    props: {
      votante
    }
  }
}

export default function EdicoesPage(props: any) {
  const roteador = useRouter()
  const { blockChain } = useBlockChain()
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const setVotante = useStoreActions((accao: any) => accao.setVotante)
  const limparEdicao = useStoreActions((actions: any) => actions.clearEdicao)
  const { data, isLoading } = useQuery('edicoes', fetchEdicoesUser)

  useEffect(() => {
    limparEdicao()
  }, [])

  useEffect(() => {
    setVotante(props.votante)
  }, [props, setVotante])
  

  useEffect(() => {
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain])

  return (
    <StandardLayout tituloDaPagina='Lista de edições' descricao='Mimbu'>
      <div className="flex justify-center items-center  min-h-screen">
        {
          isLoading ? (<Loading />) : (
            <div className="max-w-7xl p-6 bg-black w-full px-4 sm:px-6 lg:px-8">
              {(data.length === 0) ? <h1 className='text-white text-2xl text-center'>Nã existem concursos😔</h1> : <ListaEdicoes data={data} />}
            </div>
          )
        }
      </div>
    </StandardLayout>
  )
}
