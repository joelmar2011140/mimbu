import SingleEdicao from "@/components/Edicoes/SingleEdicao";
import { StandardLayout } from "@/layouts/StandardLayout";
import { fetchEdicao } from "@/lib/fetch.functions";

export function showPath(url: string): string | undefined {
  const urlSplited = url.split('\\')
  const indiceUrl = urlSplited.indexOf('uploads')
  if (indiceUrl !== -1) {
    const urlSerialized = urlSplited.slice(indiceUrl)
    return urlSerialized.join('/')
  }
  return undefined
}

export async function getServerSideProps (props: any) {
  const edicao = await fetchEdicao(props.params.idEdicao)
  return {
    props: {edicao}
  }
}

export default function SingleEdicaoPage({ edicao }: any) {
  return (
    <StandardLayout tituloDaPagina={`Edição ${edicao.nomeEdicao}`} descricao="Mimbu">
      {/* <SingleEdicao cards={edicao.artistas} disclosures={edicao.categorias} imagemEdicao={`http://localhost:3000/${showPath(edicao.capa)}`} /> */}
      { JSON.stringify(edicao, null, 2) }
    </StandardLayout>
  )
}
