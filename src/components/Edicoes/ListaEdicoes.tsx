import EdicaoCard, { IEdicaoCardProps } from "./EdicaoCard"

interface IListaEdicoesProps {
  data: IEdicaoCardProps[]
}

export default function ListaEdicoes({ data }: IListaEdicoesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { data.map((edicao: IEdicaoCardProps) => (<EdicaoCard key={edicao.idEdicao} {...edicao} />)) }
    </div>
  )
}
