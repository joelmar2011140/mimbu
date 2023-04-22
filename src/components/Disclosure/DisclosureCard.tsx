'use client'

export function showPath(url: string): string | undefined {
  const urlSplited = url.split('\\')
  const indiceUrl = urlSplited.indexOf('uploads')
  if (indiceUrl !== -1) {
    const urlSerialized = urlSplited.slice(indiceUrl)
    return urlSerialized.join('/')
  }
  return undefined
}

export interface IDisclosureCard {
  imagemPerfil: string
  link_musica: string
  nomeArtistico: string
}

function DisclosureCard({ imagemPerfil, link_musica, nomeArtistico }: IDisclosureCard) {
  return (
    <div className="bg-gray-900 w-2/6	 p-4 mb-4">
      <div className="relative">
        <div className="bg-cover bg-center h-64 " style={{ backgroundImage: `url(http://localhost:3000/${showPath(imagemPerfil)}})` }}></div>
        <div className="absolute bottom-0 left-0 bg-black px-2 py-1 rounded-tr-lg text-white">
          <div className="text-xs font-semibold">{nomeArtistico}</div>
        </div>
      </div>
      <div className="w-full p-2 flex flex-row items-center justify-between">
        <p className="text-gray-700">Total votos: 0</p>
        {/* <button className="bg-green-500 text-white p-2"><Link href={link_musica}>Ouvir Música</Link></button> */}
        <button className="bg-yellow-500 text-white p-2">Votar</button>
      </div>
    </div>
  );
}

export default DisclosureCard