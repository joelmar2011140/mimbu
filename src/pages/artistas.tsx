import { fetchArtistas } from '@/lib/fetch.functions'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { StandardLayout } from '@/layouts/StandardLayout'
import { showPath } from '@/components/Disclosure/Disclosure'

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
  const artistas = await fetchArtistas()
  
  return {
    props: {
      artistas
    }
  }
}

export default function ArtistasPage({ artistas }: any) {
  return (
    <StandardLayout descricao='Artistas na mimbu' tituloDaPagina='Artistas'>
      <div className="min-w-screen mx-auto p-8  flex flex-col gap-4 items-center justify-center lg:justify-start mt-16">
        <h1 className='text-4xl'>Artistas na mimbu</h1>
        
        {
          (artistas.length === 0) ? (<h1>Ooops não há artistas cadastrados na mimbu 😔</h1>) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
            {artistas.map((artista: any) => (
              <div
                key={artista.idArtista}
                className="relative rounded-full w-24 h-24 md:w-32 md:h-32 mr-8 md:mr-12 flex-shrink-0  transition-all duration-300 transform hover:scale-105"
                style={{ backgroundImage: `url(http://localhost:3000/${showPath(artista.imagemPerfil)})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
              >
                <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <div className="bg-white p-4 rounded-md text-center">
                    <h2 className="text-2xl font-bold mb-2">{artista.nomeArtistico}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        }
      </div>
    </StandardLayout>
  )
}
