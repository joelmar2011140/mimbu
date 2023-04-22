import SingleEdicao from "@/components/Edicoes/SingleEdicao";
import { StandardLayout } from "@/layouts/StandardLayout";
import { fetchEdicao } from "@/lib/fetch.functions";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps(props: any) {
  const edicao = await fetchEdicao(props.params.idEdicao)
  return {
    props: { edicao }
  }
}

export default function SingleEdicaoPage({ edicao }: any) {
  const roteador = useRouter()
  const hoje = moment()
  const dataInicioNormalizada = moment(edicao.dataComeco, 'YYYY-MM-DD', true)

  useEffect(() => {
    if (dataInicioNormalizada.format('YYYY-MM-DD') !== hoje.format('YYYY-MM-DD')) {
      roteador.push('/')
      return 
    }
  }, [edicao, roteador])
  return (
    <StandardLayout tituloDaPagina={`Edição ${edicao.nomeEdicao}`} descricao="Mimbu">
      <SingleEdicao edicao={edicao} />
    </StandardLayout>
  )
}
