import useBlockChain from '@/hooks/useBlockchain'
import { useStoreActions } from 'easy-peasy'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (ctx.req.cookies.jwt == null) {
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      }
    }
  } if (ctx.req.cookies.jwt != null) {
    const jwt = JSON.parse(ctx.req.cookies.jwt)
    if (jwt.role !== 'artista' || jwt.role !== 'admin') {
      return {
        redirect: {
          permanent: true,
          destination: `/`
        }
      }
    }
  }
  return {
    props: {}
  }
}

export default function DashboardPage() {
  const { blockChain } = useBlockChain()
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
  }, [blockChain])

  return (
    <div>dashboard</div>
  )
}
