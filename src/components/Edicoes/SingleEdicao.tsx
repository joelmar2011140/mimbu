import Disclosure from "../Disclosure/Disclosure";

interface ISingleProps {
  edicao: any
}

export function showPath(url: string): string | undefined {
  const urlSplited = url.split('\\')
  const indiceUrl = urlSplited.indexOf('uploads')
  if (indiceUrl !== -1) {
    const urlSerialized = urlSplited.slice(indiceUrl)
    return urlSerialized.join('/')
  }
  return undefined
}

function SingleEdicao({ edicao }: ISingleProps) {
  const imagemEdicao = `http://localhost:3000/${showPath(edicao.capa)}`
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-cover bg-center h-96 sm:h-128 relative" style={{ backgroundImage: `url(${imagemEdicao})` }}>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-4 items-center justify-center">
          <p className="text-white text-4xl sm:text-6xl font-bold text-center  text-shadow-lg shadow-md">Votações abertas</p>
          <p className="text-white text-xl font-bold text-center shadow-md">Escolha o seu artista favorito</p>
          <p className="text-white text-xl  text-center shadow-md">Lembre-se que uma vez que tenha submetido a votação já não existirá meios de contornar a votação</p>
        </div>
      </div>
      <div className="max-w mx-auto  bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <Disclosure categorias={edicao.categoria} />
      </div>
    </div>
  );
}

export default SingleEdicao