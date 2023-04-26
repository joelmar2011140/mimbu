import { fetchNoticias } from '@/lib/fetch.functions'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { StandardLayout } from '@/layouts/StandardLayout'
import { showPath } from '@/components/Disclosure/Disclosure'

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
  const noticias = await fetchNoticias()
  console.log(noticias)
  return {
    props: {
      noticias
    }
  }
}

export default function NoticiasPage({ noticias }: any) {
  return (
    <StandardLayout descricao='Notícias da mimbu' tituloDaPagina='Notícias'>
      <div className="min-w-screen mx-auto p-8  flex flex-col gap-4 items-center justify-center lg:justify-start mt-16">
        <h1 className='text-4xl'>Notícias Mimbu</h1>
        <p className='text-lg text-gray-500'>Fique atento(a) às últimas notícias</p>
        {
          (noticias.length === 0) ? (<h1>Ooops não há notícias por enquanto 😔</h1>) : (
            noticias.map((noticia: any) => (
              <div key={noticia.idNoticia} className="w-2/4 shadow-md rounded-md overflow-hidden bg-white">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 bg-cover bg-center" style={{ backgroundImage: `url(http://localhost:3000/${showPath(noticia.imagemDaNoticia)})` }} />
                  <div className="p-4 md:w-2/3">
                    <h2 className="text-2xl font-bold mb-2">{noticia.tituloDaNoticia}</h2>
                    <p className="text-gray-700 leading-normal">{noticia.conteudo}</p>
                    <p>Publicado aos: {new Date(noticia.dataDaNoticia).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    </StandardLayout>
  )
}
