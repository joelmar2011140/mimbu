import { showPath } from '@/components/Edicoes/SingleEdicao'
import { CardListArtistas } from '@/components/Tabela'
import useBlockChain from '@/hooks/useBlockchain'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { perfilArtista } from '@/services/auth/login.service'
import { useStoreActions, useStoreState } from 'easy-peasy'
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
        idArtista: artista.artista?.Artista[0].idArtista,
        genero: artista.artista?.genero,
        nomeArtistico: artista.artista?.Artista[0].nomeArtistico,
        telefone: artista.artista?.Artista[0].telefone,
        dataNascimento: artista.artista?.Artista[0].dataNascimento,
        imagemPerfil: artista.artista?.Artista[0].imagemPerfil,
        nomeProvincia: artista.artista?.Artista[0].nomeProvincia,
        nomeMunicipio: artista.artista?.Artista[0].nomeMunicipio,
        nomeDistrito: artista.artista?.Artista[0].nomeDistrito,
        nomeBairro: artista.artista?.Artista[0].nomeBairro,
        nomeRua: artista.artista?.Artista[0].nomeRua,
      }
    }
  }
}

export default function PerfilArtistaPage({ artista }: any) {
  const { blockChain } = useBlockChain()
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const setArtista = useStoreActions((accao: any) => accao.setArtista)
  const roteador = useRouter()

  useEffect(() => {
    setArtista(artista)
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain, clearAll, roteador, artista, setArtista])

  return (
    <DashboardLayout>
    <div className="bg-white max-w-4xl mx-auto mt-16 shadow overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
            { artista.nomeArtistico }
        </h3>
        
    </div>
    <div className="border-t border-gray-200">
        <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    Nome artístico
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                { artista.nomeArtistico }
                </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    Género
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                { artista.genero }
                </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    Email 
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                { artista.email }
                </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    Telefone
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                { artista.telefone }
                </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    Data de nascimento
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(artista.dataNascimento).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}
                </dd>
            </div>
        </dl>
    </div>
</div>
    </DashboardLayout>
  )
}
