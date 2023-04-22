import ListaEdicoes from '@/components/Edicoes/ListaEdicoes'
import Loading from '@/components/Loading'
import { StandardLayout } from '@/layouts/StandardLayout'
import { fetchEdicoesUser } from '@/lib/fetch.functions'
import { useStoreActions } from 'easy-peasy'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'

export default function EdicoesPage() {
  const limparEdicao = useStoreActions((actions: any) => actions.clearEdicao)
  const { data, isLoading } = useQuery('edicoes', fetchEdicoesUser)

  useEffect(() => {
    limparEdicao()
  }, [])

  return (
    <StandardLayout tituloDaPagina='Lista de edições' descricao='Mimbu'>
      <div className="flex justify-center items-center  min-h-screen">
        <div className="max-w-7xl p-6 bg-black w-full px-4 sm:px-6 lg:px-8">
          { isLoading ? (<Loading />) : <ListaEdicoes data={data} /> }
        </div>
      </div>
    </StandardLayout>
  )
}
