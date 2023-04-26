import { CardLisEdicoes } from '@/components/Tabela'
import useBlockChain from '@/hooks/useBlockchain'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { perfilArtista } from '@/services/auth/login.service'
import { useStoreActions } from 'easy-peasy'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next/types'
import React, { useEffect } from 'react'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (ctx.req.cookies.jwt == null) {
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      },
    }
  }
  const jwt = JSON.parse(ctx.req.cookies.jwt)
  if (jwt.role !== 'artista') {
    return {
      redirect: {
        permanent: true,
        destination: `/`
      },
    }
  }
  const artista = await perfilArtista(jwt.token)
  if (artista == null) {
    ctx.res.setHeader('Set-Cookie', `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      },
    }
  }
  return {
    props: {
      artista: {
        email: artista.artista?.email,
        genero: artista.artista?.genero,
        nomeArtistico: artista.artista?.Artista[0].nomeArtistico,
        idArtista: artista.artista?.Artista[0].idArtista,
        telefone: artista.artista?.Artista[0].telefone,
        dataNascimento: artista.artista?.Artista[0].dataNascimento,
        imagemPerfil: artista.artista?.Artista[0].imagemPerfil,
        nomeProvincia: artista.artista?.Artista[0].nomeProvincia,
        nomeMunicipio: artista.artista?.Artista[0].nomeMunicipio,
        nomeDistrito: artista.artista?.Artista[0].nomeDistrito,
        nomeBairro: artista.artista?.Artista[0].nomeBairro,
        nomeRua: artista.artista?.Artista[0].nomeRua,
        edicoes: artista.artista.edicoes
      }
    }
  }
}

export default function MeusVotosArtistaPage({ artista }: any) {
  const { blockChain } = useBlockChain()
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const setArtista = useStoreActions((accao: any) => accao.setArtista)
  const roteador = useRouter()

  useEffect(() => {
    setArtista(artista)
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        console.log(contas[0]);
        
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain, clearAll, roteador, artista, setArtista])

  return (
    <DashboardLayout>
      <CardLisEdicoes />
    </DashboardLayout>
  )
}
