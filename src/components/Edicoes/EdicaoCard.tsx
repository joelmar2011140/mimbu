import moment from "moment"
import Link from "next/link"
import { useStoreActions } from "easy-peasy"

function showPath(url: string): string | undefined {
  const urlSplited = url.split('\\')
  const indiceUrl = urlSplited.indexOf('uploads')
  if (indiceUrl !== -1) {
    const urlSerialized = urlSplited.slice(indiceUrl)
    return urlSerialized.join('/')
  }
  return undefined
}

export interface IEdicaoCardProps {
  idEdicao: string
  nomeEdicao: string
  dataComeco: string
  dataTermino?: string
  capa: string
  categorias?: any
  artistas?: any
}

export default function EdicaoCard({ capa, artistas, categorias, dataTermino, dataComeco, nomeEdicao, idEdicao }: IEdicaoCardProps) {
  const props = { capa, artistas, categorias, dataTermino, dataComeco, nomeEdicao, idEdicao }
  const setEdicaoAction = useStoreActions((actions: any) => actions.setEdicao)
  const hoje = moment()
  const imagemEdicao = `http://localhost:3000/${showPath(capa)}`
  const dataInicioNormalizada = moment(dataComeco, 'YYYY-MM-DD', true)
  const naoComecou = hoje.isBefore(dataInicioNormalizada) ? false : true
  return (
    <>
      {!naoComecou ? (
        <div className="relative h-96 cursor-not-allowed focus:cursor-auto">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imagemEdicao})` }}
          />
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 flex flex-col gap-6 justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity">
            <h2 className="text-3xl text-center font-bold bg-black p-4">{!naoComecou ? 'As votações ainda não começaram' : null}</h2>
            <p className="text-2xl">{nomeEdicao}</p>
            <p className="text-lg text-center">Votações começam no dia {new Date(dataComeco).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      ) : (<Link href= {`/edicoes/${idEdicao}`} onClick={() => setEdicaoAction(props)}>
        <div className="relative h-96 cursor-pointer">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imagemEdicao})` }}
          />
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity">
            <h2 className="text-3xl font-bold bg-black p-4">Votações abertas</h2>
            <p className="text-lg">{nomeEdicao}</p>
          </div>
        </div>
      </Link>)}
    </>
  )
}
